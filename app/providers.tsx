'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';

// Create wagmi config
const config = createConfig({
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'),
    [base.id]: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  );
} 