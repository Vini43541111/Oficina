import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListaTiposServico from './pages/TiposServico/ListaTiposServico';
import FormTipoServico from './pages/TiposServico/FormTipoServico';
import ListaOrdensServico from './pages/OrdensServico/ListaOrdensServico';
import FormOrdemServico from './pages/OrdensServico/FormOrdemServico';
import DetalhesOrdemServico from './pages/OrdensServico/DetalhesOrdemServico';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/ordens-servico" replace />} />
          <Route path="/tipos-servico" element={<ListaTiposServico />} />
          <Route path="/tipos-servico/novo" element={<FormTipoServico />} />
          <Route path="/tipos-servico/:id/editar" element={<FormTipoServico />} />
          <Route path="/ordens-servico" element={<ListaOrdensServico />} />
          <Route path="/ordens-servico/nova" element={<FormOrdemServico />} />
          <Route path="/ordens-servico/:id" element={<DetalhesOrdemServico />} />
          <Route path="/ordens-servico/:id/editar" element={<FormOrdemServico />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
