package controllers

import (
	"context"
	"net/http"

	"github.com/ktnyt/charaxiv/backend/actions"
	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/models"
	"github.com/rs/zerolog"
)

const CharacterPageSize = 48

func AuthorizedSheets(ctx context.Context, system string, page int, tags []string) ([]models.Sheet, int) {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("system", system).Int("page", page)
	})

	username, ok := app.UseUsername(ctx)
	if !ok {
		return nil, http.StatusUnauthorized
	}

	logger.Debug().Msg("list sheets")
	offset := page * CharacterPageSize
	sheets, err := actions.ListSheets(ctx, username, system, tags, offset, CharacterPageSize)
	if err != nil {
		logger.Error().Err(err).Msg("failed to list sheets")
		return nil, ErrToCode(err)
	}
	for i := range sheets {
		sheets[i].Own = true
	}

	logger.Debug().Msg("success")
	return sheets, http.StatusOK
}

func GetSheet(ctx context.Context, sheetId string) (models.Sheet, int) {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("sheet_id", sheetId)
	})

	logger.Debug().Msg("get sheet")
	sheet, err := actions.GetSheet(ctx, sheetId)
	if err != nil {
		logger.Error().Err(err).Msg("failed to get sheet")
		return sheet, ErrToCode(err)
	}

	if username, ok := app.UseUsername(ctx); ok && username == sheet.Owner {
		sheet.Own = true
	} else {
		sheet.Own = false
	}

	logger.Debug().Msg("success")
	return sheet, http.StatusOK
}

func UpdateSheet(ctx context.Context, sheetId string, patcher models.SheetPatcher) int {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("sheet_id", sheetId)
	})

	logger.Debug().Msg("check sheet ownership")
	err := actions.CheckSheetOwner(ctx, sheetId)
	if err != nil {
		logger.Error().Err(err).Msg("failed to check sheet ownership")
		return ErrToCode(err)
	}

	logger.Debug().Msg("update sheet")
	if err := actions.UpdateSheet(ctx, sheetId, patcher); err != nil {
		logger.Error().Err(err).Msg("failed to update sheet")
		return ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return http.StatusOK
}

func CreateSheet(ctx context.Context, system string) (string, int) {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("system", system)
	})

	username, ok := app.UseUsername(ctx)
	if !ok {
		return "", http.StatusUnauthorized
	}

	logger.Debug().Msg("create sheet")
	sheetId, err := actions.CreateSheet(ctx, system, username)
	if err != nil {
		logger.Error().Err(err).Msg("failed to create sheet")
		return "", ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return sheetId, http.StatusOK
}

func DeleteSheet(ctx context.Context, sheetId string) int {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("sheet_id", sheetId)
	})

	if _, ok := app.UseUsername(ctx); !ok {
		return http.StatusUnauthorized
	}

	logger.Debug().Msg("check sheet ownership")
	if err := actions.CheckSheetOwner(ctx, sheetId); err != nil {
		logger.Error().Err(err).Msg("failed to check sheet ownership")
		return ErrToCode(err)
	}

	logger.Debug().Msg("delete sheet")
	if err := actions.DeleteSheet(ctx, sheetId); err != nil {
		logger.Error().Err(err).Msg("failed to delete sheet")
		return ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return http.StatusOK
}
