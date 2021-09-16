package handlers

import (
	"errors"
	"net/http"
	"net/url"
	"regexp"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/controllers"
)

type RegisterParams struct {
	Username string `schema:"username,required"`
}

var usernameRegexp = regexp.MustCompile("^[A-Za-z0-9_]{5,}$")

func (params RegisterParams) Validate() error {
	p := []byte(params.Username)

	if !usernameRegexp.Match(p) {
		return errors.New("username must match regexp")
	}

	return nil
}

func RegisterHandler(r *http.Request) (url.URL, int) {
	ctx := r.Context()

	params := RegisterParams{}
	if !app.Validate(ctx, &params, r.URL.Query()) {
		return url.URL{}, http.StatusBadRequest
	}

	return controllers.Register(ctx, params.Username)
}

type VerifyParams struct {
	Username string `schema:"username,required"`
	Passcode int32  `schema:"passcode,required"`
}

func VerifyHandler(r *http.Request) (string, int) {
	ctx := r.Context()

	params := VerifyParams{}
	if !app.Validate(ctx, &params, r.URL.Query()) {
		return "", http.StatusBadRequest
	}

	return controllers.Verify(ctx, params.Username, params.Passcode)
}
