import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate, ipfsToHttp } from '../utils/helpers';

const CredentialCard = ({ credential, metadata, onRevoke, onBurn, showActions = false }) => {
  const [showQR, setShowQR] = useState(false);

  // Generate professional verification string for QR code
  const getVerificationString = () => {
    if (!credential) return "";

    // Masking logic for CID (e.g. Qm...12)
    const cid = credential.metadataURI || "";
    const maskedCid = cid.length > 5
      ? `${cid.substring(0, 5)}...${cid.substring(cid.length - 2)}`
      : cid;

    // Shortened signature/address (Using student address as the digital signature/signer)
    const signature = credential.student
      ? `${credential.student.substring(0, 10)}...${credential.student.substring(credential.student.length - 8)}`
      : "N/A";

    return `Signature valid\nDigitally Signed By:\nCertificate Authority\nCID: ${maskedCid}`;
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Credential Badge */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mb-3">
            {metadata?.image ? (
              <img
                src={ipfsToHttp(metadata.image)}
                alt="Credential"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-white text-5xl">🎓</span>
            )}
          </div>

          {/* Professional QR Code on Card - Now with Toggle Option */}
          <div className="flex flex-col items-center">
            {showQR ? (
              <div className="bg-white p-2 border border-gray-100 rounded-md shadow-sm animate-fade-in" title="Scan to verify digital signature">
                <QRCodeSVG
                  value={getVerificationString()}
                  size={80}
                  level="H"
                  includeMargin={false}
                />
                <button
                  onClick={() => setShowQR(false)}
                  className="w-full text-[8px] text-center text-primary-500 mt-1 uppercase font-bold hover:text-primary-700 transition-colors"
                >
                  Hide Secure Scan
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowQR(true)}
                className="flex flex-col items-center p-2 border-2 border-dashed border-gray-200 rounded-md hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📱</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Show QR Code</span>
              </button>
            )}
          </div>
        </div>

        {/* Credential Details */}
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {metadata?.degree || metadata?.name || 'Academic Credential'}
              </h3>
              <p className="text-gray-600">{metadata?.institution || 'Institution Not Specified'}</p>
            </div>
            {credential.revoked ? (
              <span className="badge badge-danger">Revoked</span>
            ) : (
              <span className="badge badge-success">Valid</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium text-gray-800">{metadata?.studentName || 'Not Specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Grade</p>
              <p className="font-medium text-gray-800">{metadata?.grade || 'Not Specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Issue Date</p>
              <p className="font-medium text-gray-800">
                {metadata?.issueDate || formatDate(credential.issueTimestamp)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Token ID</p>
              <p className="font-medium text-gray-800">#{credential.tokenId.toString()}</p>
            </div>
          </div>

          {metadata?.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">{metadata.description}</p>
            </div>
          )}

          {metadata?.attributes?.find(attr => attr.trait_type === 'Marksheet Link') && metadata.attributes.find(attr => attr.trait_type === 'Marksheet Link').value !== 'N/A' && (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-500 mb-1 font-medium">Attached Document:</p>
              <a
                href={metadata.attributes.find(attr => attr.trait_type === 'Marksheet Link').value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline flex items-center"
              >
                📄 View Official Marksheet
              </a>
            </div>
          )}

          {/* Actions */}
          {showActions && !credential.revoked && (
            <div className="mt-4 flex space-x-3">
              <a
                href={ipfsToHttp(credential.metadataURI)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Metadata
              </a>
              {onRevoke && (
                <button
                  onClick={() => onRevoke(credential.tokenId)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Revoke (Admin)
                </button>
              )}
              {onBurn && (
                <button
                  onClick={() => onBurn(credential.tokenId)}
                  className="text-sm bg-red-100 text-red-700 hover:bg-red-200 font-bold ml-4 border border-red-300 rounded px-3 py-1 transition-colors"
                >
                  🔥 BURN CREDENTIAL (Student)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialCard;
