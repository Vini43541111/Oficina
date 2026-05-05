const express = require('express');
const router = express.Router();
const TipoServico = require('../models/TipoServico');

// POST /tipos-servico — Cadastrar novo tipo de serviço
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, valor, tempo_estimado_horas } = req.body;

    if (!nome || !valor || !tempo_estimado_horas) {
      return res.status(400).json({ erro: 'nome, valor e tempo_estimado_horas são obrigatórios.' });
    }
    if (valor <= 0) {
      return res.status(400).json({ erro: 'O valor deve ser maior que zero.' });
    }
    if (tempo_estimado_horas <= 0) {
      return res.status(400).json({ erro: 'O tempo estimado deve ser maior que zero.' });
    }

    const tipoServico = await TipoServico.create({ nome, descricao, valor, tempo_estimado_horas });
    return res.status(201).json(tipoServico);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao criar tipo de serviço.', detalhe: error.message });
  }
});

// GET /tipos-servico — Listar todos os tipos de serviço
router.get('/', async (req, res) => {
  try {
    const tipos = await TipoServico.findAll({ order: [['nome', 'ASC']] });
    return res.json(tipos);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar tipos de serviço.', detalhe: error.message });
  }
});

// GET /tipos-servico/:id — Buscar tipo de serviço por ID
router.get('/:id', async (req, res) => {
  try {
    const tipo = await TipoServico.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ erro: 'Tipo de serviço não encontrado.' });
    return res.json(tipo);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar tipo de serviço.', detalhe: error.message });
  }
});

// PUT /tipos-servico/:id — Atualizar tipo de serviço
router.put('/:id', async (req, res) => {
  try {
    const tipo = await TipoServico.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ erro: 'Tipo de serviço não encontrado.' });

    const { nome, descricao, valor, tempo_estimado_horas } = req.body;

    if (valor !== undefined && valor <= 0) {
      return res.status(400).json({ erro: 'O valor deve ser maior que zero.' });
    }
    if (tempo_estimado_horas !== undefined && tempo_estimado_horas <= 0) {
      return res.status(400).json({ erro: 'O tempo estimado deve ser maior que zero.' });
    }

    await tipo.update({ nome, descricao, valor, tempo_estimado_horas });
    return res.json(tipo);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao atualizar tipo de serviço.', detalhe: error.message });
  }
});

// DELETE /tipos-servico/:id — Remover tipo de serviço
router.delete('/:id', async (req, res) => {
  try {
    const tipo = await TipoServico.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ erro: 'Tipo de serviço não encontrado.' });

    await tipo.destroy();
    return res.json({ mensagem: 'Tipo de serviço removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao remover tipo de serviço.', detalhe: error.message });
  }
});

module.exports = router;
