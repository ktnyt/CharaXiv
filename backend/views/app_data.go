package views

import (
	"net/http"

	"github.com/ktnyt/charaxiv/backend/app"
)

type System struct {
	Value string `json:"value"`
	Label string `json:"label"`
}

type AppData struct {
	Systems []System `json:"systems"`
}

var appData = AppData{
	Systems: []System{
		{Value: "emoklore", Label: "エモクロアTRPG"},
	},
}

func AppDataView(w http.ResponseWriter, r *http.Request) {
	app.JsonResponse(w, r, appData)
}
