# 📦 Installation Guide

## Quick Install (Like `pip install -r requirements.txt`)

This project provides three simple ways to install all dependencies at once, similar to Python's `pip install -r requirements.txt` command.

---

## 🚀 Method 1: Installation Script (Recommended)

### Windows (PowerShell)
```powershell
# Clone and navigate to project
git clone https://github.com/yourusername/tokenized-academic-credentials.git
cd tokenized-academic-credentials

# Run installation script
.\install.ps1
```

### Linux/Mac
```bash
# Clone and navigate to project
git clone https://github.com/yourusername/tokenized-academic-credentials.git
cd tokenized-academic-credentials

# Make script executable and run
chmod +x install.sh
./install.sh
```

**What it does:**
- ✓ Checks Node.js and npm are installed
- ✓ Installs all backend dependencies
- ✓ Installs all frontend dependencies
- ✓ Verifies installation
- ✓ Shows next steps

---

## 🚀 Method 2: npm Command

```bash
# Clone and navigate to project
git clone https://github.com/yourusername/tokenized-academic-credentials.git
cd tokenized-academic-credentials

# Install all dependencies (one command)
npm run install-all
```

This is equivalent to:
```bash
npm install && cd frontend && npm install && cd ..
```

---

## 🚀 Method 3: Manual Installation

If you prefer manual control:

```bash
# 1. Clone repository
git clone https://github.com/yourusername/tokenized-academic-credentials.git
cd tokenized-academic-credentials

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## 📋 What Gets Installed

### Backend Dependencies
The `package.json` in the root directory contains:

**Production:**
- `@openzeppelin/contracts` (v5.0.1) - Smart contract library
- `dotenv` (v16.4.1) - Environment variables
- `axios` (v1.6.5) - HTTP client
- `form-data` (v4.0.0) - Form data handling

**Development:**
- `hardhat` (v2.19.5) - Ethereum development environment
- `@nomicfoundation/hardhat-toolbox` (v4.0.0) - Hardhat plugins

### Frontend Dependencies
The `package.json` in the frontend directory contains:

**Production:**
- `react` (v18.2.0) - UI framework
- `react-dom` (v18.2.0) - React DOM
- `react-router-dom` (v6.22.0) - Routing
- `ethers` (v6.10.0) - Ethereum library
- `axios` (v1.6.5) - HTTP client

**Development:**
- `vite` (v5.1.0) - Build tool
- `tailwindcss` (v3.4.1) - CSS framework
- `postcss` (v8.4.35) - CSS processor
- `autoprefixer` (v10.4.17) - CSS autoprefixer
- `@vitejs/plugin-react` (v4.2.1) - Vite React plugin

---

## ✅ Verify Installation

After installation, verify everything is working:

```bash
# Check Node.js and npm versions
node --version    # Should be v18.0.0+
npm --version     # Should be v9.0.0+

# Verify Hardhat installation
npx hardhat --version

# Compile contracts
npm run compile

# Run tests
npm run test

# Build frontend
cd frontend
npm run build
cd ..
```

If all commands run without errors, you're ready to go!

---

## 🔧 Next Steps After Installation

1. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   cd frontend
   cp .env.example .env
   cd ..
   ```

2. **Edit `.env` files** with your API keys:
   - Root `.env`: Add Alchemy, Pinata, and wallet credentials
   - `frontend/.env`: Add contract address and network details

3. **Compile Smart Contracts:**
   ```bash
   npm run compile
   ```

4. **Run Tests:**
   ```bash
   npm run test
   ```

5. **Start Local Blockchain:**
   ```bash
   npm run node
   ```

6. **Deploy Contract** (in new terminal):
   ```bash
   npm run deploy:local
   ```

7. **Start Frontend:**
   ```bash
   npm run frontend
   ```

---

## 🆚 Comparison with Python's requirements.txt

| Python | This Project (Node.js) |
|--------|------------------------|
| `requirements.txt` | `package.json` (backend) + `frontend/package.json` |
| `pip install -r requirements.txt` | `npm run install-all` or `.\install.ps1` |
| Lists packages with versions | Lists packages in `dependencies` and `devDependencies` |
| Single file | Two files (backend + frontend) |

**Key Difference:**
- Python's `pip` reads `requirements.txt`
- Node.js's `npm` reads `package.json` automatically
- Our scripts install from **both** package.json files

---

## 📦 Package.json Files (The "requirements.txt" Equivalent)

### Root package.json
Located at: `./package.json`
```json
{
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.1",
    "dotenv": "^16.4.1",
    "axios": "^1.6.5",
    "form-data": "^4.0.0"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "hardhat": "^2.19.5"
  }
}
```

### Frontend package.json
Located at: `./frontend/package.json`
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "ethers": "^6.10.0",
    "axios": "^1.6.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.0"
  }
}
```

---

## 🐛 Troubleshooting Installation

### "command not found: node"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### "permission denied" (Linux/Mac)
**Solution:** Fix npm permissions:
```bash
sudo chown -R $USER ~/.npm
```
Never use `sudo npm install`!

### "EACCES: permission denied" (Windows)
**Solution:** Run PowerShell as Administrator

### "npm ERR! code ENOENT"
**Solution:** Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Installation Script Won't Run (Windows)
**Solution:** Enable script execution:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Installation Script Won't Run (Linux/Mac)
**Solution:** Make it executable:
```bash
chmod +x install.sh
```

---

## 📚 Additional Resources

- **Full Documentation:** See [README.md](README.md)
- **Dependencies List:** See [requirements.txt](requirements.txt)
- **Setup Checklist:** See [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)

---

## 💡 Pro Tips

1. **Always use Node.js v18+** - Check with `node --version`
2. **Don't use `sudo` with npm** - Fix permissions instead
3. **Delete node_modules if stuck** - Then reinstall
4. **Keep package-lock.json** - It ensures consistent installations
5. **Use the installation script** - It handles everything automatically

---

**Ready to start?** Run the installation script and you'll be up and running in minutes! 🚀
