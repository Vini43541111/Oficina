const express = require('express');
const router = express.Router();
const OrdemServico = require('../models/OrdemServico');
const TipoServico = require('../models/TipoServico');

// POST /ordens-servico — Abrir nova ordem de serviço
router.post('/', async (req, res) => {
  try {
    const { nome_cliente, telefone_cliente, placa_veiculo, modelo_veiculo, ano_veiculo, tipo_servico_id, observacoes } = req.body;

    if (!nome_cliente || !telefone_cliente || !placa_veiculo || !modelo_veiculo || !ano_veiculo || !tipo_servico_id) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome_cliente, telefone_cliente, placa_veiculo, modelo_veiculo, ano_veiculo, tipo_servico_id.' });
    }

    // Verifica se o tipo de serviço existe
    const tipoServico = await TipoServico.findByPk(tipo_servico_id);
    if (!tipoServico) {
      return res.status(404).json({ erro: 'Tipo de serviço não encontrado.' });
    }

    // Regra de negócio: ano do veículo não pode ser futuro
    const anoAtual = new Date().getFullYear();
    if (ano_veiculo > anoAtual + 1) {
      return res.status(400).json({ erro: `Ano do veículo inválido. Máximo permitido: ${anoAtual + 1}.` });
    }

    const os = await OrdemServico.create({
      nome_cliente,
      telefone_cliente,
      placa_veiculo: placa_veiculo.toUpperCase(),
      modelo_veiculo,
      ano_veiculo,
      tipo_servico_id,
      observacoes,
      data_entrada: new Date(),
      status: 'aberta',
    });

    return res.status(201).json(os);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao criar ordem de serviço.', detalhe: error.message });
  }
});

// GET /ordens-servico — Listar todas as ordens de serviço (com dados do tipo de serviço)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query; // ?status=aberta

    const where = status ? { status } : {};

    const ordens = await OrdemServico.findAll({
      where,
      include: [{ model: TipoServico, as: 'tipoServico' }],
      order: [['data_entrada', 'DESC']],
    });

    return res.json(ordens);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao listar ordens de serviço.', detalhe: error.message });
  }
});

// GET /ordens-servico/:id — Buscar ordem de serviço por ID
router.get('/:id', async (req, res) => {
  try {
    const os = await OrdemServico.findByPk(req.params.id, {
      include: [{ model: TipoServico, as: 'tipoServico' }],
    });

    if (!os) return res.status(404).json({ erro: 'Ordem de serviço não encontrada.' });

    // Regra de negócio: se ainda aberta, calcula tempo parcial decorrido
    let tempoDecorrido = null;
    if (!os.data_saida) {
      const agora = new Date();
      const diffMs = agora - new Date(os.data_entrada);
      tempoDecorrido = (diffMs / (1000 * 60 * 60)).toFixed(2); // em horas
    }

    return res.json({ ...os.toJSON(), tempo_decorrido_horas: tempoDecorrido });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar ordem de serviço.', detalhe: error.message });
  }
});

// PUT /ordens-servico/:id — Atualizar/fechar ordem de serviço
router.put('/:id', async (req, res) => {
  try {
    const os = await OrdemServico.findByPk(req.params.id, {
      include: [{ model: TipoServico, as: 'tipoServico' }],
    });

    if (!os) return res.status(404).json({ erro: 'Ordem de serviço não encontrada.' });

    // Regra de negócio: OS cancelada ou concluída não pode ser editada
    if (os.status === 'concluida' || os.status === 'cancelada') {
      return res.status(400).json({ erro: `Não é possível editar uma OS com status "${os.status}".` });
    }

    const { status, observacoes, nome_cliente, telefone_cliente } = req.body;

    // Regra de negócio: ao concluir, registra data de saída e calcula valor e duração
    let camposExtras = {};
    if (status === 'concluida') {
      const dataSaida = new Date();

      // Regra: data de saída não pode ser anterior à data de entrada
      if (dataSaida < new Date(os.data_entrada)) {
        return res.status(400).json({ erro: 'A data de saída não pode ser anterior à data de entrada.' });
      }

      const diffMs = dataSaida - new Date(os.data_entrada);
      const duracaoHoras = diffMs / (1000 * 60 * 60);

      camposExtras = {
        data_saida: dataSaida,
        duracao_horas: duracaoHoras.toFixed(2),
        valor_cobrado: os.tipoServico.valor, // usa o valor vigente do tipo de serviço
      };
    }

    await os.update({ status, observacoes, nome_cliente, telefone_cliente, ...camposExtras });

    return res.json({
      ...os.toJSON(),
      mensagem: status === 'concluida' ? `OS concluída. Duração: ${camposExtras.duracao_horas}h. Valor: R$ ${camposExtras.valor_cobrado}` : undefined,
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao atualizar ordem de serviço.', detalhe: error.message });
  }
});

// DELETE /ordens-servico/:id — Cancelar/remover ordem de serviço
router.delete('/:id', async (req, res) => {
  try {
    const os = await OrdemServico.findByPk(req.params.id);
    if (!os) return res.status(404).json({ erro: 'Ordem de serviço não encontrada.' });

    // Regra de negócio: OS concluída não pode ser deletada, apenas cancelada via PUT
    if (os.status === 'concluida') {
      return res.status(400).json({ erro: 'OS concluída não pode ser removida. Use PUT para cancelar.' });
    }

    await os.destroy();
    return res.json({ mensagem: 'Ordem de serviço removida com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao remover ordem de serviço.', detalhe: error.message });
  }
});

module.exports = router;
