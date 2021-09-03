package app

import (
	"mime/multipart"
	"net/http"

	"github.com/rs/zerolog"
)

func FileRequest(r *http.Request, name string) multipart.File {
	f, _, err := r.FormFile(name)
	if err != nil {
		logger := zerolog.Ctx(r.Context())
		logger.Error().Err(err).Msgf("failed to retrieve file: %s", name)
		return nil
	}
	return f
}
