import { Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { AutoTrade } from './components/trading/AutoTrade';
import { TradeSignals } from './components/signals/TradeSignals';
import { TradeView } from './components/charts/TradeView';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { StockView } from './components/analysis/StockView';
import { Settings } from './components/settings/Settings';
import { Analytics } from './components/analytics/Analytics';
import { Accounts } from './components/accounts/Accounts';

export function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Core Trading Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/autotrade" element={<AutoTrade />} />
        <Route path="/signals" element={<TradeSignals />} />
        <Route path="/charts" element={<TradeView />} />
        <Route path="/portfolio" element={<PortfolioView />} />
        <Route path="/stocks" element={<StockView />} />
        
        {/* Management Routes */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/accounts" element={<Accounts />} />
        
        {/* Fallback */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
