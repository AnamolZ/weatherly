// Package main serves as the primary entry point for the Go HTTP Server application.
// This application provides a lightweight development server with built-in live reload
// capabilities, automatically refreshing the browser whenever project files are modified.
package main

import "go-http-server/server"

// main initializes the server environment and orchestrates the startup sequence.
// It creates a new server instance, launches the HTTP listener in the background,
// and blocks the main thread with a filesystem watcher that manages the live reload lifecycle.
func main() {
	// Initialize a new server instance with default configurations (port :8080).
	srv := server.New()

	// Start the HTTP server.
	srv.Start()
}
