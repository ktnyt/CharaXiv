package app

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

type RESTView struct {
	List    func(w http.ResponseWriter, r *http.Request)
	Create  func(w http.ResponseWriter, r *http.Request)
	Item    func(w http.ResponseWriter, r *http.Request)
	Replace func(w http.ResponseWriter, r *http.Request)
	Update  func(w http.ResponseWriter, r *http.Request)
	Delete  func(w http.ResponseWriter, r *http.Request)
}

func RegisterRESTView(r chi.Router, pattern string, view RESTView, ctx func(http.Handler) http.Handler) {
	r.Route(pattern, func(r chi.Router) {
		r.Get("/", view.List)
		r.Post("/", view.Create)
		r.Route("/{pk}", func(r chi.Router) {
			r.Use(ctx)
			r.Get("/", view.Item)
			r.Put("/", view.Update)
			r.Delete("/", view.Delete)
		})
	})
}

func NotImplementedHandler(w http.ResponseWriter, r *http.Request) {
	http.Error(w, http.StatusText(http.StatusNotImplemented), http.StatusNotImplemented)
}
