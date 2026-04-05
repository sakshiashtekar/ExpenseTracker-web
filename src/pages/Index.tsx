import React from 'react';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import SpendingBreakdown from '@/components/SpendingBreakdown';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 p-4 pb-24 md:pb-12">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>
        <SummaryCards />
        <SpendingBreakdown />
      </main>
    </div>
  );
};

export default Dashboard;
