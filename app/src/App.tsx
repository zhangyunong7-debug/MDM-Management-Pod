import { useAppStore } from '@/store/appStore';
import { Layout } from '@/components/custom/Layout';
import { EntityDrawer } from '@/components/custom/EntityDrawer';
import { Dashboard } from '@/sections/Dashboard';
import { EntitySearch } from '@/sections/EntitySearch';
import { CreateEntity } from '@/sections/CreateEntity';
import { DataCorrection } from '@/sections/DataCorrection';
import { ApprovalCenter } from '@/sections/ApprovalCenter';
import { OperationLogs } from '@/sections/OperationLogs';
import { Settings } from '@/sections/Settings';

function App() {
  const { currentPage } = useAppStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'search':
        return <EntitySearch />;
      case 'create':
        return <CreateEntity />;
      case 'corrections':
        return <DataCorrection />;
      case 'approvals':
        return <ApprovalCenter />;
      case 'logs':
        return <OperationLogs />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
      <EntityDrawer />
    </Layout>
  );
}

export default App;
