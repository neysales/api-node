const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { sequelize } = require('./models');
const path = require('path');
const validarLicenca = require('./security/license');
require('dotenv').config();

const app = express();

// Importar rotas
const empresaRoutes = require('./routes/companies');
const clienteRoutes = require('./routes/customers');
const atendenteRoutes = require('./routes/attendants');
const agendamentoRoutes = require('./routes/appointments');
const especialidadeRoutes = require('./routes/specialties');
const horarioRoutes = require('./routes/schedules');
const configRoutes = require('./routes/configRoutes');

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Agendamento',
      version: '1.0.0',
      description: 'API para sistema de agendamento de empresas',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://agendaapi.agendero.com'
          : 'http://localhost:3001',
        description: process.env.NODE_ENV === 'production' ? 'Servidor de Produção' : 'Servidor Local'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      }
    }
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Configuração do CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true
}));

// Configuração do Helmet com ajustes para desenvolvimento
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Configuração do Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por windowMs
});

app.use(limiter);
app.use(express.json());

// Configurar para servir arquivos estáticos
app.use(express.static('public'));

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rota para a documentação
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/docs/index.html'));
});

// Registrar rotas
app.use('/api/empresas', empresaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/atendentes', atendenteRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/especialidades', especialidadeRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/config', configRoutes);

// Rota de teste para verificar se a API está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API está funcionando!' });
});

async function startServer() {
  try {
    // Validar licença antes de iniciar o servidor
    const licenseKey = process.env.LICENSE_KEY;
    console.log('Validando licença...');
    
    if (!licenseKey) {
      console.error("\n=== ERRO DE LICENÇA ===");
      console.error("Chave de licença não encontrada!");
      console.error("Por favor, verifique se a variável LICENSE_KEY está definida no arquivo docker-compose.yml");
      console.error("=====================================\n");
      process.exit(1);
    }

    const licencaValida = await validarLicenca(licenseKey);
    
    if (!licencaValida) {
      console.error("\n=== ERRO DE LICENÇA ===");
      console.error("A aplicação não pode ser iniciada devido a um erro de licença.");
      console.error("Por favor, verifique:");
      console.error("1. Se você inseriu a chave de licença correta no arquivo docker-compose.yml");
      console.error("2. Se sua conexão com a internet está funcionando");
      console.error("3. Se o servidor de licenças está acessível");
      console.error("\nSe o problema persistir, entre em contato com o suporte.");
      console.error("=====================================\n");
      process.exit(1);
    }

    console.log('Licença validada com sucesso!');
    console.log('Tentando conectar ao banco de dados...');
    
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();