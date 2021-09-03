package handlers

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/controllers"
)

type UploadImageParams struct {
	SheetID string `schema:"sheet_id,required"`
}

func UploadImageHandler(r *http.Request) (string, int) {
	ctx := r.Context()

	f := app.FileRequest(r, "image")
	if f == nil {
		return "", http.StatusBadRequest
	}

	params := UploadImageParams{}
	if !app.Validate(ctx, &params, r.MultipartForm.Value) {
		return "", http.StatusBadRequest
	}

	return controllers.AddImage(ctx, params.SheetID, f)
}

type RemoveImageParams struct {
	SheetID string `json:"sheet_id" validate:"required"`
	Name    string `json:"name" validate:"required"`
}

func RemoveImageHandler(r *http.Request) int {
	ctx := r.Context()

	params := RemoveImageParams{}
	if !app.JsonRequest(r, &params) {
		return http.StatusBadRequest
	}

	return controllers.RemoveImage(ctx, params.SheetID, params.Name)
}
