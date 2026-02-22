const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🔍 Interacting with deployed contract...\n");

  // Get contract address from deployment
  const network = hre.network.name;
  const deploymentPath = `./deployments/${network}.json`;

  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ Deployment file not found. Please deploy the contract first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const contractAddress = deployment.contractAddress;

  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network:", network);

  // Connect to contract
  const AcademicCredential = await hre.ethers.getContractFactory("AcademicCredential");
  const contract = AcademicCredential.attach(contractAddress);

  // Get signers
  const [owner] = await hre.ethers.getSigners();
  console.log("👤 Connected as:", owner.address);

  // Get roles
  const ISSUER_ROLE = await contract.ISSUER_ROLE();
  const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();

  console.log("\n" + "=".repeat(60));
  console.log("📊 CONTRACT INFORMATION");
  console.log("=".repeat(60));

  // Check roles
  const hasIssuerRole = await contract.hasRole(ISSUER_ROLE, owner.address);
  const hasAdminRole = await contract.hasRole(DEFAULT_ADMIN_ROLE, owner.address);

  console.log("🔑 Your Roles:");
  console.log("  - Admin:", hasAdminRole ? "✓" : "✗");
  console.log("  - Issuer:", hasIssuerRole ? "✓" : "✗");

  // Get total credentials
  const totalCredentials = await contract.getTotalCredentials();
  console.log("\n📈 Total Credentials Issued:", totalCredentials.toString());

  // Get your credentials
  if (totalCredentials > 0n) {
    console.log("\n📜 Your Credentials:");
    const yourCredentials = await contract.getStudentCredentials(owner.address);
    
    if (yourCredentials.length > 0) {
      for (const tokenId of yourCredentials) {
        const credential = await contract.getCredentialDetails(tokenId);
        const isValid = await contract.isCredentialValid(tokenId);
        
        console.log(`\n  Token ID: ${tokenId}`);
        console.log(`  Status: ${isValid ? "✓ Valid" : "✗ Revoked"}`);
        console.log(`  Metadata URI: ${credential.metadataURI}`);
        console.log(`  Issue Date: ${new Date(Number(credential.issueTimestamp) * 1000).toLocaleDateString()}`);
      }
    } else {
      console.log("  No credentials found for your address");
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("💡 AVAILABLE ACTIONS");
  console.log("=".repeat(60));
  console.log("\n1. Issue Credential:");
  console.log("   npm run deploy:local && node scripts/issueCredential.js <student_address>");
  
  if (hasAdminRole) {
    console.log("\n2. Grant Issuer Role:");
    console.log("   npx hardhat console --network", network);
    console.log("   > const contract = await ethers.getContractAt('AcademicCredential', '" + contractAddress + "')");
    console.log("   > const ISSUER_ROLE = await contract.ISSUER_ROLE()");
    console.log("   > await contract.grantRole(ISSUER_ROLE, '0x...')");
  }

  console.log("\n3. Verify Credential:");
  console.log("   Use the frontend at http://localhost:3000/verify");

  console.log("\n✨ Done!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
