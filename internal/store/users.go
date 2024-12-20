package store

import (
	"context"
	"database/sql"
)

type UserStore struct {
	db *sql.DB
}

func (s *UserStore) CreateUser(email, password string) error {
	query := `INSERT INTO users (email, password) VALUES ($1, $2)", email, password)`

	ctx, cancel := context.WithTimeout(context.Background(), QueryTimeoutDuration)
	defer cancel()

	role := 
}
