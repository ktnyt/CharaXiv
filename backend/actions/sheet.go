package actions

import (
	"context"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/internal/lamp"
	"github.com/ktnyt/charaxiv/backend/internal/sid"
	"github.com/ktnyt/charaxiv/backend/models"
)

func ListSheets(ctx context.Context, username, system string, tags []string, offset, limit int) ([]models.Sheet, error) {
	client := app.UseLamp(ctx)

	where := lamp.Statements{
		lamp.Where("system").Is(system),
		lamp.Where("owner").Is(username),
	}

	if len(tags) > 0 {
		where.Add(lamp.Where("tags").Any(tags))
	}

	query := client.Table(models.SheetTableName).Query(
		where,
		lamp.OrderByID,
		lamp.Offset(offset),
		lamp.Limit(limit),
	)

	var sheets []models.Sheet
	err := client.RunTransaction(func(ctx context.Context, tx *lamp.Transaction) error {
		sheetIds, assign, err := tx.Query(query)
		if err != nil {
			return err
		}
		sheets = make([]models.Sheet, len(sheetIds))
		for i, sheetId := range sheetIds {
			if err := assign(i, &sheets[i]); err != nil {
				return err
			}
			if err := sheets[i].FillEmpty(sheetId); err != nil {
				return err
			}
		}
		return nil
	})
	return sheets, err
}

func CheckSheetOwner(ctx context.Context, sheetId string) error {
	username, ok := app.UseUsername(ctx)
	if !ok {
		return app.ErrUnauthorized
	}

	client := app.UseLamp(ctx)

	sheet := models.Sheet{}
	if err := client.Get(models.SheetTableName, sheetId, &sheet); err != nil {
		return err
	}

	if username != sheet.Owner {
		return app.ErrUnauthorized
	}

	return nil
}

func GetSheet(ctx context.Context, sheetId string) (models.Sheet, error) {
	var sheet models.Sheet
	if err := app.UseLamp(ctx).Get(models.SheetTableName, sheetId, &sheet); err != nil {
		return sheet, err
	}
	if err := sheet.FillEmpty(sheetId); err != nil {
		return sheet, err
	}
	return sheet, nil
}

func UpdateSheet(ctx context.Context, sheetId string, patcher lamp.Patcher) error {
	if patches := patcher.Patches(); len(patches) > 0 {
		return app.UseLamp(ctx).Update(models.SheetTableName, sheetId, patches)
	}
	return nil
}

func CreateSheet(ctx context.Context, system, owner string) (string, error) {
	sheetId := sid.New()
	sheet := models.NewSheet(system, owner)
	err := app.UseLamp(ctx).Create(models.SheetTableName, sheetId, &sheet)
	return sheetId, err
}

func DeleteSheet(ctx context.Context, sheetId string) error {
	return app.UseLamp(ctx).Delete(models.SheetTableName, sheetId)
}
