package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	googleOauthConfig.ClientID = os.Getenv("GOOGLE_API_CLIENT_ID")
	googleOauthConfig.ClientSecret = os.Getenv("GOOGLE_API_CLIENT_SECRET")

	router := chi.NewRouter()

	router.Use(middleware.Logger)

	server := NewServer()

	router.Get("/", server.homeHandler)
	router.Get("/hello", server.helloHandler)
	router.Get("/auth/google", server.googleOauthLogin)
	router.Get("/auth/google/callback", server.googleOauthCallback)

	http.ListenAndServe(":8080", router)
}
