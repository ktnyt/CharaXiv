package controllers

import (
	"errors"
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/internal/lamp"
)

func ErrToCode(err error) int {
	if errors.Is(err, lamp.ErrNotFound) {
		return http.StatusNotFound
	}
	return app.ErrToCode(err)
}
