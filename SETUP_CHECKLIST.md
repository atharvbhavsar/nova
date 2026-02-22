# ✅ Setup Checklist

Use this checklist to track your setup progress. Check off items as you complete them.

## Pre-Installation

- [ ] **Node.js** (v18.0.0+) installed and verified
  ```bash
  node --version
  ```

- [ ] **npm** (v9.0.0+) installed and verified
  ```bash
  npm --version
  ```

- [ ] **Git** installed and verified
  ```bash
  git --version
  ```

- [ ] **MetaMask** browser extension installed

- [ ] **Code editor** (VS Code recommended) installed

## Accounts & API Keys

- [ ] **Alchemy account** created
  - [ ] New app created
  - [ ] Sepolia network selected
  - [ ] API key copied
  - [ ] RPC URL copied

- [ ] **Pinata account** created
  - [ ] API key generated
  - [ ] API secret copied
  - [ ] Noted or saved securely

- [ ] **MetaMask wallet** setup
  - [ ] Private key exported (for deployment)
  - [ ] Saved securely (NEVER share or commit!)

- [ ] **Sepolia test ETH** obtained
  - [ ] Used faucet to get test ETH
  - [ ] Confirmed receipt in wallet (~0.1 ETH)

## Repository Setup

- [ ] **Repository cloned**
  ```bash
  git clone https://github.com/yourusername/tokenized-academic-credentials.git
  cd tokenized-academic-credentials
  ```

- [ ] **Backend dependencies** installed
  ```bash
  npm install
  ```

- [ ] **Frontend dependencies** installed
  ```bash
  cd frontend
  npm install
  cd ..
  ```

## Configuration

- [ ] **Root .env file** created and configured
  ```bash
  cp .env.example .env
  ```
  - [ ] `SEPOLIA_RPC_URL` set
  - [ ] `PRIVATE_KEY` set
  - [ ] `IPFS_API_KEY` set
  - [ ] `IPFS_SECRET_KEY` set

- [ ] **Frontend .env file** created and configured
  ```bash
  cd frontend
  cp .env.example .env
  cd ..
  ```
  - [ ] `VITE_CONTRACT_ADDRESS` (will be set after deployment)
  - [ ] `VITE_NETWORK_ID` set
  - [ ] `VITE_NETWORK_NAME` set
  - [ ] `VITE_IPFS_GATEWAY` set

## Testing & Verification

- [ ] **Smart contracts compile** successfully
  ```bash
  npm run compile
  ```

- [ ] **Tests pass** successfully
  ```bash
  npm run test
  ```

- [ ] **Local blockchain** starts without errors
  ```bash
  npm run node
  ```

## Deployment

### For Local Development

- [ ] **Local Hardhat node** running (in separate terminal)
  ```bash
  npm run node
  ```

- [ ] **Contract deployed** to local network
  ```bash
  npm run deploy:local
  ```

- [ ] **Contract address** copied to `frontend/.env`
  - [ ] `VITE_CONTRACT_ADDRESS` updated

- [ ] **Frontend server** running
  ```bash
  cd frontend
  npm run dev
  ```

- [ ] **Browser opened** to http://localhost:3000

- [ ] **MetaMask connected** to local network
  - Network: Localhost 8545
  - RPC: http://127.0.0.1:8545
  - Chain ID: 31337

### For Sepolia Testnet (Optional)

- [ ] **Contract deployed** to Sepolia
  ```bash
  npm run deploy:sepolia
  ```

- [ ] **Contract address** copied to `frontend/.env`
  - [ ] `VITE_CONTRACT_ADDRESS` updated with Sepolia address
  - [ ] `VITE_NETWORK_ID` set to 11155111
  - [ ] `VITE_NETWORK_NAME` set to sepolia

- [ ] **MetaMask switched** to Sepolia network

- [ ] **Contract verified** on Etherscan (optional)
  ```bash
  npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <ADMIN_ADDRESS>
  ```

## Application Testing

- [ ] **Wallet connection** works
  - [ ] Connect button works
  - [ ] Wallet address displays correctly

- [ ] **Navigation** works
  - [ ] All pages load
  - [ ] No console errors

- [ ] **Issue credential** functionality (if you have issuer role)
  - [ ] Form submits
  - [ ] Transaction confirms
  - [ ] Credential appears

- [ ] **Dashboard** displays credentials
  - [ ] Student credentials load
  - [ ] Cards display correctly

- [ ] **Verification** works
  - [ ] Can enter token ID
  - [ ] Credential details load
  - [ ] IPFS metadata displays

## Troubleshooting Complete?

If you encountered issues, check:

- [ ] Reviewed [INSTALL.md](INSTALL.md) troubleshooting section
- [ ] Checked [README.md](README.md) for detailed instructions
- [ ] All environment variables are correct
- [ ] All API keys are valid
- [ ] Network settings match in contract and frontend
- [ ] MetaMask is on correct network
- [ ] Console has no critical errors

## 🎉 Setup Complete!

If all items are checked, you're ready to use the application!

**Next Steps:**
- Read the [Usage Guide](README.md#usage-guide) in README.md
- Try issuing your first credential
- Explore the verification system
- Check out the [Smart Contract Details](README.md#smart-contract-details)

---

**Need Help?**
- 📖 See [INSTALL.md](INSTALL.md) for installation guide
- 📖 See [requirements.txt](requirements.txt) for dependencies list
- 📖 See [README.md](README.md) for full documentation
-  Open an issue on GitHub if you encounter problems
