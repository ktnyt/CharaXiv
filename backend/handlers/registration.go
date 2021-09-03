package handlers

import (
	"errors"
	"net/http"
	"net/url"

	"github.com/go-ascii/ascii"
	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/controllers"
)

type RegisterParams struct {
	Username string `schema:"username,required"`
}

func (params RegisterParams) Validate() error {
	p := []byte(params.Username)

	if len(p) < 5 {
		return errors.New("username must be at least 5 characters long")
	}

	for i := range p {
		if !ascii.IsLatin(p[i]) {
			return errors.New("username contains non-ascii characters")
		}
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
