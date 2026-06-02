import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buscarOrdemServico, atualizarOrdemServico } from '../../api/ordemServicoService';
import Toast from '../../components/Toast';

const STATUS_LABELS = {
  aberta: { label: 'Aberta', cor: 'primary' },
  em_andamento: { label: 'Em Andamento', cor: 'warning' },
  concluida: { label: 'Concluída', cor: 'success' },
  cancelada: { label: 'Cancelada', cor: 'danger' },
};

export default function DetalhesOrdemServico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ordem, setOrdem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState({ mensagem: '', tipo: '' });

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const { data } = await buscarOrdemServico(id);
      setOrdem(data);
    } catch {
      setToast({ mensagem: 'Erro ao carregar ordem de serviço.', tipo: 'erro' });
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const avancarStatus = async () => {
    const proximo = ordem.status === 'aberta' ? 'em_andamento' : 'concluida';
    try {
      setSalvando(true);
      await atualizarOrdemServico(id, { status: proximo });
      setToast({ mensagem: 'Status atualizado com sucesso!', tipo: 'sucesso' });
      await carregar();
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao atualizar status.';
      setToast({ mensagem: msg, tipo: 'erro' });
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!ordem) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Ordem de serviço não encontrada.</div>
        <Link to="/ordens-servico" className="btn btn-outline-secondary">
          Voltar
        </Link>
      </div>
    );
  }

  const st = STATUS_LABELS[ordem.status] || { label: ordem.status, cor: 'secondary' };

  return (
    <div className="container py-4">
      <Toast
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onFechar={() => setToast({ mensagem: '', tipo: '' })}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Ordem de Serviço #{ordem.id}</h2>
        <span className={`badge bg-${st.cor} fs-6`}>{st.label}</span>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-semibold">Dados do Cliente</div>
            <div className="card-body">
              <p className="mb-1">
                <strong>Nome:</strong> {ordem.nome_cliente}
              </p>
              <p className="mb-0">
                <strong>Telefone:</strong> {ordem.telefone_cliente}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-semibold">Dados do Veículo</div>
            <div className="card-body">
              <p className="mb-1">
                <strong>Modelo:</strong> {ordem.modelo_veiculo} ({ordem.ano_veiculo})
              </p>
              <p className="mb-0">
                <strong>Placa:</strong>{' '}
                <span className="badge bg-secondary">{ordem.placa_veiculo}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-semibold">Serviço</div>
            <div className="card-body">
              <p className="mb-1">
                <strong>Tipo:</strong> {ordem.tipoServico?.nome}
              </p>
              <p className="mb-1">
                <strong>Valor do Serviço:</strong>{' '}
                {Number(ordem.tipoServico?.valor).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
              <p className="mb-0">
                <strong>Tempo Estimado:</strong> {ordem.tipoServico?.tempo_estimado_horas}h
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-semibold">Execução</div>
            <div className="card-body">
              <p className="mb-1">
                <strong>Entrada:</strong>{' '}
                {new Date(ordem.data_entrada).toLocaleString('pt-BR')}
              </p>
              <p className="mb-1">
                <strong>Saída:</strong>{' '}
                {ordem.data_saida
                  ? new Date(ordem.data_saida).toLocaleString('pt-BR')
                  : <span className="text-muted">Em aberto</span>}
              </p>
              {ordem.duracao_horas != null && (
                <p className="mb-1">
                  <strong>Duração:</strong> {Number(ordem.duracao_horas).toFixed(2)}h
                </p>
              )}
              {ordem.tempo_decorrido_horas != null && ordem.status !== 'concluida' && (
                <p className="mb-1">
                  <strong>Tempo Decorrido:</strong> {Number(ordem.tempo_decorrido_horas).toFixed(2)}h
                </p>
              )}
              {ordem.valor_cobrado != null && (
                <p className="mb-0">
                  <strong>Valor Cobrado:</strong>{' '}
                  <span className="text-success fw-bold">
                    {Number(ordem.valor_cobrado).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {ordem.observacoes && (
          <div className="col-12">
            <div className="card">
              <div className="card-header fw-semibold">Observações</div>
              <div className="card-body">
                <p className="mb-0">{ordem.observacoes}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="d-flex gap-2 mt-4">
        {(ordem.status === 'aberta' || ordem.status === 'em_andamento') && (
          <button
            className="btn btn-success"
            onClick={avancarStatus}
            disabled={salvando}
          >
            {salvando
              ? 'Atualizando...'
              : ordem.status === 'aberta'
              ? 'Iniciar Serviço'
              : 'Concluir Ordem'}
          </button>
        )}
        {ordem.status !== 'concluida' && ordem.status !== 'cancelada' && (
          <Link to={`/ordens-servico/${id}/editar`} className="btn btn-outline-warning">
            Editar
          </Link>
        )}
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </div>
  );
}
