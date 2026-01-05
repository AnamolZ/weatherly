// Package server centralizes the routing configuration for the application.
// It defines how incoming HTTP requests are mapped to specific handler functions.
package server

import (
	"net/http"

	"go-http-server/handlers"
)

// registerRoutes configures the request multiplexer with the application's URL patterns.
// It sets up handlers for the landing page, the live reload signaling system,
// and serves physical files from the static directory.
func registerRoutes(mux *http.ServeMux) {
	// Root handler filters all requests through the ServeFrontend logic.
	// This handles both physical files and SPA routing automatically.
	mux.HandleFunc("/", handlers.ServeFrontend)
}
