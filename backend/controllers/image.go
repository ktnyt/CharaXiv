package controllers

import (
	"context"
	"mime/multipart"
	"net/http"

	"github.com/disintegration/imaging"
	"github.com/ktnyt/charaxiv/backend/actions"
	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/internal/sid"
	"github.com/ktnyt/charaxiv/backend/internal/utils"
	"github.com/ktnyt/charaxiv/backend/models"
	"github.com/rs/zerolog"
)

func AddImage(ctx context.Context, sheetId string, f multipart.File) (string, int) {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("sheet_id", sheetId)
	})

	username, ok := app.UseUsername(ctx)
	if !ok {
		return "", http.StatusUnauthorized
	}

	logger.Debug().Msg("get sheet")
	sheet, err := actions.GetSheet(ctx, sheetId)
	if err != nil {
		logger.Error().Err(err).Msg("failed to get sheet")
		return "", app.ErrToCode(err)
	}

	if username != sheet.Owner {
		logger.Error().Msg("user does not have permission")
		return "", http.StatusUnauthorized
	}

	logger.Debug().Msg("decode image")
	img, err := imaging.Decode(f)
	if err != nil {
		logger.Error().Err(err).Msg("failed to decode image")
		return "", app.ErrBadRequest.Code()
	}

	path := sid.New()

	logger.Debug().Msg("save image")
	if err := actions.SaveImage(ctx, path, img); err != nil {
		logger.Error().Err(err).Msg("failed to save image")
		return "", app.ErrToCode(err)
	}

	logger.Debug().Msg("update sheet")
	patcher := models.SheetImagePatcher(append(sheet.Images, path))
	if err := actions.UpdateSheet(ctx, sheetId, patcher); err != nil {
		logger.Error().Err(err).Msg("failed to update sheet")
		return "", app.ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return path, http.StatusOK
}

func RemoveImage(ctx context.Context, sheetId, path string) int {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("sheet_id", sheetId).Str("name", path)
	})

	username, ok := app.UseUsername(ctx)
	if !ok {
		return http.StatusUnauthorized
	}

	logger.Debug().Msg("get sheet")
	sheet, err := actions.GetSheet(ctx, sheetId)
	if err != nil {
		logger.Error().Err(err).Msg("failed to get sheet")
		return app.ErrToCode(err)
	}

	if username != sheet.Owner {
		logger.Error().Msg("user does not have permission")
		return http.StatusUnauthorized
	}

	i := utils.IndexString(sheet.Images, path)
	if i < 0 {
		logger.Error().Msg("no image to delete")
		return http.StatusBadRequest
	}

	logger.Debug().Msg("update sheet")
	patcher := models.SheetImagePatcher(append(sheet.Images[:i], sheet.Images[i+1:]...))
	if err := actions.UpdateSheet(ctx, sheetId, patcher); err != nil {
		logger.Error().Err(err).Msg("failed to update sheet")
		return app.ErrToCode(err)
	}

	logger.Debug().Msg("delete image")
	if err := actions.DeleteImage(ctx, path); err != nil {
		logger.Warn().Err(err).Msg("failed to delete image")
	}

	logger.Debug().Msg("success")
	return http.StatusOK
}
