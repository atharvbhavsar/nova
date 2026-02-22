const hre = require("hardhat");
const { uploadToPinata, createCredentialMetadata } = require("./uploadToIPFS");
require("dotenv").config();

async function main() {
  console.log("🎓 Issuing Academic Credential\n");

  // Get contract address from deployment
  const fs = require("fs");
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

  // Get signers
  const [issuer] = await hre.ethers.getSigners();
  console.log("✍️  Issuer:", issuer.address);

  // Connect to contract
  const AcademicCredential = await hre.ethers.getContractFactory("AcademicCredential");
  const contract = AcademicCredential.attach(contractAddress);

  // Example: Issue credential to a student
  // Replace this address with the actual student's wallet address
  const studentAddress = process.argv[2] || issuer.address;
  
  console.log("👨‍🎓 Student:", studentAddress);
  console.log("\n" + "=".repeat(60));

  // Create credential metadata
  const metadata = createCredentialMetadata({
    studentName: "Alice Johnson",
    institution: "Massachusetts Institute of Technology",
    degree: "Bachelor of Science in Computer Science",
    grade: "A (3.9/4.0 GPA)",
    issueDate: new Date().toISOString().split("T")[0],
    description: "Bachelor's degree in Computer Science with honors. Specialization in Artificial Intelligence and Machine Learning.",
  });

  console.log("📋 Credential Metadata:");
  console.log(JSON.stringify(metadata, null, 2));
  console.log("=".repeat(60) + "\n");

  // Upload to IPFS
  console.log("📤 Uploading metadata to IPFS...");
  const metadataURI = await uploadToPinata(metadata);

  // Issue credential
  console.log("\n⏳ Issuing credential on blockchain...");
  const tx = await contract.issueCredential(studentAddress, metadataURI);
  console.log("📝 Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

  // Get token ID from event
  const event = receipt.logs.find(
    (log) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === "CredentialIssued";
      } catch {
        return false;
      }
    }
  );

  if (event) {
    const parsedEvent = contract.interface.parseLog(event);
    const tokenId = parsedEvent.args.tokenId;
    console.log("🎫 Token ID:", tokenId.toString());
    console.log("\n" + "=".repeat(60));
    console.log("🎉 Credential Successfully Issued!");
    console.log("=".repeat(60));
    console.log("Token ID:", tokenId.toString());
    console.log("Student:", studentAddress);
    console.log("Metadata URI:", metadataURI);
    console.log("=".repeat(60) + "\n");
  }

  // Verify the credential
  console.log("🔍 Verifying credential...");
  const credential = await contract.verifyCredential(0);
  console.log("✅ Credential verified:");
  console.log("  - Student:", credential.student);
  console.log("  - Metadata URI:", credential.metadataURI);
  console.log("  - Issue Timestamp:", new Date(Number(credential.issueTimestamp) * 1000).toISOString());
  console.log("  - Revoked:", credential.revoked);

  console.log("\n✨ Process complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
