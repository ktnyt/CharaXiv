package main

import (
	"context"
	"log"

	"github.com/ktnyt/charaxiv/backend/internal/lamp"
	"github.com/ktnyt/charaxiv/backend/models"
)

func run() error {
	ctx := context.Background()

	client, err := lamp.Connect(ctx, "charaxiv")
	if err != nil {
		return err
	}

	table := client.Table(models.SheetTableName)
	query := table.Query(lamp.Where("system").Is("emoklore"))

	var sheets []models.Sheet

	if err := client.RunTransaction(ctx, func(ctx context.Context, tx *lamp.Transaction) error {
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
	}); err != nil {
		return err
	}

	for i := range sheets {
		sheet := sheets[i]
		data := sheet.Data.(map[string]interface{})
		skilldata := data["skills"].(map[string]interface{})
		presets := skilldata["presets"].([]interface{})
		for j := range presets {
			preset := presets[j].(map[string]interface{})
			groups := preset["groups"].([]interface{})
			for k := range groups {
				group := groups[k].(map[string]interface{})
				skills := group["skills"].([]interface{})
				for l := range skills {
					skill := skills[l].(map[string]interface{})
					if bases, ok := skill["base"].([]interface{}); ok {
						skill["bases"] = bases
						delete(skill, "base")
					}
					delete(skill, "ex")
				}
			}
		}
	}

	if err := client.RunTransaction(ctx, func(ctx context.Context, tx *lamp.Transaction) error {
		for _, sheet := range sheets {
			if err := tx.Set(models.SheetTableName, sheet.SheetID, sheet); err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}
