import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  criarOrdemServico,
  atualizarOrdemServico,
  buscarOrdemServico,
} from '../../api/ordemServicoService';
import { listarTiposServico } from '../../api/tipoServicoService';
import Toast from '../../components/Toast';

const INICIAL = {
  nome_cliente: '',
  telefone_cliente: '',
  placa_veiculo: '',
  modelo_veiculo: '',
  ano_veiculo: '',
  tipo_servico_id: '',
  observacoes: '',
  status: '',
};

const ANO_ATUAL = new Date().getFullYear();

export default function FormOrdemServico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState(INICIAL);
  const [tipos, setTipos] = useState([]);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState({ mensagem: '', tipo: '' });

  useEffect(() => {
    listarTiposServico().then(({ data }) => setTipos(data));
  }, []);

  useEffect(() => {
    if (!editando) return;
    buscarOrdemServico(id)
      .then(({ data }) =>
        setForm({
          nome_cliente: data.nome_cliente,
          telefone_cliente: data.telefone_cliente,
          placa_veiculo: data.placa_veiculo,
          modelo_veiculo: data.modelo_veiculo,
          ano_veiculo: data.ano_veiculo,
          tipo_servico_id: data.tipo_servico_id,
          observacoes: data.observacoes || '',
          status: data.status,
        })
      )
      .catch(() =>
        setToast({ mensagem: 'Erro ao carregar ordem de serviço.', tipo: 'erro' })
      );
  }, [id, editando]);

  const validar = () => {
    const e = {};
    if (!form.nome_cliente.trim()) e.nome_cliente = 'Nome do cliente é obrigatório.';
    if (!form.telefone_cliente.trim()) e.telefone_cliente = 'Telefone é obrigatório.';
    if (!form.placa_veiculo.trim()) e.placa_veiculo = 'Placa é obrigatória.';
    if (!form.modelo_veiculo.trim()) e.modelo_veiculo = 'Modelo é obrigatório.';
    if (!form.ano_veiculo || Number(form.ano_veiculo) < 1900 || Number(form.ano_veiculo) > ANO_ATUAL + 1)
      e.ano_veiculo = `Ano deve estar entre 1900 e ${ANO_ATUAL + 1}.`;
    if (!form.tipo_servico_id) e.tipo_servico_id = 'Selecione um tipo de serviço.';
    if (editando && !form.status) e.status = 'Status é obrigatório.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErros((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validar();
    if (Object.keys(e2).length) {
      setErros(e2);
      return;
    }
    try {
      setSalvando(true);
      if (editando) {
        await atualizarOrdemServico(id, {
          nome_cliente: form.nome_cliente,
          telefone_cliente: form.telefone_cliente,
          observacoes: form.observacoes || undefined,
          status: form.status,
        });
        setToast({ mensagem: 'Ordem de serviço atualizada com sucesso!', tipo: 'sucesso' });
      } else {
        await criarOrdemServico({
          nome_cliente: form.nome_cliente,
          telefone_cliente: form.telefone_cliente,
          placa_veiculo: form.placa_veiculo.toUpperCase(),
          modelo_veiculo: form.modelo_veiculo,
          ano_veiculo: Number(form.ano_veiculo),
          tipo_servico_id: Number(form.tipo_servico_id),
          observacoes: form.observacoes || undefined,
        });
        setToast({ mensagem: 'Ordem de serviço criada com sucesso!', tipo: 'sucesso' });
        setForm(INICIAL);
      }
      setTimeout(() => navigate('/ordens-servico'), 1200);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao salvar ordem de serviço.';
      setToast({ mensagem: msg, tipo: 'erro' });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="container py-4">
      <Toast
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onFechar={() => setToast({ mensagem: '', tipo: '' })}
      />

      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">
                {editando ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                <h6 className="text-muted mb-3">Dados do Cliente</h6>
                <div className="row">
                  <div className="col-md-7 mb-3">
                    <label className="form-label">Nome do Cliente *</label>
                    <input
                      type="text"
                      name="nome_cliente"
                      className={`form-control ${erros.nome_cliente ? 'is-invalid' : ''}`}
                      value={form.nome_cliente}
                      onChange={handleChange}
                      placeholder="Nome completo"
                    />
                    {erros.nome_cliente && (
                      <div className="invalid-feedback">{erros.nome_cliente}</div>
                    )}
                  </div>
                  <div className="col-md-5 mb-3">
                    <label className="form-label">Telefone *</label>
                    <input
                      type="text"
                      name="telefone_cliente"
                      className={`form-control ${erros.telefone_cliente ? 'is-invalid' : ''}`}
                      value={form.telefone_cliente}
                      onChange={handleChange}
                      placeholder="(49) 99999-9999"
                    />
                    {erros.telefone_cliente && (
                      <div className="invalid-feedback">{erros.telefone_cliente}</div>
                    )}
                  </div>
                </div>

                <h6 className="text-muted mb-3 mt-2">Dados do Veículo</h6>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Placa *</label>
                    <input
                      type="text"
                      name="placa_veiculo"
                      className={`form-control text-uppercase ${erros.placa_veiculo ? 'is-invalid' : ''}`}
                      value={form.placa_veiculo}
                      onChange={handleChange}
                      maxLength={8}
                      placeholder="ABC-1234"
                      disabled={editando}
                    />
                    {erros.placa_veiculo && (
                      <div className="invalid-feedback">{erros.placa_veiculo}</div>
                    )}
                  </div>
                  <div className="col-md-5 mb-3">
                    <label className="form-label">Modelo *</label>
                    <input
                      type="text"
                      name="modelo_veiculo"
                      className={`form-control ${erros.modelo_veiculo ? 'is-invalid' : ''}`}
                      value={form.modelo_veiculo}
                      onChange={handleChange}
                      placeholder="Gol 1.0"
                      disabled={editando}
                    />
                    {erros.modelo_veiculo && (
                      <div className="invalid-feedback">{erros.modelo_veiculo}</div>
                    )}
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Ano *</label>
                    <input
                      type="number"
                      name="ano_veiculo"
                      className={`form-control ${erros.ano_veiculo ? 'is-invalid' : ''}`}
                      value={form.ano_veiculo}
                      onChange={handleChange}
                      min={1900}
                      max={ANO_ATUAL + 1}
                      placeholder={ANO_ATUAL}
                      disabled={editando}
                    />
                    {erros.ano_veiculo && (
                      <div className="invalid-feedback">{erros.ano_veiculo}</div>
                    )}
                  </div>
                </div>

                <h6 className="text-muted mb-3 mt-2">Serviço</h6>
                <div className="mb-3">
                  <label className="form-label">Tipo de Serviço *</label>
                  <select
                    name="tipo_servico_id"
                    className={`form-select ${erros.tipo_servico_id ? 'is-invalid' : ''}`}
                    value={form.tipo_servico_id}
                    onChange={handleChange}
                    disabled={editando}
                  >
                    <option value="">Selecione...</option>
                    {tipos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome} — R$ {Number(t.valor).toFixed(2)} ({t.tempo_estimado_horas}h)
                      </option>
                    ))}
                  </select>
                  {erros.tipo_servico_id && (
                    <div className="invalid-feedback">{erros.tipo_servico_id}</div>
                  )}
                </div>

                {editando && (
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <select
                      name="status"
                      className={`form-select ${erros.status ? 'is-invalid' : ''}`}
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="aberta">Aberta</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                    {erros.status && <div className="invalid-feedback">{erros.status}</div>}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Observações</label>
                  <textarea
                    name="observacoes"
                    className="form-control"
                    rows={3}
                    value={form.observacoes}
                    onChange={handleChange}
                    placeholder="Observações opcionais"
                  />
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn btn-primary" disabled={salvando}>
                    {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Abrir Ordem'}
                  </button>
                  <Link to="/ordens-servico" className="btn btn-outline-secondary">
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
