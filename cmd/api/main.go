package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	router := chi.NewRouter()

	router.Use(middleware.Logger)

	server := NewServer()

	router.Get("/", server.homeHandler)
	router.Get("/hello", server.helloHandler)

	http.ListenAndServe(":8080", router)
}
