package models

import (
	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/internal/otp"
)

const UserTableName = "user"

type User struct {
	Secret string `firestore:"secret"`
	System string `firestore:"system"`
}

func NewUser(secret otp.Secret) User {
	return User{secret.String(), app.Data.Systems[0].Value}
}
