// components/ConnectWallet.tsx
"use client";

import { AppConfig, UserSession, showConnect, UserData } from "@stacks/connect";
import { useState, useEffect } from "react";

export default function ConnectWallet({ onSessionUpdate }: { onSessionUpdate: (session: UserData | null) => void }) {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const appConfig = new AppConfig(["store_write", "publish_data"]);
    const session = new UserSession({ appConfig });
    setUserSession(session);

    if (session.isUserSignedIn()) {
      const data = session.loadUserData();
      setUserData(data);
      onSessionUpdate(data);
    }
  }, [onSessionUpdate]);

  const handleConnect = () => {
    const appDetails = {
      name: "Workshop NFT",
      icon: window.location.origin + "/favicon.ico",
    };

    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession: userSession!,
    });
  };

  const handleDisconnect = () => {
    userSession?.signUserOut(window.location.origin);
    setUserData(null);
    onSessionUpdate(null);
  };

  if (!userData) {
    return (
      <button onClick={handleConnect} className="connect-button">
        Connect Wallet
      </button>
    );
  }

  const userAddress = userData.profile.stxAddress.testnet;

  return (
    <div className="wallet-info">
      <p>Connected: <strong>{`${userAddress.substring(0, 5)}...${userAddress.substring(userAddress.length - 5)}`}</strong></p>
      <button onClick={handleDisconnect} className="disconnect-button">
        Disconnect
      </button>
    </div>
  );
}