package main

import (
	"log"
	"net/http"
)

// 307: Temporary Redirect
func (s *Server) temporaryRedirect(w http.ResponseWriter, url string) {
	writeJSON(w, http.StatusTemporaryRedirect, url)
}

// 400: Bad Request
func (s *Server) badRequest(w http.ResponseWriter, err error) {
	log.Println(err)
	writeJSONError(w, http.StatusBadRequest, err.Error())
}

// 404: Not Found
func (s *Server) notFound(w http.ResponseWriter, err error) {
	log.Println(err)
	writeJSONError(w, http.StatusNotFound, "not found")
}

// 401: Unauthorized
func (s *Server) unauthorized(w http.ResponseWriter, err error) {
	log.Println(err)
	writeJSONError(w, http.StatusUnauthorized, "unauthorized")
}

// 500: Internal Server Error
func (s *Server) internalServerError(w http.ResponseWriter, err error) {
	log.Println(err)
	writeJSONError(w, http.StatusInternalServerError, "internal server error")
}
