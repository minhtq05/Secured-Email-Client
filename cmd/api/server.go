package main

import "net/http"

type Server struct {
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) homeHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("homepage"))
}

func (s *Server) helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello!"))
}
