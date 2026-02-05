import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import IntakePage from './pages/intake/IntakePage';
import TriagePage from './pages/triage/TriagePage';
import DetailPage from './pages/detail/DetailPage';
import InsightsPage from './pages/insights/InsightsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <h1>Support Request System</h1>
          <ul>
            <li>
              <Link to="/">Submit Request</Link>
            </li>
            <li>
              <Link to="/triage">Triage Queue</Link>
            </li>
            <li>
              <Link to="/insights">Insights</Link>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<IntakePage />} />
            <Route path="/triage" element={<TriagePage />} />
            <Route path="/request/:id" element={<DetailPage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
