package app

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/rs/zerolog"
)

func JsonRequest(r *http.Request, p interface{}) bool {
	logger := zerolog.Ctx(r.Context())

	if r.Header.Get("Content-Type") != "application/json" {
		logger.Error().Msg("Content-Type is not application/json")
		return false
	}

	dec := json.NewDecoder(r.Body)
	if err := dec.Decode(p); err != nil {
		logger.Error().Err(err).Msg("failed to decode JSON request")
		return false
	}

	if val, ok := p.(CustomValidator); ok {
		if err := val.Validate(); err != nil {
			logger.Error().Err(err).Msg("failed to validate object")
			return false
		}
	}

	return true
}

func JsonResponse(w http.ResponseWriter, r *http.Request, p interface{}) {
	logger := zerolog.Ctx(r.Context())
	buf := &bytes.Buffer{}
	enc := json.NewEncoder(buf)
	enc.SetEscapeHTML(false)

	switch err := enc.Encode(p); err {
	case nil:
		w.Header().Set("Content-Type", "application/json")
		w.Write(buf.Bytes())

	default:
		logger.Error().Err(err).Msg("failed to encode JSON response")
	}
}

func JsonError(w http.ResponseWriter, r *http.Request, code int) {
	logger := zerolog.Ctx(r.Context())
	buf := &bytes.Buffer{}
	enc := json.NewEncoder(buf)
	enc.SetEscapeHTML(false)

	switch err := enc.Encode(http.StatusText(code)); err {
	case nil:
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(code)
		w.Write(buf.Bytes())

	default:
		logger.Error().Err(err).Msg("failed to encode JSON response")
	}
}
