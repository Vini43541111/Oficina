const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoServico = sequelize.define('TipoServico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    // Ex: "Revisão completa", "Troca de óleo", "Manutenção elétrica"
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    // Valor em reais do serviço
  },
  tempo_estimado_horas: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    // Tempo estimado de execução em horas
  },
}, {
  tableName: 'tipos_servico',
  timestamps: true,
});

module.exports = TipoServico;
