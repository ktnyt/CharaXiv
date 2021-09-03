package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/ktnyt/charaxiv/backend/actions"
	"github.com/ktnyt/charaxiv/backend/app"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	w := zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339}
	logger := log.Output(w).Level(zerolog.TraceLevel)

	r := chi.NewMux()

	corsOpts := cors.Options{
		AllowedOrigins:   []string{os.Getenv("FRONTEND_HOST")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"X-PINGOTHER", "Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}

	r.Use(
		app.Logger(logger),
		cors.Handler(corsOpts),
		app.Lamp,
		app.Authorize(actions.CheckIdentity),
		CurrentTime,
		middleware.Timeout(time.Second*60),
		middleware.Recoverer,
	)

	SetupRoutes(r)

	host := os.Getenv("HOST")
	port := os.Getenv("PORT")
	if port == "" {
		port = "6640"
	}
	addr := fmt.Sprintf("%s:%s", host, port)

	http.ListenAndServe(addr, r)
}
