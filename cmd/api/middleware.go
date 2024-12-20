package main

import (
	"net/http"

	"github.com/minhtq05/Secured-Email-Organizer/internal/auth"
)

func AuthJWTTokenMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := auth.ValidateUserJWT(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
