package models

import (
	"context"
	"time"

	"github.com/ktnyt/charaxiv/backend/app"
)

const IdentityTableName = "identity"

type Identity struct {
	Username string `firestore:"username"`
	Expire   int64  `firestore:"expire"`
}

func NewIdentity(ctx context.Context, username string) Identity {
	identity := Identity{Username: username}
	identity.Refresh(ctx)
	return identity
}

func (identity *Identity) Refresh(ctx context.Context) {
	identity.Expire = app.UseTime(ctx).Add(time.Hour * 24 * 14).Unix()
}

func (identity *Identity) IsValid(ctx context.Context) bool {
	return app.UseTime(ctx).Before(time.Unix(identity.Expire, 0))
}
