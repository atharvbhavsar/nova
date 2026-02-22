const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
require("dotenv").config();

/**
 * Upload JSON metadata to Pinata IPFS
 * @param {Object} metadata - The metadata object to upload
 * @returns {Promise<string>} IPFS URI (ipfs://...)
 */
async function uploadToPinata(metadata) {
  const PINATA_API_KEY = process.env.IPFS_API_KEY;
  const PINATA_SECRET_KEY = process.env.IPFS_SECRET_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error("Pinata API keys not found in .env file");
  }

  try {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    const response = await axios.post(url, metadata, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
        "Content-Type": "application/json",
      },
    });

    const ipfsHash = response.data.IpfsHash;
    const ipfsUri = `ipfs://${ipfsHash}`;

    console.log("✅ Uploaded to IPFS:", ipfsUri);
    console.log("🔗 Gateway URL:", `https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

    return ipfsUri;
  } catch (error) {
    console.error("❌ Error uploading to Pinata:", error.message);
    throw error;
  }
}

/**
 * Upload file to Pinata IPFS
 * @param {string} filePath - Path to the file to upload
 * @returns {Promise<string>} IPFS URI (ipfs://...)
 */
async function uploadFileToPinata(filePath) {
  const PINATA_API_KEY = process.env.IPFS_API_KEY;
  const PINATA_SECRET_KEY = process.env.IPFS_SECRET_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error("Pinata API keys not found in .env file");
  }

  try {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const response = await axios.post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    const ipfsHash = response.data.IpfsHash;
    const ipfsUri = `ipfs://${ipfsHash}`;

    console.log("✅ File uploaded to IPFS:", ipfsUri);
    console.log("🔗 Gateway URL:", `https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

    return ipfsUri;
  } catch (error) {
    console.error("❌ Error uploading file to Pinata:", error.message);
    throw error;
  }
}

/**
 * Create example credential metadata
 * @param {Object} params - Credential parameters
 * @returns {Object} Metadata object
 */
function createCredentialMetadata({
  studentName,
  institution,
  degree,
  grade,
  issueDate,
  description,
  imageUri = "",
}) {
  return {
    name: `${degree} - ${studentName}`,
    description: description || `Academic credential issued by ${institution}`,
    institution,
    studentName,
    degree,
    grade,
    issueDate,
    image: imageUri,
    attributes: [
      {
        trait_type: "Institution",
        value: institution,
      },
      {
        trait_type: "Degree",
        value: degree,
      },
      {
        trait_type: "Grade",
        value: grade,
      },
      {
        trait_type: "Issue Date",
        value: issueDate,
      },
    ],
  };
}

// Example usage
async function main() {
  console.log("📤 IPFS Upload Helper\n");

  // Example credential metadata
  const metadata = createCredentialMetadata({
    studentName: "John Doe",
    institution: "MIT",
    degree: "Bachelor of Science in Computer Science",
    grade: "A",
    issueDate: "2024-05-15",
    description: "Bachelor's degree in Computer Science with honors",
  });

  console.log("📋 Metadata:", JSON.stringify(metadata, null, 2));
  console.log("\nUploading to IPFS...\n");

  const ipfsUri = await uploadToPinata(metadata);
  console.log("\n✨ Upload complete!");
  console.log("Use this URI when calling issueCredential():", ipfsUri);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  uploadToPinata,
  uploadFileToPinata,
  createCredentialMetadata,
};
