# Nova Xi: Blockchain-Powered Academic Credential System 🎓🛡️

Hello! I built **Nova Xi** to solve a real-world problem: **Fake degrees and certificate fraud.** 

This project uses blockchain technology to issue "Soulbound Tokens" (SBTs)—digital certificates that are permanent, cannot be forged, and belong only to the student.

---

## 🚀 Why this project matters
Traditional certificates are easily edited or faked. **Nova Xi** changes this by creating a "Trust Layer" using:
- **Immutability:** Once a degree is issued on the blockchain, it stays there forever.
- **Soulbound Tokens:** These tokens cannot be sold or transferred. They are tied to the student's unique digital identity.
- **Instant Verification:** Employers can verify a student's entire history in 2 seconds without calling a university.

---

## 🔥 Key Features for the Demo
1. **Issuer Portal:** Institutions can issue single credentials or batch-upload an entire class using Excel.
2. **AI Resume Portal:** Employers can upload a candidate's resume (PDF). Our AI automatically extracts the Token ID and cross-checks it against the blockchain to catch fraudsters.
3. **Student Dashboard:** A clean place for students to view their achievements and "burn" (revoke) their own tokens if they want to.
4. **Live Analytics Simulation:** A "Mission Control" view that shows exactly how data moves from a Form -> IPFS Storage -> Blockchain.
5. **Auto-Alerts:** The system sends an automated email (via EmailJS) to the student whenever an employer verifies their data.

---

## 🛠️ The Technology Stack
I used a modern "Web3" stack to build this:
- **Smart Contracts:** Written in **Solidity** and deployed on an Ethereum L2 (Hardhat for demo).
- **Decentralized Storage:** **IPFS (Pinata)** stores the certificate data so it's not on a central server.
- **Frontend:** **React.js + Vite** for a fast, responsive, and professional UI.
- **AI Intelligence:** **Google Gemini API** for parsing resumes and detecting data manipulation.
- **Communication:** **EmailJS** for real-time security alerts.

---

## 💻 How to run it locally

### 1. Backend (Blockchain)
```bash
# Install dependencies
npm install

# Start the local blockchain node
npm run node

# In a new terminal, deploy the contract
npm run deploy:local
```

### 2. Frontend (The Website)
```bash
cd frontend
npm install

# Setup your keys in .env (see .env.example)
# Then start the dev server
npm run dev
```

---

## 👨‍💻 Developer's Note
I designed **Nova Xi** to be more than just a certificate generator; it's a complete ecosystem for trust in the digital age. I've focused on **aesthetics, security, and usability** to ensure that both universities and employers can adopt this easily.

---

**Built with ❤️ by Atharv Bhavsar**
