// Contract addresses (to be updated when contracts are deployed)
export const CONTRACT_ADDRESSES = {
  PROJECT_REGISTRY: process.env.NEXT_PUBLIC_PROJECT_REGISTRY_ADDRESS || "",
  CARBON_TOKEN: process.env.NEXT_PUBLIC_CARBON_TOKEN_ADDRESS || "",
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
