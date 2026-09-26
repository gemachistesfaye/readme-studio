import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';

export const Home: React.FC = () => {
  return (
    <Layout>
      <WorkspacePlaceholder />
    </Layout>
  );
};
