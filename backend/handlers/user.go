package handlers

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/controllers"
)

func SystemGetHandler(r *http.Request) (string, int) {
	return controllers.GetUserSystem(r.Context())
}

type SystemSetParams struct {
	System string `json:"system" validate:"required"`
}

func SystemSetHandler(r *http.Request) int {
	params := SystemSetParams{}
	if !app.JsonRequest(r, &params) {
		return http.StatusBadRequest
	}
	return controllers.SetUserSystem(r.Context(), params.System)
}
