// Contract addresses (public blockchain data - safe to expose client-side)
export const CONTRACT_ADDRESSES = {
  PROJECT_REGISTRY: process.env.NEXT_PUBLIC_PROJECT_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
  CARBON_TOKEN: process.env.NEXT_PUBLIC_CARBON_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
}

// Supported networks
export const SUPPORTED_NETWORKS = {
  POLYGON_MUMBAI: {
    chainId: 80001,
    name: "Polygon Mumbai Testnet",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    blockExplorer: "https://mumbai.polygonscan.com",
  },
}

// API endpoints
export const API_ENDPOINTS = {
  UPLOAD: "/api/upload",
  VERIFY: "/api/verify",
}
