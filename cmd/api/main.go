package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	router := chi.NewRouter()

	router.Use(middleware.Logger)

	server := NewServer()

	router.Get("/", server.homeHandler)
	router.With(AuthJWTTokenMiddleware).Get("/hello", server.helloHandler)
	router.Get("/auth/google", server.googleOauthLogin)
	router.Get("/auth/google/callback", server.googleOauthCallback)
	router.Get("/auth/google/logout", server.googleOauthLogout)

	log.Fatal(http.ListenAndServe(":8080", router))
}
