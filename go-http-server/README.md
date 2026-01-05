# Professional Go HTTP Server

A clean, modular, and extensively documented HTTP server implementation in Go. This project serves as a robust foundation for building web services, prioritizing code clarity, maintainability, and architectural best practices.

## ✨ Features

- **Modular Design**: Clear separation between server configuration, routing, and request handlers.
- **Production-Ready Configuration**: Includes optimized timeouts (Read, Write, Idle) and graceful startup logging.
- **Static Asset Support**: Built-in handling for serving HTML, CSS, and other static files.
- **Comprehensive Documentation**: Every component is documented with professional Go docstrings and internal implementation notes.
- **Network Visibility**: Automatically detects and displays the local network IP for easier testing on other devices.

## 🏗️ Project Structure

```text
.
├── handlers/
│   └── home.go         # Request handlers for web endpoints
├── server/
│   ├── routes.go       # Route registration and URL mapping
│   └── server.go       # Server lifecycle and configuration
├── static/
│   └── index.html      # Frontend entry point
├── go.mod              # Module dependencies
└── main.go             # Application entry point
```

## 🛠️ How It Works

### 1. Initialization
The application begins in `main.go`, where a new `server.Server` instance is created. This instance wraps the standard `http.Server` and encapsulates all configuration details.

### 2. Configuration & Routing
The `server/` package manages the setup:
- **Timeouts**: Specifically configured to prevent resource exhaustion.
- **Multiplexer**: Uses `http.NewServeMux()` for efficient request routing.
- **Routes**: Defined in `routes.go`, mapping paths like `/` to their respective handlers.

### 3. Request Handling
The `handlers/` package contains the business logic. For example, the `Home` handler in `home.go` uses `http.ServeFile` to serve the frontend interface.

### 4. Network Discovery
Upon startup, the server utilizes the `net` package to identify the host machine's IP address, allowing it to print both `localhost` and network-accessible URLs (e.g., `http://192.168.x.x:8080`).

## 📜 Development History

This project evolved through several refinement phases:
1.  **Prototype**: Initial setup of a basic Go server.
2.  **Feature Iteration**: Implementation of a Live Reload system using Server-Sent Events (SSE) and `fsnotify`.
3.  **Refactoring**: Removal of the live reload feature to prioritize server stability and eliminate port-binding conflicts during rapid development cycles.
4.  **Final Documentation**: A complete pass to add professional-grade documentation and internal comments, ensuring the codebase is accessible to developers of all levels.

## 🏃 Getting Started

1.  **Prerequisites**: Ensure you have [Go](https://go.dev/dl/) (1.22 or later) installed.
2.  **Environment Setup**:
    ```bash
    go mod tidy
    ```
3.  **Launch the Server**:
    ```bash
    go run main.go
    ```
4.  **Access the App**:
    Open `http://localhost:8080` in your browser.

---
*Created with focus on technical excellence and code readability.*
