package main

import (
	"fmt"

	"github.com/go-chi/chi/v5"
	"github.com/ktnyt/charaxiv/backend/consts"
	"github.com/ktnyt/charaxiv/backend/views"
)

func SlugPath(slug string) string {
	return fmt.Sprintf("/{%s}", slug)
}

func SetupRoutes(r chi.Router) {
	r.Get("/", views.EmptyView)
	r.Get("/app_data", views.AppDataView)

	r.Get("/register", views.RegisterView)
	r.Get("/verify", views.VerifyView)

	r.Get("/login", views.LoginView)
	r.Get("/logout", views.LogoutView)

	r.Route("/sheet", func(r chi.Router) {
		r.Get("/", views.SheetListView)
		r.Post("/", views.SheetCreateView)
		r.Route(SlugPath(consts.SheetSlug), func(r chi.Router) {
			r.Get("/", views.SheetItemView)
			r.Put("/", views.SheetUpdateView)
			r.Delete("/", views.SheetDeleteView)
		})
	})

	r.Route("/image", func(r chi.Router) {
		r.Post("/upload", views.UploadImageView)
		r.Post("/remove", views.RemoveImageView)
	})
}
