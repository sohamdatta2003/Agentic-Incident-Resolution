import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { Incidents } from '@/pages/Incidents';
import { IncidentDetails } from '@/pages/IncidentDetails';
import { KnowledgeBase } from '@/pages/KnowledgeBase';
import { Services } from '@/pages/Services';
import { Health } from '@/pages/Health';
import { Settings } from '@/pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/incidents/:id" element={<IncidentDetails />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/services" element={<Services />} />
        <Route path="/health" element={<Health />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
