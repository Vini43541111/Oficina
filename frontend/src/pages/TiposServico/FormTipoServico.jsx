import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  criarTipoServico,
  atualizarTipoServico,
  buscarTipoServico,
} from '../../api/tipoServicoService';
import Toast from '../../components/Toast';

const INICIAL = {
  nome: '',
  descricao: '',
  valor: '',
  tempo_estimado_horas: '',
};

export default function FormTipoServico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState(INICIAL);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState({ mensagem: '', tipo: '' });

  useEffect(() => {
    if (!editando) return;
    buscarTipoServico(id)
      .then(({ data }) =>
        setForm({
          nome: data.nome,
          descricao: data.descricao || '',
          valor: data.valor,
          tempo_estimado_horas: data.tempo_estimado_horas,
        })
      )
      .catch(() =>
        setToast({ mensagem: 'Erro ao carregar tipo de serviço.', tipo: 'erro' })
      );
  }, [id, editando]);

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório.';
    if (!form.valor || Number(form.valor) <= 0) e.valor = 'Valor deve ser maior que zero.';
    if (!form.tempo_estimado_horas || Number(form.tempo_estimado_horas) <= 0)
      e.tempo_estimado_horas = 'Tempo estimado deve ser maior que zero.';
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
      const payload = {
        nome: form.nome,
        descricao: form.descricao || undefined,
        valor: Number(form.valor),
        tempo_estimado_horas: Number(form.tempo_estimado_horas),
      };
      if (editando) {
        await atualizarTipoServico(id, payload);
        setToast({ mensagem: 'Tipo de serviço atualizado com sucesso!', tipo: 'sucesso' });
      } else {
        await criarTipoServico(payload);
        setToast({ mensagem: 'Tipo de serviço criado com sucesso!', tipo: 'sucesso' });
        setForm(INICIAL);
      }
      setTimeout(() => navigate('/tipos-servico'), 1200);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao salvar tipo de serviço.';
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
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">
                {editando ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Nome *</label>
                  <input
                    type="text"
                    name="nome"
                    className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Ex: Troca de óleo"
                  />
                  {erros.nome && <div className="invalid-feedback">{erros.nome}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Descrição</label>
                  <textarea
                    name="descricao"
                    className="form-control"
                    rows={3}
                    value={form.descricao}
                    onChange={handleChange}
                    placeholder="Descrição opcional"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Valor (R$) *</label>
                    <input
                      type="number"
                      name="valor"
                      className={`form-control ${erros.valor ? 'is-invalid' : ''}`}
                      value={form.valor}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      placeholder="0,00"
                    />
                    {erros.valor && <div className="invalid-feedback">{erros.valor}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tempo Estimado (horas) *</label>
                    <input
                      type="number"
                      name="tempo_estimado_horas"
                      className={`form-control ${erros.tempo_estimado_horas ? 'is-invalid' : ''}`}
                      value={form.tempo_estimado_horas}
                      onChange={handleChange}
                      min="0.1"
                      step="0.5"
                      placeholder="1.0"
                    />
                    {erros.tempo_estimado_horas && (
                      <div className="invalid-feedback">{erros.tempo_estimado_horas}</div>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn btn-primary" disabled={salvando}>
                    {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
                  </button>
                  <Link to="/tipos-servico" className="btn btn-outline-secondary">
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
