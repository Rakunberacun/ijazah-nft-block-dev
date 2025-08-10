// app/page.tsx
"use client";

import { UserData } from "@stacks/connect";
import { useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import MintNftForm from "../components/MintNftForm";
import ViewNft from "../components/ViewNft";
import { contractOwnerAddress } from "../lib/constants";

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const isOwner = userData?.profile.stxAddress.testnet === contractOwnerAddress;

  return (
    <main className="container">
      <header>
        <h1>Ijazah NFT Collection</h1>
        <ConnectWallet onSessionUpdate={setUserData} />
      </header>
      
      <div className="content">
        {isOwner && <MintNftForm />}
        <ViewNft />
      </div>

      <footer>
        <p>Built on the Stacks Blockchain</p>
      </footer>
    </main>
  );
}