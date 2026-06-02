import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listarOrdensServico, deletarOrdemServico } from '../../api/ordemServicoService';
import Toast from '../../components/Toast';
import ModalConfirmar from '../../components/ModalConfirmar';

const STATUS_LABELS = {
  aberta: { label: 'Aberta', cor: 'primary' },
  em_andamento: { label: 'Em Andamento', cor: 'warning' },
  concluida: { label: 'Concluída', cor: 'success' },
  cancelada: { label: 'Cancelada', cor: 'danger' },
};

export default function ListaOrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [toast, setToast] = useState({ mensagem: '', tipo: '' });
  const [modal, setModal] = useState({ visivel: false, id: null });

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const { data } = await listarOrdensServico(filtroStatus);
      setOrdens(data);
    } catch {
      setToast({ mensagem: 'Erro ao carregar ordens de serviço.', tipo: 'erro' });
    } finally {
      setCarregando(false);
    }
  }, [filtroStatus]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const abrirModal = (id) => setModal({ visivel: true, id });
  const fecharModal = () => setModal({ visivel: false, id: null });

  const confirmarDelete = async () => {
    try {
      await deletarOrdemServico(modal.id);
      setToast({ mensagem: 'Ordem de serviço excluída com sucesso!', tipo: 'sucesso' });
      fecharModal();
      carregar();
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao excluir ordem de serviço.';
      setToast({ mensagem: msg, tipo: 'erro' });
      fecharModal();
    }
  };

  return (
    <div className="container py-4">
      <Toast
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onFechar={() => setToast({ mensagem: '', tipo: '' })}
      />
      <ModalConfirmar
        visivel={modal.visivel}
        mensagem="Tem certeza que deseja excluir esta ordem de serviço?"
        onConfirmar={confirmarDelete}
        onCancelar={fecharModal}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Ordens de Serviço</h2>
        <Link to="/ordens-servico/nova" className="btn btn-primary">
          + Nova Ordem
        </Link>
      </div>

      <div className="mb-3 d-flex align-items-center gap-2">
        <label className="form-label mb-0 fw-semibold">Filtrar por status:</label>
        <select
          className="form-select w-auto"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="aberta">Aberta</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluida">Concluída</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      {carregando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : ordens.length === 0 ? (
        <div className="alert alert-info">Nenhuma ordem de serviço encontrada.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Veículo</th>
                <th>Placa</th>
                <th>Serviço</th>
                <th>Data Entrada</th>
                <th>Status</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ordens.map((o) => {
                const st = STATUS_LABELS[o.status] || { label: o.status, cor: 'secondary' };
                return (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      <div className="fw-semibold">{o.nome_cliente}</div>
                      <small className="text-muted">{o.telefone_cliente}</small>
                    </td>
                    <td>
                      {o.modelo_veiculo} <span className="text-muted">({o.ano_veiculo})</span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{o.placa_veiculo}</span>
                    </td>
                    <td>{o.tipoServico?.nome || '—'}</td>
                    <td>{new Date(o.data_entrada).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`badge bg-${st.cor}`}>{st.label}</span>
                    </td>
                    <td className="text-center">
                      <Link
                        to={`/ordens-servico/${o.id}`}
                        className="btn btn-sm btn-outline-info me-1"
                      >
                        Detalhes
                      </Link>
                      {o.status !== 'concluida' && o.status !== 'cancelada' && (
                        <Link
                          to={`/ordens-servico/${o.id}/editar`}
                          className="btn btn-sm btn-outline-warning me-1"
                        >
                          Editar
                        </Link>
                      )}
                      {o.status !== 'concluida' && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => abrirModal(o.id)}
                        >
                          Excluir
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
