# =============================================================
# Automated Installation Script for Windows (PowerShell)
# Tokenized Academic Credential Verification System
# =============================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installing All Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install backend dependencies
Write-Host "[2/4] Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Backend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Backend dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "[3/4] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Frontend installation failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "  ✓ Frontend dependencies installed successfully" -ForegroundColor Green
Set-Location ..
Write-Host ""

# Verify installation
Write-Host "[4/4] Verifying installation..." -ForegroundColor Yellow
try {
    npx hardhat --version | Out-Null
    Write-Host "  ✓ Hardhat verified" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Hardhat verification failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Copy .env.example to .env and configure" -ForegroundColor White
Write-Host "  2. Copy frontend/.env.example to frontend/.env and configure" -ForegroundColor White
Write-Host "  3. Run 'npm run compile' to compile contracts" -ForegroundColor White
Write-Host "  4. Run 'npm run test' to run tests" -ForegroundColor White
Write-Host "  5. Run 'npm run node' to start local blockchain" -ForegroundColor White
Write-Host ""
Write-Host "See README.md for detailed instructions." -ForegroundColor Cyan
