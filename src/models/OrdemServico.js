const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TipoServico = require('./TipoServico');

const OrdemServico = sequelize.define('OrdemServico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Dados do cliente
  nome_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Dados do veículo
  placa_veiculo: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  modelo_veiculo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ano_veiculo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Datas
  data_entrada: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  data_saida: {
    type: DataTypes.DATE,
    allowNull: true,
    // null = ordem ainda aberta
  },
  // Status
  status: {
    type: DataTypes.ENUM('aberta', 'em_andamento', 'concluida', 'cancelada'),
    defaultValue: 'aberta',
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Chave estrangeira
  tipo_servico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoServico,
      key: 'id',
    },
  },
  // Campos calculados (salvos para histórico)
  valor_cobrado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    // Preenchido automaticamente ao fechar a OS
  },
  duracao_horas: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    // Calculado ao fechar: diferença entre data_saida e data_entrada
  },
}, {
  tableName: 'ordens_servico',
  timestamps: true,
});

// Associação: OrdemServico pertence a TipoServico
OrdemServico.belongsTo(TipoServico, { foreignKey: 'tipo_servico_id', as: 'tipoServico' });
TipoServico.hasMany(OrdemServico, { foreignKey: 'tipo_servico_id', as: 'ordensServico' });

module.exports = OrdemServico;
