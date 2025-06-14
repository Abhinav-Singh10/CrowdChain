'use client';

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Adjust path to your Button component
import { ArrowRight } from 'lucide-react';
import { ConnectButton } from "thirdweb/react";
import { client } from "@/app/client";
import { createWallet } from "thirdweb/wallets";
const wallets = [
  createWallet("io.metamask"),
  createWallet("app.phantom"),
  createWallet("app.backpack"),
  createWallet("com.brave.wallet"),
  createWallet("com.binance.wallet"),
  createWallet("com.coinbase.wallet"),
];

const CustomConnectTrigger: React.FC = () => {
  // Ref to wrap ConnectButton's container
  const connectButtonRef = useRef<HTMLDivElement>(null);

  // Handler for custom button click
  const handleCustomClick = () => {
    // Find the button element rendered by ConnectButton
    const button = connectButtonRef.current?.querySelector('button');
    if (button) {
      button.click(); // Trigger ConnectButton's click event
    } else {
      console.warn('ConnectButton button not found');
    }
  };

  // Log for debugging (optional)
  useEffect(() => {
    const button = connectButtonRef.current?.querySelector('button');
    console.log('ConnectButton button:', button);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4 cursor-pointer">
      {/* Custom stylized button */}
      <Button
        asChild
        size="lg"
        className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-600 px-8 text-lg hover:shadow-lg hover:shadow-teal-500/20 "
        onClick={handleCustomClick} // Trigger ConnectButton click
      >
        <span>
          Connect Wallet
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Button>

      {/* Hardcoded Thirdweb ConnectButton */}
      <div ref={connectButtonRef} className='hidden cursor-pointer'>
        <ConnectButton 
          client={client}
          wallets={wallets}
          connectButton={{ label: 'Connect Wallet' }}
          connectModal={{ size: 'wide' }}
        />
      </div>
    </div>
  );
};

export default CustomConnectTrigger;
