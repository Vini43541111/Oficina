const express = require('express');
const sequelize = require('./config/database');

// Importa os models para garantir que as associações sejam registradas
require('./models/TipoServico');
require('./models/OrdemServico');

const tipoServicoRoutes = require('./routes/tipoServico.routes');
const ordemServicoRoutes = require('./routes/ordemServico.routes');

const app = express();
app.use(express.json());

// Rotas
app.use('/tipos-servico', tipoServicoRoutes);
app.use('/ordens-servico', ordemServicoRoutes);

// Rota raiz — confirmação que API está no ar
app.get('/', (req, res) => {
  res.json({ mensagem: 'API Oficina funcionando!', rotas: ['/tipos-servico', '/ordens-servico'] });
});

const PORT = process.env.PORT || 3000;

// Sincroniza o banco e sobe o servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados sincronizado!');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco:', err.message);
  });
