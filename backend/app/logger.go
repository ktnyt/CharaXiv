package app

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/zerolog"
)

func Logger(logger zerolog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			c := logger.With()
			c = c.Str("protocol", r.Proto)
			c = c.Str("method", r.Method)
			c = c.Str("url", r.URL.String())
			if value, ok := r.Header["X-Caller"]; ok {
				c = c.Str("caller", strings.Join(value, ";"))
			}

			logger = c.Logger()

			ctx := logger.WithContext(r.Context())

			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

			t := time.Now()
			defer func() {
				logger.Info().Dur("elapsed", time.Since(t)).Msg(http.StatusText(ww.Status()))
			}()

			next.ServeHTTP(ww, r.WithContext(ctx))
		})
	}
}

func UseLogger(ctx context.Context) zerolog.Logger {
	return zerolog.Ctx(ctx).With().Logger()
}
