package app

type System struct {
	Value string `json:"value"`
	Label string `json:"label"`
}

type AppData struct {
	Systems []System `json:"systems"`
}

var Data = AppData{
	Systems: []System{
		{Value: "emoklore", Label: "エモクロアTRPG"},
	},
}
