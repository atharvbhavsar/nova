#!/bin/bash
# =============================================================
# Automated Installation Script for Unix/Linux/macOS
# Tokenized Academic Credential Verification System
# =============================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Installing All Dependencies${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}[1/4] Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}  ✓ Node.js version: $NODE_VERSION${NC}"
else
    echo -e "${RED}  ✗ Node.js is not installed!${NC}"
    echo -e "${RED}  Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}  ✓ npm version: $NPM_VERSION${NC}"
else
    echo -e "${RED}  ✗ npm is not installed!${NC}"
    exit 1
fi

echo ""

# Install backend dependencies
echo -e "${YELLOW}[2/4] Installing backend dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}  ✗ Backend installation failed!${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Backend dependencies installed successfully${NC}"
echo ""

# Install frontend dependencies
echo -e "${YELLOW}[3/4] Installing frontend dependencies...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}  ✗ Frontend installation failed!${NC}"
    cd ..
    exit 1
fi
echo -e "${GREEN}  ✓ Frontend dependencies installed successfully${NC}"
cd ..
echo ""

# Verify installation
echo -e "${YELLOW}[4/4] Verifying installation...${NC}"
if npx hardhat --version &> /dev/null; then
    echo -e "${GREEN}  ✓ Hardhat verified${NC}"
else
    echo -e "${RED}  ✗ Hardhat verification failed${NC}"
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  ✓ Installation Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${NC}  1. Copy .env.example to .env and configure${NC}"
echo -e "${NC}  2. Copy frontend/.env.example to frontend/.env and configure${NC}"
echo -e "${NC}  3. Run 'npm run compile' to compile contracts${NC}"
echo -e "${NC}  4. Run 'npm run test' to run tests${NC}"
echo -e "${NC}  5. Run 'npm run node' to start local blockchain${NC}"
echo ""
echo -e "${CYAN}See README.md for detailed instructions.${NC}"
