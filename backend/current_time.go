package main

import (
	"net/http"
	"time"

	"github.com/ktnyt/charaxiv/backend/app"
)

func CurrentTime(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := app.WithTime(r.Context(), time.Now())
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
