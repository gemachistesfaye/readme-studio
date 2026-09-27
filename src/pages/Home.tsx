import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GeneratorWorkspace } from '@/components/workspace';

export const Home: React.FC = () => {
  const [isGitHubImportOpen, setIsGitHubImportOpen] = useState(false);

  return (
    <Layout onOpenGitHubImport={() => setIsGitHubImportOpen(true)}>
      <GeneratorWorkspace
        isGitHubImportOpen={isGitHubImportOpen}
        onCloseGitHubImport={() => setIsGitHubImportOpen(false)}
        onOpenGitHubImport={() => setIsGitHubImportOpen(true)}
      />
    </Layout>
  );
};
