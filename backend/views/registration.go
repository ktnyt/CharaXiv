package views

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/handlers"
)

func RegisterView(w http.ResponseWriter, r *http.Request) {
	uri, code := handlers.RegisterHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, uri.String())
	default:
		app.JsonError(w, r, code)
	}
}

func VerifyView(w http.ResponseWriter, r *http.Request) {
	accessToken, code := handlers.VerifyHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, accessToken)
	default:
		app.JsonError(w, r, code)
	}
}
