package controllers

import (
	"context"
	"net/http"

	"github.com/ktnyt/charaxiv/backend/actions"
	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/rs/zerolog"
)

func GetUserSystem(ctx context.Context) (string, int) {
	logger := app.UseLogger(ctx)

	username, ok := app.UseUsername(ctx)
	if !ok {
		return "", http.StatusUnauthorized
	}

	logger.Debug().Msg("get user system")
	system, err := actions.GetSystem(ctx, username)
	if err != nil {
		logger.Error().Err(err).Msg("failed to get system")
		return "", ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return system, http.StatusOK
}

func SetUserSystem(ctx context.Context, system string) int {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("system", system)
	})

	username, ok := app.UseUsername(ctx)
	if !ok {
		return http.StatusUnauthorized
	}

	logger.Debug().Msg("set user system")
	if err := actions.SetSystem(ctx, username, system); err != nil {
		logger.Error().Err(err).Msg("failed to set system")
		return ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return http.StatusOK
}
