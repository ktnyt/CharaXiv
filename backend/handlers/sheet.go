package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/consts"
	"github.com/ktnyt/charaxiv/backend/controllers"
	"github.com/ktnyt/charaxiv/backend/models"
)

type SheetsParams struct {
	System string `schema:"system,required"`
	Page   int    `schema:"page"`
	Tags   string `schema:"tags"`
}

func SheetListHandler(r *http.Request) ([]models.Sheet, int) {
	ctx := r.Context()

	params := SheetsParams{}
	if !app.Validate(ctx, &params, r.URL.Query()) {
		return nil, http.StatusBadRequest
	}

	page := params.Page
	if page > 0 {
		page--
	}
	tags := cleanSplit(params.Tags, ",")

	return controllers.AuthorizedSheets(ctx, params.System, page, tags)
}

func SheetItemHandler(r *http.Request) (models.Sheet, int) {
	sheetId := chi.URLParam(r, consts.SheetSlug)
	return controllers.GetSheet(r.Context(), sheetId)
}

type SheetCreateParams struct {
	System string `json:"system" validate:"required"`
}

func SheetCreateHandler(r *http.Request) (string, int) {
	ctx := r.Context()
	params := SheetCreateParams{}
	if !app.JsonRequest(r, &params) {
		return "", http.StatusBadRequest
	}
	return controllers.CreateSheet(ctx, params.System)
}

func SheetUpdateHandler(r *http.Request) int {
	sheetId := chi.URLParam(r, consts.SheetSlug)
	patcher := models.SheetPatcher{}
	if !app.JsonRequest(r, &patcher) {
		return http.StatusBadRequest
	}
	return controllers.UpdateSheet(r.Context(), sheetId, patcher)
}

func SheetDeleteHandler(r *http.Request) int {
	sheetId := chi.URLParam(r, consts.SheetSlug)
	return controllers.DeleteSheet(r.Context(), sheetId)
}
