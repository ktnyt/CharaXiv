package actions

import (
	"context"
	"encoding/base64"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/internal/utils"
	"github.com/ktnyt/charaxiv/backend/models"
)

func CheckIdentity(ctx context.Context, accessToken string) (string, error) {
	client := app.UseLamp(ctx)

	var identity models.Identity
	if err := client.Get(models.IdentityTableName, accessToken, &identity); err != nil {
		return "", err
	}

	if !identity.IsValid(ctx) {
		if err := client.Delete(models.IdentityTableName, accessToken); err != nil {
			return "", err
		}
		return "", app.ErrUnauthorized
	}

	identity.Refresh(ctx)
	if err := client.Set(models.IdentityTableName, accessToken, identity); err != nil {
		return "", err
	}

	return identity.Username, nil
}

func CreateIdentity(ctx context.Context, username string) (string, error) {
	p := utils.NewToken(48)
	accessToken := base64.URLEncoding.EncodeToString(p)
	identity := models.NewIdentity(ctx, username)
	err := app.UseLamp(ctx).Create(models.IdentityTableName, accessToken, identity)
	return accessToken, err
}

func DeleteIdentity(ctx context.Context, accessToken string) error {
	return app.UseLamp(ctx).Delete(models.IdentityTableName, accessToken)
}
