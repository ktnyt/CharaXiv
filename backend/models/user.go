package models

import "github.com/ktnyt/charaxiv/backend/internal/otp"

const UserTableName = "user"

type User struct {
	Secret string `firestore:"secret"`
}

func NewUser(secret otp.Secret) User {
	return User{secret.String()}
}
