import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useSearchParams } from 'react-router-dom';
import CredentialCard from '../components/CredentialCard';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { QRCodeSVG } from 'qrcode.react';
import { fetchMetadata, copyToClipboard, ipfsToHttp } from '../utils/helpers';

const VerifyCredential = () => {
  const { contract } = useWeb3();
  const [searchParams] = useSearchParams();
  const [bc] = useState(() => new BroadcastChannel('blockchain_simulation'));

  useEffect(() => {
    return () => bc.close();
  }, [bc]);

  const [tokenId, setTokenId] = useState('');
  const [credential, setCredential] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Auto-fill and auto-verify tokenId from URL parameter
  useEffect(() => {
    const urlTokenId = searchParams.get('tokenId');
    if (urlTokenId && contract && !loading && !credential) {
      setTokenId(urlTokenId);
      // Trigger verification automatically
      const autoVerify = async () => {
        try {
          setLoading(true);
          setError(null);

          const credentialData = await contract.verifyCredential(urlTokenId);

          let metadataData = null;
          try {
            metadataData = await fetchMetadata(credentialData.metadataURI);
          } catch (metaError) {
            console.error('Error fetching metadata:', metaError);
          }

          setCredential({
            tokenId: credentialData.tokenId,
            student: credentialData.student,
            metadataURI: credentialData.metadataURI,
            issueTimestamp: credentialData.issueTimestamp,
            revoked: credentialData.revoked,
          });
          setMetadata(metadataData);
        } catch (err) {
          console.error('Verification error:', err);
          setError(err.reason || err.message || 'Failed to verify credential');
        } finally {
          setLoading(false);
        }
      };

      autoVerify();
    }
  }, [searchParams, contract]);

  const handleVerify = async (e, autoTokenId = null) => {
    if (e) e.preventDefault();

    const idToVerify = autoTokenId || tokenId;

    if (!contract) {
      setError('Please connect your wallet first');
      return;
    }

    if (!idToVerify || !/^\d+$/.test(idToVerify)) {
      setError('Please enter a valid token ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setCredential(null);
      setMetadata(null);
      setShowQR(false);

      try { bc.postMessage({ type: 'SIM_START', mode: 'verification' }); } catch (e) { }
      await new Promise(r => setTimeout(r, 800));

      // Verify credential on blockchain
      try { bc.postMessage({ type: 'SIM_IPFS' }); } catch (e) { } // Visual step for "Fetching"
      const credentialData = await contract.verifyCredential(idToVerify);
      console.log('Credential data:', credentialData);

      // Fetch metadata from IPFS
      try { bc.postMessage({ type: 'SIM_BLOCKCHAIN' }); } catch (e) { } // Visual step for "Signature check"
      let metadataData = null;
      try {
        metadataData = await fetchMetadata(credentialData.metadataURI);
      } catch (metaError) {
        console.error('Error fetching metadata:', metaError);
      }

      // Print raw blockchain data to the console as requested by user
      console.log("\n%c===============================================================", "color: #9333ea; font-weight: bold");
      console.log("%c          BLOCKCHAIN STORAGE DUMP (Verified Token)             ", "background: #581c87; color: white; font-weight: bold; padding: 2px");
      console.log("%c===============================================================\n", "color: #9333ea; font-weight: bold");
      console.log(`🥇 TOKEN ID  : ${credentialData.tokenId.toString()}`);
      console.log(`👨‍🎓 STUDENT   : ${credentialData.student}`);
      console.log(`🔗 CID (URI) : ${credentialData.metadataURI}`);
      console.log(`📅 ISSUED AT : ${new Date(Number(credentialData.issueTimestamp) * 1000).toLocaleString()}`);
      console.log(`❌ REVOKED   : ${credentialData.revoked}`);
      console.log("%c---------------------------------------------------------------", "color: #9333ea");
      if (metadataData) {
        console.log("IPFS METADATA JSON:");
        console.log(metadataData);
        console.log("%c===============================================================\n", "color: #9333ea; font-weight: bold");
      }

      try { bc.postMessage({ type: 'SIM_CONFIRMED' }); } catch (e) { }

      setCredential({
        tokenId: credentialData.tokenId,
        student: credentialData.student,
        metadataURI: credentialData.metadataURI,
        issueTimestamp: credentialData.issueTimestamp,
        revoked: credentialData.revoked,
      });

      setMetadata(metadataData);
    } catch (err) {
      console.error('Error verifying credential:', err);
      if (err.message.includes('Credential does not exist')) {
        setError('Credential not found. Please check the token ID.');
      } else {
        setError(err.message || 'Failed to verify credential');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(window.location.href + '?tokenId=' + tokenId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Verify Credential</h1>
        <p className="text-gray-600 mb-8">
          Enter a token ID to verify the authenticity of an academic credential
        </p>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="card mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token ID
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter token ID (e.g., 55088231...)"
              className="input-field flex-1"
            />
            <button
              type="submit"
              disabled={loading || !contract}
              className="btn-primary px-8"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          {!contract && (
            <p className="text-sm text-orange-600 mt-2">
              Connect your wallet to verify credentials
            </p>
          )}
        </form>

        {/* Error Alert */}
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Loading State */}
        {loading && <Loading message="Verifying credential on blockchain..." />}

        {/* Verification Result */}
        {credential && (
          <div>
            {/* Verification Status */}
            <div className={`card mb-6 ${credential.revoked ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {credential.revoked ? '⚠️ Credential Revoked' : '✓ Credential Valid'}
                  </h3>
                  <p className="text-gray-600">
                    {credential.revoked
                      ? 'This credential has been revoked and is no longer valid.'
                      : 'This credential is authentic and has been verified on the blockchain.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!credential.revoked && (
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="btn-secondary"
                      title="Show QR code"
                    >
                      {showQR ? 'Hide QR' : '📱 Show QR Code Here'}
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className="btn-secondary"
                    title="Copy verification link"
                  >
                    {copied ? '✓ Copied' : '📋 Share'}
                  </button>
                </div>
              </div>

              {/* QR Code Section */}
              {showQR && !credential.revoked && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-3 font-semibold uppercase tracking-wider">🔒 Secure Blockchain Verification Scan</p>
                  <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-primary-100 ring-4 ring-primary-50">
                    <QRCodeSVG
                      value={`Signature valid\nDigitally Signed By:\nCertificate Authority\nCID: ${credential.metadataURI.substring(0, 5)}...${credential.metadataURI.substring(credential.metadataURI.length - 2)}`}
                      size={200}
                      level={"H"}
                      includeMargin={true}
                    />
                  </div>
                  <p className="mt-4 text-[10px] text-gray-400 font-mono text-center max-w-xs">
                    This digital seal contains a cryptographically signed proof of authenticity verified on the Ethereum network.
                  </p>
                </div>
              )}
            </div>

            {/* Credential Details */}
            <CredentialCard credential={credential} metadata={metadata} />

            {/* Blockchain Details */}
            <div className="card mt-6">
              <h3 className="text-lg font-bold mb-4">Blockchain Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Token ID:</span>
                  <span className="font-mono font-medium">#{credential.tokenId.toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Student Address:</span>
                  <span className="font-mono font-medium">
                    {credential.student.substring(0, 10)}...{credential.student.substring(credential.student.length - 8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {credential.revoked ? (
                    <span className="badge badge-danger">Revoked</span>
                  ) : (
                    <span className="badge badge-success">Valid</span>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Metadata URI:</span>
                  <a
                    href={ipfsToHttp(credential.metadataURI)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-mono text-xs break-all max-w-xs text-right"
                  >
                    {credential.metadataURI.substring(0, 30)}...
                  </a>
                </div>
              </div>
            </div>

            {/* What This Means */}
            <div className="card mt-6 bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-bold mb-3 text-blue-900">
                What does this mean?
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>This credential has been permanently recorded on the Ethereum blockchain</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>It cannot be altered, forged, or tampered with</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>The credential is non-transferable (Soulbound) and tied to the student's wallet</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Anyone can verify its authenticity using this token ID</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!credential && !loading && (
          <div className="card bg-gray-50">
            <h3 className="text-lg font-bold mb-3">How to Verify</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="font-bold mr-2 text-primary-600">1.</span>
                <span>Obtain the token ID from the credential holder or institution</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 text-primary-600">2.</span>
                <span>Enter the token ID in the form above</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 text-primary-600">3.</span>
                <span>Click "Verify" to check the credential on the blockchain</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 text-primary-600">4.</span>
                <span>Review the credential details and verification status</span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCredential;
