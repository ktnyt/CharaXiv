package controllers

import (
	"context"
	"net/http"

	"github.com/ktnyt/charaxiv/backend/actions"
	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/rs/zerolog"
)

func GrantAccess(ctx context.Context, username string, passcode int32) (string, int) {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("username", username)
	})

	logger.Debug().Msg("get user secret")
	secret, err := actions.UserSecret(ctx, username)
	if err != nil {
		logger.Error().Err(err).Msg("failed to get user secret")
		return "", ErrToCode(err)
	}

	logger.Debug().Msg("verify passcode")
	if !secret.VerifyWithAmbiguity(passcode, app.UseTime(ctx).Unix()/30, 1) {
		logger.Error().Err(err).Msg("failed to verify passcode")
		return "", http.StatusUnauthorized
	}

	logger.Debug().Msg("create identity")
	accessToken, err := actions.CreateIdentity(ctx, username)
	if err != nil {
		logger.Error().Err(err).Msg("failed to create new identity")
		return "", ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return accessToken, http.StatusOK
}

func RevokeAccess(ctx context.Context) int {
	logger := app.UseLogger(ctx)

	accessToken, ok := app.UseAccessToken(ctx)
	if !ok {
		return http.StatusUnauthorized
	}

	logger.Debug().Msg("delete identity")
	if err := actions.DeleteIdentity(ctx, accessToken); err != nil {
		logger.Error().Err(err).Msg("failed to delete identity")
		return ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return http.StatusOK
}
