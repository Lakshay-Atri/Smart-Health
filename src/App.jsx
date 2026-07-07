import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DistrictOverview from './pages/DistrictOverview';
import CentreDetail from './pages/CentreDetail';
import InventoryPage from './pages/InventoryPage';
import StockOutWarning from './pages/StockOutWarning';
import Redistribution from './pages/Redistribution';
import FootfallForecast from './pages/FootfallForecast';
import AdminAlerts from './pages/AdminAlerts';
import { HealthCentreProvider } from './context/HealthCentreContext';

function App() {
  return (
    <HealthCentreProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DistrictOverview />} />
            <Route path="/centre/:centreId" element={<CentreDetail />} />
            <Route path="/centre/:centreId/inventory" element={<InventoryPage />} />
            <Route path="/warnings" element={<StockOutWarning />} />
            <Route path="/redistribution" element={<Redistribution />} />
            <Route path="/forecast" element={<FootfallForecast />} />
            <Route path="/alerts" element={<AdminAlerts />} />
            <Route path="*" element={
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-lg mx-auto mt-12">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Page Not Found</h2>
                <p className="text-slate-500 text-sm mt-2">
                  The page you are trying to visit does not exist or has been relocated.
                </p>
              </div>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HealthCentreProvider>
  );
}

export default App;
