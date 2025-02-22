const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const sequelize = require('./config/database');
const path = require('path');
require('dotenv').config();

const app = express();

// Importar rotas
const companiesRoutes = require('./routes/companies');
const customersRoutes = require('./routes/customers');
const attendantsRoutes = require('./routes/attendants');
const appointmentsRoutes = require('./routes/appointments');
const schedulesRoutes = require('./routes/schedules');
const specialtiesRoutes = require('./routes/specialties');

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

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Registrar rotas
app.use('/api/companies', companiesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/attendants', attendantsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/specialties', specialtiesRoutes);

// Rota de teste para verificar se a API está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API está funcionando!' });
});

async function startServer() {
  try {
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