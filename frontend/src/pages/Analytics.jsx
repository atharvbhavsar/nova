import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ipfsToHttp } from '../utils/helpers';

const Analytics = () => {
    const { contract } = useWeb3();
    const [simStep, setSimStep] = useState(0);
    const [isIssuanceSim, setIsIssuanceSim] = useState(true);
    const [stats, setStats] = useState({ total: 0, valid: 0, revoked: 0 });
    const [logs, setLogs] = useState([]);

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const prefix = type === 'error' ? '✖' : type === 'success' ? '✔' : '❯';
        const color = type === 'error' ? 'text-red-400' : type === 'success' ? 'text-green-400' : type === 'primary' ? 'text-primary-400' : 'text-gray-300';

        setLogs(prev => [...prev, { timestamp, message, prefix, color }]);

        // Auto-scroll logic happens in the return
    };

    useEffect(() => {
        if (contract) {
            fetchStats();
        }

        const bc = new BroadcastChannel('blockchain_simulation');
        bc.onmessage = (event) => {
            const { type, mode } = event.data;

            if (type === 'SIM_START') {
                setIsIssuanceSim(mode === 'issuance');
                setSimStep(1);
                setLogs([]); // Clear logs for new run
                addLog(`Initializing ${mode} sequence...`, 'primary');
                addLog(`Remote Peer ID: QmPk...Z7y`, 'info');
            } else if (type === 'SIM_HASHING') {
                setSimStep(2);
                addLog(`Calculating Keccak256 root hash...`, 'info');
                addLog(`Integrity checksum: 0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`, 'success');
            } else if (type === 'SIM_IPFS') {
                setSimStep(3);
                addLog(`Pinning JSON bundle to IPFS cluster...`, 'info');
                addLog(`CID generated: bafybeig...v4ea`, 'success');
            } else if (type === 'SIM_BLOCKCHAIN') {
                setSimStep(4);
                addLog(`Broadcasting transaction to network...`, 'primary');
                addLog(`Gas estimate: ${20 + Math.floor(Math.random() * 10)} Gwei`, 'info');
                addLog(`Waiting for block confirmation...`, 'info');
            } else if (type === 'SIM_CONFIRMED') {
                setSimStep(5);
                addLog(`Transaction confirmed in block #${Math.floor(Math.random() * 1000000)}`, 'success');
                addLog(`[SYSTEM] Sequence completed successfully.`, 'success');
                fetchStats();
                // Reset after 10 seconds of showing success
                setTimeout(() => setSimStep(0), 10000);
            }
        };

        return () => {
            bc.close();
        };
    }, [contract]);

    const fetchStats = async () => {
        try {
            const total = await contract.getTotalCredentials();
            // In a real app we'd query events for more granular stats, but this works for demo
            setStats({ total: Number(total), valid: Number(total), revoked: 0 });
        } catch (e) {
            console.error(e);
        }
    };

    const runIssuanceSim = async () => {
        setIsIssuanceSim(true);
        setSimStep(1); // Starting Form
        setLogs([]);
        addLog(`MANUAL DEMO TRIGGERED: Issuance Lifecycle`, 'primary');
        addLog(`Collecting form data vectors...`, 'info');
        await new Promise(r => setTimeout(r, 1500));

        setSimStep(2); // Hashing
        addLog(`Hashing payload with Keccak256...`, 'info');
        addLog(`Root: 0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`, 'success');
        await new Promise(r => setTimeout(r, 1200));

        setSimStep(3); // IPFS
        addLog(`Transmitting to IPFS cluster nodes...`, 'info');
        addLog(`Pinned successfully: CID bafybe...${Math.random().toString(36).substring(2, 5)}`, 'success');
        await new Promise(r => setTimeout(r, 1800));

        setSimStep(4); // Blockchain
        addLog(`Broadcasting mint() to Ethereum network...`, 'primary');
        addLog(`Gas used: 154,291 units`, 'info');
        await new Promise(r => setTimeout(r, 2500));

        setSimStep(5); // Confirmed
        addLog(`Transaction CONFIRMED @ Block #${Math.floor(Math.random() * 999999)}`, 'success');
        addLog(`SBT Token ID: ${Math.floor(Math.random() * 10000)} issued.`, 'success');
        fetchStats();
    };

    const runVerifySim = async () => {
        setIsIssuanceSim(false);
        setSimStep(1); // Input CID
        setLogs([]);
        addLog(`MANUAL DEMO TRIGGERED: Verification Lifecycle`, 'primary');
        addLog(`Resolving CID pointer...`, 'info');
        await new Promise(r => setTimeout(r, 1000));

        setSimStep(2); // Pulling from nodes
        addLog(`Searching IPFS swarm for content...`, 'info');
        addLog(`Peer found: 12D3K...x5Q`, 'success');
        await new Promise(r => setTimeout(r, 1500));

        setSimStep(3); // Hash Integrity Check
        addLog(`Verifying hash integrity...`, 'info');
        addLog(`Match found: Integrity 100%`, 'success');
        await new Promise(r => setTimeout(r, 1200));

        setSimStep(4); // Signature Handshake
        addLog(`Performing cryptographic handshake...`, 'primary');
        addLog(`Sig: 0x${Math.random().toString(16).substring(2, 10)}... verified`, 'success');
        await new Promise(r => setTimeout(r, 1800));

        setSimStep(5); // Result: Valid
        addLog(`VERIFICATION COMPLETE: Valid Soulbound Token`, 'success');
    };

    const resetSim = () => setSimStep(0);

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Live Simulation <span className="text-primary-600">&</span> Analytics</h1>
                        <p className="text-gray-500 mt-2 text-lg">Visualizing the Decentralized Data Lifecycle in Real-Time</p>
                    </div>
                    <div className="flex gap-4 mt-6 md:mt-0">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
                            <span className="text-2xl font-bold text-primary-600">{stats.total}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Total Issued</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
                            <span className="text-2xl font-bold text-green-600">{stats.valid}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400">SBT Tokens</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Simulation Controls */}
                    <div className="space-y-6">
                        <div className="card border-t-4 border-primary-600 h-full">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <span className="mr-2">🕹️</span> Simulation Control Unit
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">Choose a process below to visualize how the system interacts with the decentralized stack.</p>

                            <div className="space-y-4">
                                <button
                                    onClick={runIssuanceSim}
                                    disabled={simStep > 0}
                                    className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${simStep > 0 && isIssuanceSim ? 'bg-primary-600 text-white shadow-lg' : 'bg-white border-2 border-primary-100 text-primary-700 hover:bg-primary-50'}`}
                                >
                                    {simStep > 0 && isIssuanceSim ? 'Simulation Running...' : '🚀 Start Issuance Lifecycle'}
                                </button>

                                <button
                                    onClick={runVerifySim}
                                    disabled={simStep > 0}
                                    className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${simStep > 0 && !isIssuanceSim ? 'bg-secondary-600 text-white shadow-lg' : 'bg-white border-2 border-secondary-100 text-secondary-700 hover:bg-secondary-50'}`}
                                >
                                    {simStep > 0 && !isIssuanceSim ? 'Simulation Running...' : '🔍 Start Verification Lifecycle'}
                                </button>

                                {simStep === 5 && (
                                    <button
                                        onClick={resetSim}
                                        className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 font-bold uppercase"
                                    >
                                        Return to Idle
                                    </button>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Network Status</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <span className="text-xs font-medium text-gray-600">IPFS Gateway</span>
                                        <span className="flex items-center text-[10px] font-bold text-green-600">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> ONLINE
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <span className="text-xs font-medium text-gray-600">Ethereum Node</span>
                                        <span className="flex items-center text-[10px] font-bold text-green-600">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> ACTIVE
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Simulation Area */}
                    <div className="lg:col-span-2">
                        <div className="card bg-gray-900 border-gray-800 text-white min-h-[500px] relative overflow-hidden shadow-2xl">
                            {/* Grid Background Effect */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            {simStep === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-12 relative z-10">
                                    <div className="w-20 h-20 bg-primary-900/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                        <span className="text-4xl italic font-serif text-primary-400">?</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Awaiting Simulation Signal</h3>
                                    <p className="text-gray-400 text-sm max-w-md">Initialize a sequence to visualize the cryptographic operations and data propagation across nodes.</p>
                                </div>
                            ) : (
                                <div className="p-8 h-full flex flex-col relative z-10">
                                    {/* Interaction Flow Visualization */}
                                    <div className="flex-grow flex flex-col md:flex-row items-center justify-around gap-8 py-12">

                                        {/* Step 1: Input/Anchor */}
                                        <div className={`flex flex-col items-center transition-all duration-500 ${simStep >= 1 ? 'scale-110' : 'opacity-20 translate-y-4'}`}>
                                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border-2 shadow-2xl ${simStep === 1 ? 'border-primary-400 bg-primary-900 animate-pulse' : 'border-gray-700 bg-gray-800'}`}>
                                                <span className="text-3xl">{isIssuanceSim ? '📄' : '📍'}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{isIssuanceSim ? 'Excel/Form' : 'CID Pointer'}</span>
                                            <span className="text-xs font-bold text-primary-400 mt-1">{simStep >= 1 ? 'CAPTURED' : ''}</span>
                                        </div>

                                        <div className={`w-8 h-[2px] bg-gray-700 hidden md:block overflow-hidden relative ${simStep >= 1 ? 'bg-primary-900' : ''}`}>
                                            {simStep === 1 && <div className="absolute inset-0 bg-primary-400 animate-slide-right"></div>}
                                        </div>

                                        {/* Step 2: Processing/Hashing */}
                                        <div className={`flex flex-col items-center transition-all duration-500 ${simStep >= 2 ? 'scale-110' : 'opacity-20 translate-y-4'}`}>
                                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-2 shadow-2xl ${simStep === 2 ? 'border-yellow-400 bg-yellow-900/30 animate-spin-slow' : 'border-gray-700 bg-gray-800'}`}>
                                                <span className="text-3xl">{isIssuanceSim ? '⚙️' : '🧠'}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{isIssuanceSim ? 'Metadata Hash' : 'Integrity Check'}</span>
                                            <span className="text-xs font-bold text-yellow-400 mt-1">{simStep >= 2 ? (isIssuanceSim ? 'JSON BUNDLED' : 'CID VERIFIED') : ''}</span>
                                        </div>

                                        <div className={`w-8 h-[2px] bg-gray-700 hidden md:block overflow-hidden relative ${simStep >= 2 ? 'bg-primary-900' : ''}`}>
                                            {simStep === 2 && <div className="absolute inset-0 bg-yellow-400 animate-slide-right"></div>}
                                        </div>

                                        {/* Step 3: Storage/IPFS */}
                                        <div className={`flex flex-col items-center transition-all duration-500 ${simStep >= 3 ? 'scale-110' : 'opacity-20 translate-y-4'}`}>
                                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border-2 shadow-2xl ${simStep === 3 ? 'border-cyan-400 bg-cyan-900 animate-pulse' : 'border-gray-700 bg-gray-800'}`}>
                                                <span className="text-3xl">☁️</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{isIssuanceSim ? 'IPFS Pinning' : 'Metadata Fetch'}</span>
                                            <span className="text-xs font-bold text-cyan-400 mt-1">{simStep >= 3 ? (isIssuanceSim ? 'CID ATTACHED' : 'DATA PULLED') : ''}</span>
                                        </div>

                                        <div className={`w-8 h-[2px] bg-gray-700 hidden md:block overflow-hidden relative ${simStep >= 3 ? 'bg-primary-900' : ''}`}>
                                            {simStep === 3 && <div className="absolute inset-0 bg-cyan-400 animate-slide-right"></div>}
                                        </div>

                                        {/* Step 4: Finalize/Blockchain */}
                                        <div className={`flex flex-col items-center transition-all duration-500 ${simStep >= 4 ? 'scale-110' : 'opacity-20 translate-y-4'}`}>
                                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border-2 shadow-2xl ${simStep === 4 ? (isIssuanceSim ? 'border-primary-400 bg-primary-900' : 'border-green-400 bg-green-900') + ' animate-bounce' : 'border-gray-700 bg-gray-800'}`}>
                                                <span className="text-3xl">{isIssuanceSim ? '⛓️' : '✍️'}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{isIssuanceSim ? 'Smart Contract' : 'Sign Check'}</span>
                                            <span className="text-xs font-bold text-primary-400 mt-1">{simStep >= 4 ? (isIssuanceSim ? 'MINTING SBT' : 'SIGNATURE VALID') : ''}</span>
                                        </div>
                                    </div>

                                    {/* Terminal Info Output */}
                                    <div className="bg-black/80 p-6 rounded-xl border border-gray-800 font-mono text-[10px] h-48 overflow-y-auto custom-scrollbar">
                                        <div className="flex items-center gap-2 mb-3 text-primary-500 opacity-70">
                                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                                            <span>LIVE SYSTEM DEBUGGER v1.0.4</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {logs.length === 0 ? (
                                                <p className="text-gray-600 italic">Waiting for process signals...</p>
                                            ) : (
                                                logs.map((log, i) => (
                                                    <div key={i} className={`flex gap-3 leading-relaxed animate-fade-in`}>
                                                        <span className="text-gray-600 flex-shrink-0">[{log.timestamp}]</span>
                                                        <span className={`${log.color} flex-shrink-0`}>{log.prefix}</span>
                                                        <span className={`${log.color}`}>{log.message}</span>
                                                    </div>
                                                ))
                                            )}
                                            <p className="animate-pulse text-primary-400">_</p>
                                        </div>
                                    </div>

                                    {/* Final Success Overlay */}
                                    {simStep === 5 && (
                                        <div className="mt-8 bg-green-900/20 border border-green-500/50 rounded-xl p-4 flex items-center shadow-lg animate-fade-in">
                                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-4">
                                                <span className="text-2xl text-white">✅</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-green-400 uppercase tracking-tight italic">Mission Critical Success</h4>
                                                <p className="text-gray-300 text-xs text-balance">The lifecycle simulation of the {isIssuanceSim ? 'Issuance' : 'Verification'} process has completed with 100% integrity.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Injected Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide-right {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                .animate-slide-right {
                    animation: slide-right 1s linear infinite;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default Analytics;
