import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ScratchCardPage from './pages/ScratchCardPage';
import PaymentPage from './pages/PaymentPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ScratchCardPage />} />
        <Route path="/claim" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
