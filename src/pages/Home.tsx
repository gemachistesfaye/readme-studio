import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { GeneratorWorkspace } from '@/components/workspace';

export const Home: React.FC = () => {
  return (
    <Layout>
      <GeneratorWorkspace />
    </Layout>
  );
};
