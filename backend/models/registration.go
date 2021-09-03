package models

import (
	"time"

	"github.com/ktnyt/charaxiv/backend/internal/otp"
)

const RegistrationTableName = "registrations"

type Registration struct {
	Secret string `firestore:"secret"`
	Expire int64  `firestore:"expire"`
}

func NewRegistration(secret otp.Secret, t time.Time) Registration {
	return Registration{
		Secret: secret.String(),
		Expire: t.Add(time.Minute * 30).Unix(),
	}
}
