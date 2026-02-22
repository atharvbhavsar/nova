import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { isValidAddress } from '../utils/helpers';
import * as XLSX from 'xlsx';

const IssueCredential = () => {
  const { account, contract, isIssuer } = useWeb3();
  const [bc] = useState(() => new BroadcastChannel('blockchain_simulation'));

  useEffect(() => {
    return () => bc.close();
  }, [bc]);

  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'batch'

  // Single Form State
  const [formData, setFormData] = useState({
    studentAddress: '',
    studentEmail: '',
    studentName: '',
    institution: '',
    degree: '',
    grade: '',
    issueDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  // Batch Form State
  const [batchData, setBatchData] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, status: 'idle' });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const uploadToIPFS = async (metadata) => {
    console.log('Uploading metadata:', metadata);
    const pinataKey = import.meta.env.VITE_PINATA_API_KEY;
    const pinataSecret = import.meta.env.VITE_PINATA_API_SECRET;

    if (pinataKey && pinataSecret) {
      try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': pinataKey,
            'pinata_secret_api_key': pinataSecret,
          },
          body: JSON.stringify({
            pinataContent: metadata,
            pinataMetadata: {
              name: `credential-${metadata.studentName}-${Date.now()}`,
            },
          }),
        });

        if (!response.ok) throw new Error('Pinata upload failed');
        const data = await response.json();
        return `ipfs://${data.IpfsHash}`;
      } catch (error) {
        console.error('Error uploading to Pinata:', error);
        throw new Error('Failed to upload metadata to IPFS.');
      }
    }

    console.log('Using localStorage simulation (Pinata credentials not configured)');
    const metadataString = JSON.stringify(metadata);
    const hash = `Qm${btoa(metadataString).substring(0, 44).replace(/[^a-zA-Z0-9]/g, 'x')}`;
    const ipfsUri = `ipfs://${hash}`;

    try {
      localStorage.setItem(`ipfs_metadata_${hash}`, metadataString);
    } catch (error) {
      console.error('Error storing metadata:', error);
    }
    return ipfsUri;
  };

  // ------------------------------------------ //
  //  SINGLE UPLOAD LOGIC
  // ------------------------------------------ //
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValidAddress(formData.studentAddress)) {
      setError('Invalid student wallet address');
      return;
    }
    if (!formData.studentName || !formData.institution || !formData.degree) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const metadata = {
        name: `${formData.degree} - ${formData.studentName}`,
        description: formData.description || `Academic credential issued by ${formData.institution}`,
        institution: formData.institution,
        studentName: formData.studentName,
        studentEmail: formData.studentEmail,
        degree: formData.degree,
        grade: formData.grade,
        issueDate: formData.issueDate,
        image: '',
        attributes: [
          { trait_type: 'Institution', value: formData.institution },
          { trait_type: 'Degree', value: formData.degree },
          { trait_type: 'Grade', value: formData.grade },
          { trait_type: 'Issue Date', value: formData.issueDate },
        ],
      };

      try { bc.postMessage({ type: 'SIM_START', mode: 'issuance' }); } catch (e) { }
      await new Promise(r => setTimeout(r, 800));

      try { bc.postMessage({ type: 'SIM_HASHING' }); } catch (e) { }
      await new Promise(r => setTimeout(r, 1000));

      setLoading(true);

      try { bc.postMessage({ type: 'SIM_IPFS' }); } catch (e) { }
      const metadataURI = await uploadToIPFS(metadata);

      try { bc.postMessage({ type: 'SIM_BLOCKCHAIN' }); } catch (e) { }
      const tx = await contract.issueCredential(formData.studentAddress, metadataURI);
      const receipt = await tx.wait();

      const event = receipt.logs.find((log) => {
        try {
          return contract.interface.parseLog(log).name === 'CredentialIssued';
        } catch { return false; }
      });
      let tokenId = 'Unknown';
      if (event) {
        tokenId = contract.interface.parseLog(event).args.tokenId.toString();
      }

      setSuccess(`Credential successfully issued! Token ID: ${tokenId}`);
      try { bc.postMessage({ type: 'SIM_CONFIRMED' }); } catch (e) { }

      // LOG FOR JUDGES
      console.log("\n%c===============================================================", "color: #3b82f6; font-weight: bold");
      console.log("%c          BLOCKCHAIN TRANSACTION RECEIPT (Single)              ", "background: #1e3a8a; color: white; font-weight: bold; padding: 2px");
      console.log("%c===============================================================", "color: #3b82f6; font-weight: bold");
      console.log(`✅ STATUS     : TRANSACTION CONFIRMED`);
      console.log(`🥇 TOKEN ID   : ${tokenId}`);
      console.log(`👨‍🎓 STUDENT    : ${formData.studentAddress}`);
      console.log(`🔗 CID (URI)  : ${metadataURI}`);
      console.log(`⛓️ TX HASH    : ${tx.hash}`);
      console.log(`⛽ GAS USED   : ${receipt.gasUsed.toString()}`);
      console.log("%c---------------------------------------------------------------", "color: #3b82f6");
      console.log("METADATA BUNDLED FOR IPFS:", metadata);
      console.log("%c===============================================================\n", "color: #3b82f6; font-weight: bold");

      setFormData({ studentAddress: '', studentEmail: '', studentName: '', institution: '', degree: '', grade: '', issueDate: new Date().toISOString().split('T')[0], description: '' });
    } catch (err) {
      setError(err.message || 'Failed to issue credential');
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------ //
  //  BATCH EXCEL LOGIC
  // ------------------------------------------ //
  const handleFileUpload = (e) => {
    setError(null);
    setSuccess(null);
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { raw: false });

        if (data.length === 0) {
          setError('The uploaded Excel file is empty.');
          return;
        }

        // Validate Headers exist conceptually
        const expectedHeaders = ['studentAddress', 'studentEmail', 'studentName', 'institution', 'degree'];
        const firstRow = data[0];
        const missingHeaders = expectedHeaders.filter(h => !(h in firstRow));
        if (missingHeaders.length > 0) {
          setError(`Missing required columns in Excel: ${missingHeaders.join(', ')}`);
          return;
        }

        setBatchData(data);
      } catch (err) {
        setError('Failed to parse the Excel file. Please make sure it is valid.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleBatchIssue = async () => {
    if (batchData.length === 0) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    setBatchProgress({ current: 0, total: batchData.length, status: 'uploading_ipfs' });
    setBatchResults([]);

    try {
      const students = [];
      const metadataURIs = [];
      const results = [];

      // Phase 1: Upload Metadata to IPFS
      for (let i = 0; i < batchData.length; i++) {
        const row = batchData[i];
        setBatchProgress({ current: i + 1, total: batchData.length, status: 'uploading_ipfs' });

        const studentAddr = (row.studentAddress || '').toString().trim();

        if (!isValidAddress(studentAddr)) {
          throw new Error(`Invalid Ethereum Address on row ${i + 1}: ${row.studentAddress}`);
        }

        const metadata = {
          name: `${row.degree} - ${row.studentName}`,
          description: row.description || `Academic credential issued by ${row.institution}`,
          institution: row.institution,
          studentName: row.studentName,
          studentEmail: row.studentEmail || '',
          degree: row.degree,
          grade: row.grade || 'N/A',
          issueDate: row.issueDate || new Date().toISOString().split('T')[0],
          image: '',
          attributes: [
            { trait_type: 'Institution', value: row.institution },
            { trait_type: 'Degree', value: row.degree },
            { trait_type: 'Grade', value: row.grade || 'N/A' },
            { trait_type: 'Issue Date', value: row.issueDate || new Date().toISOString().split('T')[0] },
            { trait_type: 'Marksheet Link', value: row.marksheetLink || 'N/A' },
          ],
        };

        const uri = await uploadToIPFS(metadata);
        students.push(studentAddr);
        metadataURIs.push(uri);

        // Show pending success logic for the table
        results.push({ name: row.studentName, status: 'Pending Tx', tokenId: null, error: null });
      }

      setBatchResults(results);

      // Phase 2: Send Single Smart Contract Transaction
      setBatchProgress({ current: batchData.length, total: batchData.length, status: 'signing_tx' });

      const tx = await contract.issueBatchCredentials(students, metadataURIs);
      console.log('Batch Transaction submitted:', tx.hash);

      const receipt = await tx.wait();
      console.log('Batch Transaction confirmed:', receipt);

      // Extract all CredentialIssued events
      const issuedEvents = receipt.logs
        .filter((log) => {
          try {
            return contract.interface.parseLog(log).name === 'CredentialIssued';
          } catch {
            return false;
          }
        })
        .map((log) => contract.interface.parseLog(log).args.tokenId.toString());

      // Update the results table with the actual Token IDs
      const finalResults = results.map((result, i) => ({
        ...result,
        status: 'Success',
        tokenId: issuedEvents[i] || 'Unknown',
      }));

      setBatchResults(finalResults);
      setSuccess(`Batch issuance complete! Successfully processed ${batchData.length} students in 1 transaction.`);

      // LOG FOR JUDGES
      console.log("\n%c===============================================================", "color: #10b981; font-weight: bold");
      console.log("%c          BLOCKCHAIN TRANSACTION RECEIPT (Batch)               ", "background: #064e3b; color: white; font-weight: bold; padding: 2px");
      console.log("%c===============================================================", "color: #10b981; font-weight: bold");
      console.log(`✅ STATUS     : BATCH TRANSACTION CONFIRMED`);
      console.log(`📦 SIZE       : ${batchData.length} Credentials`);
      console.log(`⛓️ TX HASH    : ${tx.hash}`);
      console.log(`⛽ TOTAL GAS  : ${receipt.gasUsed.toString()}`);
      console.log(`📊 TOKEN IDS  : ${issuedEvents.join(', ')}`);
      console.log("%c---------------------------------------------------------------", "color: #10b981");
      console.log("LAST METADATA BUNDLE:", metadataURIs[metadataURIs.length - 1]);
      console.log("%c===============================================================\n", "color: #10b981; font-weight: bold");

    } catch (err) {
      console.error('Batch Error:', err);
      setError(err.message || 'An error occurred during batch processing.');
      // If we failed mid-way, mark whatever results we had as failed
      setBatchResults(batchData.map(r => ({ name: r.studentName, status: 'Failed', error: err.message, tokenId: null })));
    } finally {
      setBatchProgress(prev => ({ ...prev, status: 'done' }));
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { studentAddress: '0x123...', studentEmail: 'john.doe@example.com', studentName: 'John Doe', institution: 'MIT', degree: 'BSc Computer Science', grade: '3.9 GPA', issueDate: '2023-05-15', description: 'Honors Student', marksheetLink: 'https://link-to-marksheet.com/pdf' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Credential_Batch_Template.xlsx");
  };

  // ------------------------------------------ //
  //  RENDER
  // ------------------------------------------ //
  if (!account) return <div className="container mx-auto px-4 py-12"><Alert type="warning" message="Please connect your wallet to continue" /></div>;
  if (!isIssuer) return <div className="container mx-auto px-4 py-12"><Alert type="error" message="Access Denied: You don't have permission to issue credentials." /></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Issue Academic Credential</h1>
        <p className="text-gray-600 mb-8">Create single or multiple verifiable credentials for students.</p>

        {/* Custom Tab Bar */}
        <div className="flex border-b mb-6">
          <button onClick={() => setActiveTab('single')} className={`py-2 px-6 font-medium text-sm transition-colors duration-200 outline-none ${activeTab === 'single' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>Single Student</button>
          <button onClick={() => setActiveTab('batch')} className={`py-2 px-6 font-medium text-sm transition-colors duration-200 outline-none ${activeTab === 'batch' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>Batch Upload (Excel)</button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {/* SINGLE STUDENT TAB */}
        {activeTab === 'single' && (
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Wallet Address *</label>
                <input type="text" name="studentAddress" value={formData.studentAddress} onChange={handleChange} placeholder="0x..." className="input-field font-mono" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Email *</label>
                <input type="email" name="studentEmail" value={formData.studentEmail} onChange={handleChange} placeholder="student@university.edu" className="input-field" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="John Doe" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
                <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="MIT" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree / Certificate *</label>
                <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="BSc Computer Science" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade / GPA</label>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="3.9 GPA" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto px-8">
              {loading ? 'Issuing Credential...' : 'Issue Credential'}
            </button>
          </form>
        )}

        {/* BATCH UPLOAD TAB */}
        {activeTab === 'batch' && (
          <div className="card space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
              <div>
                <p className="font-semibold text-gray-800">Need the correct columns?</p>
                <p className="text-gray-600">Download the expected format to ensure your upload succeeds.</p>
              </div>
              <button onClick={downloadTemplate} className="btn-secondary text-xs px-4 py-2">Download Template.xlsx</button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors">
              <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-all cursor-pointer" />
            </div>

            {batchData.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Preview Data ({batchData.length} students)</h3>
                  {batchProgress.status === 'idle' && (
                    <button onClick={handleBatchIssue} disabled={loading} className="btn-primary px-6">
                      {loading ? 'Processing...' : 'Start Batch Issuing'}
                    </button>
                  )}
                </div>

                {batchProgress.status !== 'idle' && batchProgress.status !== 'done' && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                    <p className="font-semibold text-primary-800 mb-2">
                      {batchProgress.status === 'uploading_ipfs' ? `Uploading Data... (${batchProgress.current}/${batchProgress.total})` : 'Waiting for MetaMask confirmation...'}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary-600 h-2.5 rounded-full transition-all" style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}></div>
                    </div>
                    {batchProgress.status === 'signing_tx' && <p className="text-sm mt-3 text-primary-700 font-bold">Please check MetaMask to sign the Batch Mint transaction.</p>}
                  </div>
                )}

                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Student Wallet</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Degree</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batchData.map((row, idx) => {
                        const result = batchResults[idx];
                        let statusBadge = <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Pending</span>;

                        if (result) {
                          if (result.status === 'Success') {
                            statusBadge = <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs break-all shadow-sm block">Success: #{result.tokenId}</span>;
                          } else {
                            statusBadge = <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs break-all block">Error: {result.error}</span>;
                          }
                        } else if (batchProgress.status === 'running' && idx === batchProgress.current - 1) {
                          statusBadge = <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs animate-pulse">Minting...</span>;
                        }

                        return (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 border-r max-w-xs">{statusBadge}</td>
                            <td className="px-6 py-4 font-mono text-xs text-gray-500 truncate">{row.studentAddress}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.studentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{row.degree}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {loading && activeTab === 'single' && <div className="mt-8"><Loading message="Processing transaction..." /></div>}
      </div>
    </div>
  );
};

export default IssueCredential;
