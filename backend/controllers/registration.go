package controllers

import (
	"context"
	"net/http"
	"net/url"

	"github.com/ktnyt/charaxiv/backend/actions"
	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/rs/zerolog"
)

func Register(ctx context.Context, username string) (url.URL, int) {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("username", username)
	})

	logger.Debug().Msg("check if user exists")
	ok, err := actions.UserExists(ctx, username)
	if err != nil {
		logger.Error().Err(err).Msg("failed to check user existence")
		return url.URL{}, ErrToCode(err)
	}
	if ok {
		return url.URL{}, http.StatusBadRequest
	}

	logger.Debug().Msg("open registration")
	uri, err := actions.OpenRegistration(ctx, username)
	if err != nil {
		logger.Error().Err(err).Msg("failed to open registration")
		return url.URL{}, ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return uri, http.StatusOK
}

func Verify(ctx context.Context, username string, passcode int32) (string, int) {
	logger := app.UseLogger(ctx)
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("username", username)
	})

	logger.Debug().Msg("get registered secret")
	secret, err := actions.RegisteredSecret(ctx, username)
	if err != nil {
		logger.Error().Err(err).Msg("failed to retrieve registered secret")
		return "", ErrToCode(err)
	}

	logger.Debug().Msg("verify passcode")
	if !secret.VerifyWithAmbiguity(passcode, app.UseTime(ctx).Unix()/30, 1) {
		logger.Error().Msg("invalid passcode")
		return "", http.StatusUnauthorized
	}

	logger.Debug().Msg("create user")
	if err := actions.CreateUser(ctx, username, secret); err != nil {
		logger.Error().Err(err).Msg("failed to create new user")
		return "", ErrToCode(err)
	}

	logger.Debug().Msg("create identity")
	accessToken, err := actions.CreateIdentity(ctx, username)
	if err != nil {
		logger.Error().Err(err).Msg("failed to crete new identity")
		return "", ErrToCode(err)
	}

	logger.Debug().Msg("close registration")
	if err := actions.CloseRegistration(ctx, username); err != nil {
		logger.Error().Err(err).Msg("failed to delete registration")
		return "", ErrToCode(err)
	}

	logger.Debug().Msg("success")
	return accessToken, http.StatusOK
}
