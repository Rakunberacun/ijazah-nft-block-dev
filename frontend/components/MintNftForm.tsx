// components/MintNftForm.tsx
"use client";

import { openContractCall } from "@stacks/connect";
import { STACKS_TESTNET } from "@stacks/network";
import { principalCV, stringAsciiCV } from "@stacks/transactions";
import React, { useState } from "react";
import { contractAddress, contractName } from "../lib/constants";

export default function MintNftForm() {
  const [recipient, setRecipient] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. Tombol 'Mint NFT' diklik, fungsi handleMint berjalan.");

    try {
      const functionArgs = [
        principalCV(recipient),
        stringAsciiCV(name),
        stringAsciiCV(description),
        stringAsciiCV(image),
      ];
      console.log("2. Argumen untuk kontrak berhasil dibuat:", functionArgs);

      const options = {
        contractAddress,
        contractName,
        functionName: 'mint',
        functionArgs,
        network: STACKS_TESTNET,
        appDetails: {
          name: 'Workshop NFT',
          icon: window.location.origin + '/favicon.ico',
        },
        onFinish: (data: any) => {
          console.log("Transaksi selesai!", data);
          alert(`Transaksi berhasil dikirim! TXID: ${data.txId}`);
        },
        onCancel: () => {
          console.log("Transaksi dibatalkan oleh pengguna.");
          alert("Transaksi dibatalkan.");
        },
      };
      console.log("3. Opsi untuk transaksi:", options);

      console.log("4. Memanggil openContractCall untuk membuka popup wallet...");
      await openContractCall(options);
      console.log("5. openContractCall selesai (seharusnya popup sudah muncul).");

    } catch (error) {
      console.error("!!! TERJADI ERROR:", error);
      alert(`Terjadi error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="form-container">
      <h2>✨ Bikin Ijazah Murid (Sekolah Only)</h2>
      <form onSubmit={handleMint}>
        <input type="text" placeholder="Recipient STX Address" value={recipient} onChange={e => setRecipient(e.target.value)} required />
        <input type="text" placeholder="Nama Murid" value={name} onChange={e => setName(e.target.value)} required />
        <input type="text" placeholder="Deskripsi Kelulusan" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="text" placeholder="Image URL (e.g., ijazah.png)" value={image} onChange={e => setImage(e.target.value)} required />
        <button type="submit">Buat Ijazah NFT</button>
      </form>
    </div>
  );
}