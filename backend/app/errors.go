package app

import (
	"context"
	"errors"
	"net/http"
)

type HTTPError interface {
	error
	Code() int
}

type CustomHTTPError struct {
	code int
	text string
}

func NewCustomHTTPError(code int, text string) CustomHTTPError {
	return CustomHTTPError{code, text}
}

func (err CustomHTTPError) Code() int {
	return err.code
}

func (err CustomHTTPError) Error() string {
	return err.text
}

type HTTPCodeError int

func (err HTTPCodeError) Code() int {
	return int(err)
}

func (err HTTPCodeError) Error() string {
	return http.StatusText(int(err))
}

var (
	ErrNotFound     = HTTPCodeError(http.StatusNotFound)
	ErrBadRequest   = HTTPCodeError(http.StatusBadRequest)
	ErrUnauthorized = HTTPCodeError(http.StatusUnauthorized)
	ErrForbidden    = HTTPCodeError(http.StatusForbidden)
)

func ErrToCode(err error) int {
	if err == nil {
		return http.StatusOK
	}

	switch e := errors.Unwrap(err).(type) {
	case HTTPError:
		return e.Code()

	default:
		switch e {
		case context.DeadlineExceeded:
			return http.StatusRequestTimeout

		default:
			return http.StatusInternalServerError
		}
	}
}
