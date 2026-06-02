import api from './axios';

export const listarTiposServico = () => api.get('/tipos-servico');
export const buscarTipoServico = (id) => api.get(`/tipos-servico/${id}`);
export const criarTipoServico = (dados) => api.post('/tipos-servico', dados);
export const atualizarTipoServico = (id, dados) => api.put(`/tipos-servico/${id}`, dados);
export const deletarTipoServico = (id) => api.delete(`/tipos-servico/${id}`);
