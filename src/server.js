const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { sequelize } = require('./models');
const path = require('path');
const validateLicense = require('./security/license');
require('dotenv').config();

const app = express();

// Import routes
const companyRoutes = require('./routes/empresaRoutes');
const clientRoutes = require('./routes/clienteRoutes');
const attendantRoutes = require('./routes/atendenteRoutes');
const appointmentRoutes = require('./routes/agendamentoRoutes');
const specialtyRoutes = require('./routes/especialidadeRoutes');
const scheduleRoutes = require('./routes/horarioRoutes');
const configRoutes = require('./routes/configRoutes');
const aiAppointmentRoutes = require('./routes/aiAgendamentoRoutes');
const companyCheckRoutes = require('./routes/company-check');
const aiConfigRoutes = require('./routes/aiConfigRoutes');

// Import middlewares
const { apiKeyAuth } = require('./middleware/auth');
const { isolamentoDados } = require('./middleware/isolamento');

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Agendero',
      version: '1.0.0',
      description: 'API para sistema de agendamento com arquitetura multi-tenant',
      contact: {
        name: 'Suporte Agendero',
        email: 'suporte@agendero.com.br',
      },
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://api.agendero.com.br',
        description: 'Servidor de Produção',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'Chave de API específica para cada empresa',
        },
      },
      schemas: require('./docs/swaggerSchemas'),
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    tags: [
      {
        name: 'Companies',
        description: 'Operações relacionadas a empresas',
      },
      {
        name: 'Clients',
        description: 'Operações relacionadas a clientes',
      },
      {
        name: 'Attendants',
        description: 'Operações relacionadas a atendentes',
      },
      {
        name: 'Specialties',
        description: 'Operações relacionadas a especialidades',
      },
      {
        name: 'Schedules',
        description: 'Operações relacionadas a horários',
      },
      {
        name: 'Appointments',
        description: 'Operações relacionadas a agendamentos',
      },
      {
        name: 'Config',
        description: 'Operações relacionadas a configurações',
      },
      {
        name: 'AI',
        description: 'Operações relacionadas a inteligência artificial',
      },
    ],
  },
  apis: [
    path.join(__dirname, 'routes', '*.js'),
    path.join(__dirname, 'docs', 'swaggerSchemas.js')
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true
}));

// Helmet Configuration
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Rate Limit Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit of 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());
app.use(express.static('public'));

// Swagger UI Configuration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Documentation route
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/docs/index.html'));
});

// Register routes
// Public routes (no authentication required)
app.use('/api/companies/check', companyCheckRoutes);
app.use('/api/company-check', companyCheckRoutes);

// Protected routes (require authentication and data isolation)
app.use('/api/companies', apiKeyAuth, isolamentoDados, companyRoutes);
app.use('/api/clients', apiKeyAuth, isolamentoDados, clientRoutes);
app.use('/api/attendants', apiKeyAuth, isolamentoDados, attendantRoutes);
app.use('/api/appointments', apiKeyAuth, isolamentoDados, appointmentRoutes);
app.use('/api/specialties', apiKeyAuth, isolamentoDados, specialtyRoutes);
app.use('/api/schedules', apiKeyAuth, isolamentoDados, scheduleRoutes);
app.use('/api/config', apiKeyAuth, isolamentoDados, configRoutes);
app.use('/api/ai/appointments', apiKeyAuth, isolamentoDados, aiAppointmentRoutes);
app.use('/api/ai/config', apiKeyAuth, isolamentoDados, aiConfigRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running!' });
});

async function startServer() {
  try {
    // Validate license before starting the server
    const licenseKey = process.env.LICENSE_KEY;
    console.log('Validating license...');
    
    if (!licenseKey) {
      console.error("\n=== LICENSE ERROR ===");
      console.error("License key not found!");
      console.error("Please check if LICENSE_KEY is defined in docker-compose.yml");
      console.error("=====================================\n");
      process.exit(1);
    }

    const isLicenseValid = await validateLicense(licenseKey);
    
    if (!isLicenseValid) {
      console.error("\n=== LICENSE ERROR ===");
      console.error("The application cannot start due to a license error.");
      console.error("Please check:");
      console.error("1. If you entered the correct license key in docker-compose.yml");
      console.error("2. If your internet connection is working");
      console.error("3. If the license server is accessible");
      console.error("\nIf the problem persists, contact support.");
      console.error("=====================================\n");
      process.exit(1);
    }

    console.log('License validated successfully!');
    console.log('Attempting to connect to database...');
    
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();