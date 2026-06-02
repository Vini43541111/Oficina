import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listarTiposServico, deletarTipoServico } from '../../api/tipoServicoService';
import Toast from '../../components/Toast';
import ModalConfirmar from '../../components/ModalConfirmar';

export default function ListaTiposServico() {
  const [tipos, setTipos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState({ mensagem: '', tipo: '' });
  const [modal, setModal] = useState({ visivel: false, id: null });

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const { data } = await listarTiposServico();
      setTipos(data);
    } catch {
      setToast({ mensagem: 'Erro ao carregar tipos de serviço.', tipo: 'erro' });
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const abrirModal = (id) => setModal({ visivel: true, id });
  const fecharModal = () => setModal({ visivel: false, id: null });

  const confirmarDelete = async () => {
    try {
      await deletarTipoServico(modal.id);
      setToast({ mensagem: 'Tipo de serviço excluído com sucesso!', tipo: 'sucesso' });
      fecharModal();
      carregar();
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao excluir tipo de serviço.';
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
        mensagem="Tem certeza que deseja excluir este tipo de serviço?"
        onConfirmar={confirmarDelete}
        onCancelar={fecharModal}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Tipos de Serviço</h2>
        <Link to="/tipos-servico/novo" className="btn btn-primary">
          + Novo Tipo
        </Link>
      </div>

      {carregando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : tipos.length === 0 ? (
        <div className="alert alert-info">Nenhum tipo de serviço cadastrado.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Tempo Estimado</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td className="fw-semibold">{t.nome}</td>
                  <td>{t.descricao || <span className="text-muted">—</span>}</td>
                  <td>
                    {Number(t.valor).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td>{t.tempo_estimado_horas}h</td>
                  <td className="text-center">
                    <Link
                      to={`/tipos-servico/${t.id}/editar`}
                      className="btn btn-sm btn-outline-warning me-2"
                    >
                      Editar
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => abrirModal(t.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
