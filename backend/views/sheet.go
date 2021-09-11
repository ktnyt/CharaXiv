package views

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/ktnyt/charaxiv/backend/handlers"
)

func SheetListView(w http.ResponseWriter, r *http.Request) {
	sheets, code := handlers.SheetListHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, sheets)
	default:
		app.JsonError(w, r, code)
	}
}

func SheetItemView(w http.ResponseWriter, r *http.Request) {
	sheet, code := handlers.SheetItemHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, sheet)
	default:
		app.JsonError(w, r, code)
	}
}

func SheetCreateView(w http.ResponseWriter, r *http.Request) {
	sheetId, code := handlers.SheetCreateHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, sheetId)
	default:
		app.JsonError(w, r, code)
	}
}

func SheetUpdateView(w http.ResponseWriter, r *http.Request) {
	code := handlers.SheetUpdateHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, true)
	default:
		app.JsonError(w, r, code)
	}
}

func SheetDeleteView(w http.ResponseWriter, r *http.Request) {
	code := handlers.SheetDeleteHandler(r)
	switch code {
	case http.StatusOK:
		app.JsonResponse(w, r, true)
	default:
		app.JsonError(w, r, code)
	}
}
