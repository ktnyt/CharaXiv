package actions

import (
	"context"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/internal/lamp"
	"github.com/ktnyt/charaxiv/backend/internal/otp"
	"github.com/ktnyt/charaxiv/backend/models"
)

func UserExists(ctx context.Context, username string) (bool, error) {
	return app.UseLamp(ctx).Exists(models.UserTableName, username)
}

func CreateUser(ctx context.Context, username string, secret otp.Secret) error {
	user := models.NewUser(secret)
	return app.UseLamp(ctx).Create(models.UserTableName, username, user)
}

func UserSecret(ctx context.Context, username string) (otp.Secret, error) {
	var user models.User
	if err := app.UseLamp(ctx).Get(models.UserTableName, username, &user); err != nil {
		return nil, err
	}
	return otp.SecretFromString(user.Secret)
}

func GetSystem(ctx context.Context, username string) (string, error) {
	var user models.User
	if err := app.UseLamp(ctx).Get(models.UserTableName, username, &user); err != nil {
		return "", err
	}
	return user.System, nil
}

func SetSystem(ctx context.Context, username, system string) error {
	return app.UseLamp(ctx).Update(models.UserTableName, username, []lamp.Patch{{Key: "system", Value: system}})
}
