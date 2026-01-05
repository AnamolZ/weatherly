### Weatherly Deployment

This directory contains artifacts and configurations for deploying the Weatherly application.

### Structure
- **docker/**: Contains `Dockerfile` and `docker-compose.yml` for containerizing the backend.
- **dist/**: Production-ready frontend assets.
- **static/**: Static assets used by the backend.
- **deploy.ps1**: (Root level) PowerShell script to orchestrate the build and deployment process.

### Usage
Refer to the root `deploy.ps1` or `docker-compose.yml` for deployment instructions.
