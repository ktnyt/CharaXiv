package views

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/handlers"
)

func SystemGetView(w http.ResponseWriter, r *http.Request) {
	system, code := handlers.SystemGetHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, system)
	default:
		app.JsonError(w, r, code)
	}
}

func SystemSetView(w http.ResponseWriter, r *http.Request) {
	code := handlers.SystemSetHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, true)
	default:
		app.JsonError(w, r, code)
	}
}
