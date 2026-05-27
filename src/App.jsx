import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/profile" element={<HomePage />} />
        <Route path="/links" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

export default App;