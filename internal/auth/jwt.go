package auth

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("my_secret_key")

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func SignNewJWTToken(email string) (*http.Cookie, error) {
	expirationTime := time.Now().Add(20 * time.Minute)
	claims := &Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return nil, err
	}

	cookie := &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	}

	return cookie, nil
}

func RevokeJWTToken() *http.Cookie {
	return &http.Cookie{
		Name:    "token",
		Expires: time.Now(),
	}
}

func ValidateUserJWT(r *http.Request) error {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return errors.New("authorization header is missing")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return errors.New("authorization header is malformed")
	}

	tknStr := parts[1]

	// c, err := r.Cookie("token")
	// if err != nil {
	// 	if err == http.ErrNoCookie {
	// 		return errors.New("signature invalid 1")
	// 	}
	// 	return errors.New("signature invalid 2")
	// }

	// tknStr := c.Value

	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
		return jwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return errors.New("signature invalid 3")
		}
		return errors.New("signature invalid 4")
	}
	if !tkn.Valid {
		return errors.New("signature invalid 5")
	}
	return nil
}

func RefreshJWTToken(w http.ResponseWriter, r *http.Request) error {
	// (BEGIN) The code uptil this point is the same as the first part of the `Welcome` route
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			return errors.New("unauthorized 1")
		}
		return errors.New("bad request 2")
	}
	tknStr := c.Value
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
		return jwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return errors.New("unauthorized 3")
		}
		return errors.New("bad request 4")
	}
	if !tkn.Valid {
		return errors.New("unauthorized 5")
	}
	// (END) The code uptil this point is the same as the first part of the `Welcome` route

	// We ensure that a new token is not issued until enough time has elapsed
	// In this case, a new token will only be issued if the old token is within
	// 30 seconds of expiry. Otherwise, return a bad request status
	if time.Until(claims.ExpiresAt.Time) > 1*time.Minute {
		return nil
	}

	// Now, create a new token for the current use, with a renewed expiration time
	expirationTime := time.Now().Add(20 * time.Minute)
	claims.ExpiresAt = jwt.NewNumericDate(expirationTime)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return errors.New("internal server error 7")
	}

	// Set the new token as the users `token` cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})

	return nil
}
