package handlers

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/controllers"
)

type LoginParams struct {
	Username string `schema:"username,required"`
	Passcode int32  `schema:"passcode,required"`
}

func LoginHandler(r *http.Request) (string, int) {
	ctx := r.Context()

	params := LoginParams{}
	if !app.Validate(ctx, &params, r.URL.Query()) {
		return "", http.StatusBadRequest
	}

	return controllers.GrantAccess(ctx, params.Username, params.Passcode)
}

func LogoutHandler(r *http.Request) int {
	return controllers.RevokeAccess(r.Context())
}
