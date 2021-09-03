package app

import (
	"context"
	"net/http"
	"strings"

	"github.com/rs/zerolog"
)

func Authorize(check func(context.Context, string) (string, error)) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			logger := zerolog.Ctx(ctx)

			bearer := r.Header.Get("Authorization")
			token := strings.TrimPrefix(bearer, "Bearer ")

			if token != bearer {
				username, err := check(ctx, token)
				if err != nil {
					logger.Warn().Str("token", token).Err(err).Msg("failed to check identity")
				}

				if username != "" {
					logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
						return c.Str("authorized_user", username)
					})
					ctx = logger.WithContext(ctx)
					ctx = WithUsername(ctx, username)
					ctx = WithAccessToken(ctx, token)
				}
			}
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
