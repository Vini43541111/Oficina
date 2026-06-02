import api from './axios';

export const listarOrdensServico = (status) => {
  const params = status ? { status } : {};
  return api.get('/ordens-servico', { params });
};
export const buscarOrdemServico = (id) => api.get(`/ordens-servico/${id}`);
export const criarOrdemServico = (dados) => api.post('/ordens-servico', dados);
export const atualizarOrdemServico = (id, dados) => api.put(`/ordens-servico/${id}`, dados);
export const deletarOrdemServico = (id) => api.delete(`/ordens-servico/${id}`);
