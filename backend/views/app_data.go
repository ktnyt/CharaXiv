package views

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
)

func AppDataView(w http.ResponseWriter, r *http.Request) {
	app.JsonResponse(w, r, app.Data)
}
