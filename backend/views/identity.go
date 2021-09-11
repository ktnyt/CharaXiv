package views

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/handlers"
)

func LoginView(w http.ResponseWriter, r *http.Request) {
	accessToken, code := handlers.LoginHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, accessToken)
	default:
		app.JsonError(w, r, code)
	}
}

func LogoutView(w http.ResponseWriter, r *http.Request) {
	code := handlers.LogoutHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, true)
	default:
		app.JsonError(w, r, code)
	}
}
