package views

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/handlers"
)

func UploadImageView(w http.ResponseWriter, r *http.Request) {
	name, code := handlers.UploadImageHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, name)
	default:
		http.Error(w, http.StatusText(code), code)
	}
}

func RemoveImageView(w http.ResponseWriter, r *http.Request) {
	code := handlers.RemoveImageHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, true)
	default:
		http.Error(w, http.StatusText(code), code)
	}
}
