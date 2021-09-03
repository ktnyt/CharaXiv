package app

import (
	"context"
	"net/http"

	"github.com/ktnyt/charaxiv/backend/internal/lamp"
)

const LampContextKey AppContextKey = "lamp"

func Lamp(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		client, err := lamp.Connect(ctx, "charaxiv")
		if err != nil {
			logger := UseLogger(ctx)
			logger.Error().Err(err).Msg("failed to create lamp client")
			return
		}
		defer client.Close()

		ctx = context.WithValue(ctx, LampContextKey, client)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func UseLamp(ctx context.Context) lamp.ContextClient {
	client := ctx.Value(LampContextKey).(*lamp.Client)
	return client.WithContext(ctx)
}
