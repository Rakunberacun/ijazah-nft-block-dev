// components/ViewNft.tsx
"use client";

import { STACKS_TESTNET } from "@stacks/network";
import { fetchCallReadOnlyFunction, cvToJSON, uintCV } from "@stacks/transactions";
import React, { useState } from "react";
import { contractAddress, contractName, contractOwnerAddress } from "../lib/constants";

// Definisikan struktur data hasil verifikasi
interface NftMetadata {
  name: { value: string };
  description: { value: string };
  image: { value: string };
}

export default function ViewNft() {
  const [tokenId, setTokenId] = useState("");
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);
  const [error, setError] = useState("");

  const handleView = async (e: React.FormEvent) => {
    e.preventDefault();
    setMetadata(null);
    setError("");

    if (!tokenId || isNaN(parseInt(tokenId))) {
      setError("Please enter a valid Token ID.");
      return;
    }

    try {
      const options = {
        contractAddress,
        contractName,
        functionName: "get-token-metadata", // Pastikan nama fungsi ini benar
        functionArgs: [uintCV(tokenId)],
        network: STACKS_TESTNET,
        senderAddress: contractOwnerAddress,
      };

      const response = await fetchCallReadOnlyFunction(options);
      const jsonData = cvToJSON(response);

      // Periksa apakah ada data balikan dan ambil data dari lapisan kedua .value
      if (jsonData.value && jsonData.value.value) {
        setMetadata(jsonData.value.value); // <-- INI PERBAIKANNYA
      } else {
        setError(`NFT with Token ID ${tokenId} not found.`);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to fetch NFT data. Check the console for details.");
    }
  };

  return (
    <div className="form-container">
      <h2>🔍 Lihat Detail Ijazah</h2>
      <form onSubmit={handleView}>
        <input type="number" placeholder="Enter Token ID Ijazah" value={tokenId} onChange={(e) => setTokenId(e.target.value)} required />
        <button type="submit">Lihat Ijazah</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {metadata && (
        <div className="result-box">
          <h3>NFT #{tokenId} Metadata</h3>
          <p><strong>Name:</strong> {metadata.name.value}</p>
          <p><strong>Description:</strong> {metadata.description.value}</p>
          <p><strong>Image:</strong> {metadata.image.value}</p>
        </div>
      )}
    </div>
  );
}