package store

import (
	"context"
	"database/sql"
	"time"
)

type Storage struct {
	db *sql.DB
}

const QueryTimeoutDuration = 5 * time.Second

func NewStorage(db *sql.DB) *Storage {
	return &Storage{db: db}
}

func withTx(db *sql.DB, ctx context.Context, fn func(*sql.Tx) error) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	if err := fn(tx); err != nil {
		_ = tx.Rollback()
		return err
	}

	return tx.Commit()
}
