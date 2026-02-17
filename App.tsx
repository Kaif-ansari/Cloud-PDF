
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard'>('home');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setSelectedToolId(null);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 }
  };

  const renderContent = () => {
    if (selectedToolId) {
      return (
        <ToolPage 
          toolId={selectedToolId} 
          onBack={() => setSelectedToolId(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'home':
      default:
        return <Home onToolSelect={handleToolSelect} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onNavigateHome={handleNavigateHome}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedToolId || activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default App;
