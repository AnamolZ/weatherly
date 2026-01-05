package handlers

import (
	"net/http"
	"os"
	"path/filepath"
)

// ServeFrontend serves static files from a directory defined by the SERVE_DIR
// environment variable. It defaults to "./static" if not specified.
// It also handles SPA routing by serving index.html for any non-existent paths.
func ServeFrontend(w http.ResponseWriter, r *http.Request) {
	// Get the directory to serve from environment variable or default to "static"
	staticDir := os.Getenv("SERVE_DIR")
	if staticDir == "" {
		staticDir = "static"
	}

	// Clean the path to prevent directory traversal
	requestPath := filepath.Clean(r.URL.Path)
	fullPath := filepath.Join(staticDir, requestPath)

	// Check if the file exists
	info, err := os.Stat(fullPath)
	if os.IsNotExist(err) || info.IsDir() {
		// If it's a directory or doesn't exist, serve the root index.html (SPA routing)
		http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
		return
	}

	// Serve the actual file
	http.ServeFile(w, r, fullPath)
}
