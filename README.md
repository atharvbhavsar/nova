<div align="center">
  <img src="frontend/public/icon-512.svg" alt="Nova Xi Logo" width="120" />
  <h1>Nova Xi</h1>
  <p><b>Blockchain-Powered Academic Credential Verification System</b></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=flat&logo=solidity&logoColor=white)](https://soliditylang.org/)
  [![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=flat&logo=ipfs&logoColor=white)](https://ipfs.tech/)
  [![Hardhat](https://img.shields.io/badge/Hardhat-FFC107?style=flat&logo=hardhat&logoColor=black)](https://hardhat.org/)
  [![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
</div>

---

## 🌟 Overview
**Nova Xi** is a next-generation "Trust Layer" for academic credentials. By leveraging **Soulbound Tokens (SBTs)** and **Decentralized Storage (IPFS)**, we eliminate educational fraud and make certificate verification instant, tamper-proof, and universally accessible.

### 🛑 The Problem
Traditional paper and digital certificates are easily forged, lost, or difficult to verify. Verification often requires weeks of communication between employers and universities.

### ✅ The Solution
- **Soulbound Tokens:** Non-transferable NFTs that represent a student's permanent achievements.
- **AI Verification:** Automated resume parsing to detect credentials and cross-reference them with the blockchain.
- **Immutable Proof:** Once issued, a credential cannot be altered, spoofed, or deleted by unauthorized parties.

---

## 📸 Project Visualization
<div align="center">
  <img src="https://i.ibb.co/RGPK98FQ/Untitled-2026-02-16-1748-excalidraw.png" alt="Nova Xi Project Visualization" width="800" />
</div>
## 📸 Workflow
<div align="center">
  <img src="https://i.ibb.co/JFjqxyfS/Untitled-2026-02-16-1748-excalidraw.png" alt="Architecture Diagram" width="800" />
</div>

## 🏗️ System Architecture
```mermaid
graph TD
    A[University/Issuer] -->|Batch Upload/Form| B(Hardhat Smart Contract)
    B -->|Metadata| C[IPFS / Pinata]
    B -->|Issue SBT| D[Student Wallet]
    E[Employer] -->|Upload Resume| F(Gemini AI Parsing)
    F -->|Extract Token ID| G{Blockchain Verify}
    G -->|Valid| H[Verified Status]
    G -->|Fake| I[Fraud Alert]
    G -->|Security Event| J(EmailJS Alert to Student)
```

---

## 🔥 Key Features
- **🎓 Multi-Mode Issuance:** Issue credentials via direct form input or batch-upload CSV/Excel files.
- **🕵️ AI Resume Guardian:** Upload a PDF resume; the system extracts ID data and verifies it against the blockchain automatically.
- **📊 Real-time Monitoring:** A live terminal simulation showing exactly how data flows from IPFS to the Smart Contract.
- **🛡️ Self-Revocation:** Students can "burn" their own tokens if they need to update or remove a credential.
- **📧 Security Alerts:** Instant email notifications to students whenever their credentials are verified by an employer.

---

## 🛠️ Technology Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Web3Modal
- **Blockchain:** Solidity, Hardhat, Ethers.js
- **Storage:** IPFS (Pinata)
- **AI/ML:** Google Gemini API (AI Resume Parsing)
- **Services:** EmailJS (Push Notifications)

---

## 🚀 Getting Started

### 1. Prerequisite Setup
- Create a `.env` file in the root based on `.env.example`.
- Ensure you have **Metamask** installed and configured for a local node.

### 2. Backend (Blockchain)
```bash
# Install dependencies
npm install

# Start the local Hardhat node
npm run node

# In a new terminal, deploy the smart contract
npm run deploy:local
```

### 3. Frontend (UI)
```bash
cd frontend
npm install

# Start the development server
npm run dev
```

---

## 👨‍💻 Author
**Atharv Bhavsar**
- [GitHub](https://github.com/atharvbhavsar)
- [LinkedIn](https://www.linkedin.com/in/atharv-bhavsar)

---
<div align="center">
  Built with ❤️ for a more trustworthy academic world.
</div>
