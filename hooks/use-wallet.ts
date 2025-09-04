"use client"

import { useState, useEffect } from "react"

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string
  chainId: number | null
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: "0",
    chainId: null,
  })

  const [isLoading, setIsLoading] = useState(false)

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask to use this application")
      return
    }

    try {
      setIsLoading(true)

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        const address = accounts[0]

        // Get chain ID
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        })

        // Get balance (placeholder for now)
        const balance = "0"

        setWallet({
          isConnected: true,
          address,
          balance,
          chainId: Number.parseInt(chainId, 16),
        })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: "0",
      chainId: null,
    })
  }

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })

          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({
              method: "eth_chainId",
            })

            setWallet({
              isConnected: true,
              address: accounts[0],
              balance: "0",
              chainId: Number.parseInt(chainId, 16),
            })
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error)
        }
      }
    }

    checkConnection()
  }, [])

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    isLoading,
  }
}
