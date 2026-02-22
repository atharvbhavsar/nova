const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-gray-400 text-sm">
              Secure blockchain-based academic credential verification system using 
              non-transferable NFTs (Soulbound tokens).
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/verify" className="text-gray-400 hover:text-white transition">
                  Verify Credential
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-white transition">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="text-lg font-bold mb-4">Technology</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Ethereum Blockchain</li>
              <li>✓ ERC-721 Standard</li>
              <li>✓ IPFS Storage</li>
              <li>✓ Smart Contracts</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Academic Credentials. Built with Solidity & React.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
