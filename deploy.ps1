# Weather App Deployment Script

Write-Host "Starting Production Build..." -ForegroundColor Cyan

# 1. Build Frontend
Write-Host "`n[1/3] Building Frontend..." -ForegroundColor Yellow
cd src/frontend
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed!"; exit }
cd ../..

# 2. Sync to Deploy Folder
Write-Host "`n[2/3] Syncing artifacts to deploy/dist..." -ForegroundColor Yellow
if (Test-Path deploy/dist) { Remove-Item -Recurse -Force deploy/dist }
New-Item -ItemType Directory -Path deploy/dist -Force | Out-Null
Copy-Item -Path src/frontend/dist/* -Destination deploy/dist -Recurse

# 3. Start Services
Write-Host "`n[3/3] Launching Docker containers..." -ForegroundColor Yellow
docker-compose up --build -d

Write-Host "`n[SUCCESS] Production environment is live at http://localhost" -ForegroundColor Green
Write-Host "View logs with: docker-compose logs -f" -ForegroundColor White
