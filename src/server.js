const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

require('./models/TipoServico');
require('./models/OrdemServico');

const tipoServicoRoutes = require('./routes/tipoServico.routes');
const ordemServicoRoutes = require('./routes/ordemServico.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tipos-servico', tipoServicoRoutes);
app.use('/ordens-servico', ordemServicoRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API Oficina funcionando!', rotas: ['/tipos-servico', '/ordens-servico'] });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados sincronizado!');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco:', err.message);
  });
