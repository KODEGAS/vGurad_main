# vGuard Production Build Script
Write-Host "Building vGuard for Production..." -ForegroundColor Green

# Build Backend
Write-Host "Building Backend..." -ForegroundColor Yellow
Set-Location "backend"
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    exit 1
}

# Build Frontend
Write-Host "Building Frontend..." -ForegroundColor Yellow
Set-Location "../frontend"
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}

# Clean up dev dependencies
Write-Host "Cleaning up development dependencies..." -ForegroundColor Yellow
Set-Location "../backend"
npm prune --production

Set-Location "../frontend"
npm prune --production

Set-Location ".."

Write-Host "Production build completed successfully!" -ForegroundColor Green
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
