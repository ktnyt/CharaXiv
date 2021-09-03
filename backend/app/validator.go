package app

import (
	"context"
	"net/url"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/schema"
	"github.com/rs/zerolog"
)

var decoder = schema.NewDecoder()

var validate *validator.Validate

func init() {
	validate = validator.New()
}

type CustomValidator interface {
	Validate() error
}

// Validate decodes an object using the global Decoder.
func Validate(ctx context.Context, p interface{}, v url.Values) bool {
	logger := zerolog.Ctx(ctx)

	if err := decoder.Decode(p, v); err != nil {
		logger.Error().Err(err).Msg("failed to decode values")
		return false
	}

	if err := validate.Struct(p); err != nil {
		logger.Error().Err(err).Msg("failed to validate struct")
		return false
	}

	if val, ok := p.(CustomValidator); ok {
		if err := val.Validate(); err != nil {
			logger.Error().Err(err).Msg("failed to validate inerface")
			return false
		}
	}

	return true
}
