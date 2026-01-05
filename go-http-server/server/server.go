package server

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// Server provides a high-level wrapper around the standard http.Server.
type Server struct {
	httpServer *http.Server
}

// New initializes and returns a new Server instance.
func New() *Server {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	registerRoutes(mux)

	// Wrap the multiplexer with professional middleware
	handler := wrapMiddleware(mux)

	return &Server{
		httpServer: &http.Server{
			Addr:         ":" + port,
			Handler:      handler,
			ReadTimeout:  15 * time.Second,
			WriteTimeout: 15 * time.Second,
			IdleTimeout:  60 * time.Second,
		},
	}
}

// Start begins listening and serving requests with graceful shutdown support.
func (s *Server) Start() {
	// Channel to listen for OS signals
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	printStartupMessage(s.httpServer.Addr)

	// Run server in a goroutine so it doesn't block the main thread
	go func() {
		if err := s.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			printError(fmt.Sprintf("Critical server failure: %v", err))
			os.Exit(1)
		}
	}()

	// Wait for termination signal
	<-stop

	fmt.Println("\n\033[33m[SHUTDOWN]\033[0m Initiating graceful shutdown...")

	// Create a context with timeout for the shutdown process
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := s.httpServer.Shutdown(ctx); err != nil {
		printError(fmt.Sprintf("Graceful shutdown failed: %v", err))
	} else {
		fmt.Println("\033[32m[SUCCESS]\033[0m Server stopped cleanly.")
	}
}

// wrapMiddleware applies professional logging and security headers.
func wrapMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Professional Security Headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		// Response writer wrapper to capture status code
		rw := &responseWriter{ResponseWriter: w, status: http.StatusOK}

		next.ServeHTTP(rw, r)

		duration := time.Since(start)

		// Professional Log Format
		// [TIME] [METHOD] [PATH] [STATUS] [DURATION]
		statusColor := "\033[32m" // Green
		if rw.status >= 400 {
			statusColor = "\033[31m" // Red
		} else if rw.status >= 300 {
			statusColor = "\033[33m" // Yellow
		}

		fmt.Printf("[%s] %s %-7s %s %s%d\033[0m %v\n",
			time.Now().Format("15:04:05"),
			r.RemoteAddr,
			r.Method,
			r.URL.Path,
			statusColor,
			rw.status,
			duration.Round(time.Millisecond),
		)
	})
}

// responseWriter is a wrapper to capture the HTTP status code.
type responseWriter struct {
	http.ResponseWriter
	status int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}

func printStartupMessage(addr string) {
	fmt.Printf("\033[32m[SERVER]\033[0m Active on %s (Local: http://localhost%s)\n", getLocalIP(), addr)
}

func printError(msg string) {
	fmt.Printf("\033[31m[ERROR]\033[0m %s\n", msg)
}

func getLocalIP() string {
	addrs, _ := net.InterfaceAddrs()
	for _, addr := range addrs {
		if ipNet, ok := addr.(*net.IPNet); ok {
			ip := ipNet.IP
			if !ip.IsLoopback() && ip.To4() != nil {
				return ip.String()
			}
		}
	}
	return "127.0.0.1"
}
