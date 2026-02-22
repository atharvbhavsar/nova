const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying AcademicCredential contract...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const AcademicCredential = await hre.ethers.getContractFactory("AcademicCredential");
  const academicCredential = await AcademicCredential.deploy(deployer.address);

  await academicCredential.waitForDeployment();

  const contractAddress = await academicCredential.getAddress();
  
  console.log("✅ AcademicCredential deployed to:", contractAddress);
  console.log("🔑 Admin address:", deployer.address);
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("=".repeat(60) + "\n");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to:", `${deploymentsDir}/${hre.network.name}.json\n`);

  // If on testnet, show verification command
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("📝 To verify contract on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} ${deployer.address}\n`);
  }

  // Grant issuer role example
  console.log("💡 To grant ISSUER_ROLE to another address, use:");
  console.log(`const ISSUER_ROLE = await contract.ISSUER_ROLE();`);
  console.log(`await contract.grantRole(ISSUER_ROLE, "0x...address");`);
  console.log("\n✨ Deployment complete!\n");

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
