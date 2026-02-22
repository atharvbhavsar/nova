const hre = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS || "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

    console.log("🔍 Connecting to AcademicCredential at:", contractAddress);
    const AcademicCredential = await hre.ethers.getContractFactory("AcademicCredential");
    const contract = AcademicCredential.attach(contractAddress);

    const totalCredentials = await contract.getTotalCredentials();
    console.log(`\n📊 Total Credentials Issued: ${totalCredentials.toString()}\n`);

    if (totalCredentials == 0) {
        console.log("No credentials have been minted yet. Please run the Batch Upload in the frontend first!");
        return;
    }

    console.log("===============================================================");
    console.log("          BLOCKCHAIN STORAGE DUMP (First 5 Tokens)             ");
    console.log("===============================================================\n");

    const limit = totalCredentials < 5 ? totalCredentials : 5;

    for (let i = 0; i < limit; i++) {
        try {
            const cred = await contract.getCredentialDetails(i);

            console.log(`🥇 TOKEN ID  : ${cred.tokenId.toString()}`);
            console.log(`👨‍🎓 STUDENT   : ${cred.student}`);
            console.log(`🔗 CID (URI) : ${cred.metadataURI}`);
            console.log(`📅 ISSUED AT : ${new Date(Number(cred.issueTimestamp) * 1000).toLocaleString()}`);
            console.log(`❌ REVOKED   : ${cred.revoked}`);
            console.log("---------------------------------------------------------------");
        } catch (e) {
            console.log(`Token ${i} does not exist or error occurred.`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
