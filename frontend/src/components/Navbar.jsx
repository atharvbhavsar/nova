import { useWeb3 } from '../context/Web3Context';

const Navbar = () => {
  const { account, isIssuer, isAdmin, connectWallet, disconnectWallet, loading } = useWeb3();

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎓</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Academic Credentials
              </h1>
              <p className="text-xs text-gray-500">Blockchain Verification</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Home
            </a>
            {isIssuer && (
              <a href="/issue" className="text-gray-700 hover:text-primary-600 font-medium transition">
                Issue Credential
              </a>
            )}
            {account && (
              <a href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition">
                Dashboard
              </a>
            )}
            <a href="/verify" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Verify
            </a>
            <a href="/employer" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Employer Verification
            </a>
            <a href="/analytics" className="text-gray-700 hover:text-primary-600 font-medium transition flex items-center">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Live Analytics
            </a>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {account ? (
              <div className="flex items-center space-x-3">
                {/* Role Badges */}
                <div className="flex space-x-2">
                  {isAdmin && (
                    <span className="badge badge-danger text-xs">
                      Admin
                    </span>
                  )}
                  {isIssuer && (
                    <span className="badge badge-info text-xs">
                      Issuer
                    </span>
                  )}
                </div>

                {/* Account Address */}
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-mono text-gray-700">
                    {formatAddress(account)}
                  </span>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={disconnectWallet}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 space-x-4">
          <a href="/" className="text-gray-700 hover:text-primary-600 text-sm">
            Home
          </a>
          {isIssuer && (
            <a href="/issue" className="text-gray-700 hover:text-primary-600 text-sm">
              Issue
            </a>
          )}
          {account && (
            <a href="/dashboard" className="text-gray-700 hover:text-primary-600 text-sm">
              Dashboard
            </a>
          )}
          <a href="/verify" className="text-gray-700 hover:text-primary-600 text-sm">
            Verify
          </a>
          <a href="/employer" className="text-gray-700 hover:text-primary-600 text-sm">
            Employer Verification
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
