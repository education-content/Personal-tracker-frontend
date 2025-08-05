// src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
    <Router>
      <AppRoutes />
    </Router>
    <Toaster richColors position="top-right" />
    </>
  );
}
