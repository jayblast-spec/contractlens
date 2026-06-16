import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ContractLens | Contract review',
  description: 'spot contract risks, plain-English obligations, and negotiation moves before signing',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
