package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/minhtq05/Secured-Email-Organizer/internal/auth"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type User struct {
	Id    string `json:"id"`
	Email string `json:"email"`
}

var googleOauthConfig = &oauth2.Config{
	RedirectURL:  "http://localhost:8080/auth/google/callback",
	ClientID:     os.Getenv("GOOGLE_API_CLIENT_ID"),
	ClientSecret: os.Getenv("GOOGLE_API_CLIENT_SECRET"),
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
	Endpoint:     google.Endpoint,
}

const (
	googleOauthUrlAPI         = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="
	googleOauthValidateUrlAPI = "https://oauth2.googleapis.com/tokeninfo?id_token="
)

func (s *Server) googleOauthLogin(w http.ResponseWriter, r *http.Request) {
	err := auth.ValidateUserJWT(r)
	if err == nil {
		err := auth.RefreshJWTToken(w, r)
		if err != nil {
			log.Println(err)
			cookie := auth.RevokeJWTToken()
			http.SetCookie(w, cookie)
		} else {
			s.temporaryRedirect(w, "http://localhost:5173/")
			return
		}
	}
	oauthState := generateStateOauthCookie(w)
	url := googleOauthConfig.AuthCodeURL(oauthState)
	s.temporaryRedirect(w, url)
}

func (s *Server) googleOauthLogout(w http.ResponseWriter, r *http.Request) {
	cookie := auth.RevokeJWTToken()
	http.SetCookie(w, cookie)
	http.Redirect(w, r, "http://localhost:5173/", http.StatusTemporaryRedirect)
}

func (s *Server) googleOauthCallback(w http.ResponseWriter, r *http.Request) {
	// Read oauthState from Cookie
	oauthState, _ := r.Cookie("oauthstate")

	if r.FormValue("state") != oauthState.Value {
		log.Println("invalid oauth google state")
		http.Redirect(w, r, "http://localhost:5173/", http.StatusTemporaryRedirect)
		return
	}

	// use either validateOauthToken or getUserDataFromGoogle
	data, err := getUserDataFromGoogle(r.FormValue("code"))
	if err != nil {
		log.Println(err.Error())
		http.Redirect(w, r, "http://localhost:5173/", http.StatusTemporaryRedirect)
		return
	}

	// tokenValid := validateOauthToken(r.FormValue("id_token"))
	// if !tokenValid {
	// 	log.Println("invalid token")
	// 	http.Redirect(w, r, "http://localhost:5173/", http.StatusTemporaryRedirect)
	// 	return
	// }
	var user User
	err = json.Unmarshal(data, &user)
	if err != nil {
		log.Println("Error unmarshalling user data:", err)
		http.Redirect(w, r, "http://localhost:5173/", http.StatusTemporaryRedirect)
		return
	}

	// TODO: Must sign JWT token here
	cookie, err := auth.SignNewJWTToken(user.Email)
	if err != nil {
		log.Println("Error signing JWT token:", err)
		return
	}
	http.SetCookie(w, cookie)

	// GetOrCreate User in your db.
	// Redirect or response with a token.
	// More code .....
	fmt.Fprintf(w, "UserInfo: %s\n", data)
}

func generateStateOauthCookie(w http.ResponseWriter) string {
	var expiration = time.Now().Add(30 * 24 * time.Hour)

	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	cookie := http.Cookie{Name: "oauthstate", Value: state, Expires: expiration}
	http.SetCookie(w, &cookie)

	return state
}

func getUserDataFromGoogle(code string) ([]byte, error) {
	// Use code to get token and get user info from Google.

	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, fmt.Errorf("code exchange wrong: %s", err.Error())
	}
	response, err := http.Get(googleOauthUrlAPI + token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed getting user info: %s", err.Error())
	}
	defer response.Body.Close()
	contents, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("failed read response: %s", err.Error())
	}
	return contents, nil
}

func validateOauthToken(token string) bool {
	resp, err := http.Get(googleOauthValidateUrlAPI + token)
	if resp.StatusCode != 200 || err != nil {
		return false
	}

	return true
}
