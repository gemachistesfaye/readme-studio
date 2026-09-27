import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  onOpenGitHubImport?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onOpenGitHubImport }) => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-zinc-100">
      <Header onOpenGitHubImport={onOpenGitHubImport} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
};
