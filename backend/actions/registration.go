package actions

import (
	"context"
	"net/url"
	"time"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/internal/otp"
	"github.com/ktnyt/charaxiv/backend/models"
)

func OpenRegistration(ctx context.Context, username string) (url.URL, error) {
	secret := otp.NewSecret(20)
	uri := otp.ProvisionTOTP(app.Name, username, secret)
	registration := models.NewRegistration(secret, app.UseTime(ctx))
	err := app.UseLamp(ctx).Set(models.RegistrationTableName, username, registration)
	return uri, err
}

func RegisteredSecret(ctx context.Context, username string) (otp.Secret, error) {
	var registration models.Registration
	if err := app.UseLamp(ctx).Get(models.RegistrationTableName, username, &registration); err != nil {
		return nil, err
	}

	expire := time.Unix(registration.Expire, 0)
	if app.UseTime(ctx).After(expire) {
		return nil, app.ErrUnauthorized
	}

	return otp.SecretFromString(registration.Secret)
}

func CloseRegistration(ctx context.Context, username string) error {
	return app.UseLamp(ctx).Delete(models.RegistrationTableName, username)
}
