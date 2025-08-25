// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ClientsPage from './pages/Clients/ClientsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            {/* Default route - redirect to clients */}
            <Route path="/" element={<Navigate to="/clients" replace />} />
            
            {/* Clients route */}
            <Route path="/clients" element={<ClientsPage />} />
            
            {/* Add more routes here as needed */}
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
