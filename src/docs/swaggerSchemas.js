/**
 * Definições de esquemas Swagger para a API Agendero
 * Este arquivo contém as definições dos modelos de dados para documentação da API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *         - api_key
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da empresa
 *         name:
 *           type: string
 *           description: Nome da empresa
 *         api_key:
 *           type: string
 *           description: Chave de API única para autenticação
 *         active:
 *           type: boolean
 *           description: Status de ativação da empresa
 *         registration_date:
 *           type: string
 *           format: date-time
 *           description: Data de registro da empresa
 *         email:
 *           type: string
 *           description: Email de contato da empresa
 *         phone:
 *           type: string
 *           description: Telefone de contato da empresa
 *         address:
 *           type: string
 *           description: Endereço da empresa
 *         logo_url:
 *           type: string
 *           description: URL do logotipo da empresa
 *         website:
 *           type: string
 *           description: Site da empresa
 *         business_hours:
 *           type: string
 *           description: Horário de funcionamento
 *
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - phone_mobile
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do cliente
 *         name:
 *           type: string
 *           description: Nome completo do cliente
 *         cpf_cnpj:
 *           type: string
 *           description: CPF ou CNPJ do cliente
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Data de nascimento do cliente
 *         phone_mobile:
 *           type: string
 *           description: Telefone celular do cliente
 *         email:
 *           type: string
 *           description: Email do cliente
 *         address_street:
 *           type: string
 *           description: Rua do endereço
 *         address_city:
 *           type: string
 *           description: Cidade do endereço
 *         address_state:
 *           type: string
 *           description: Estado do endereço
 *         address_neighborhood:
 *           type: string
 *           description: Bairro do endereço
 *         address_zip:
 *           type: string
 *           description: CEP do endereço
 *         address_country:
 *           type: string
 *           description: País do endereço
 *         address_complement:
 *           type: string
 *           description: Complemento do endereço
 *         address_number:
 *           type: string
 *           description: Número do endereço
 *         notes:
 *           type: string
 *           description: Observações sobre o cliente
 *         password:
 *           type: string
 *           description: Senha do cliente (para acesso ao sistema)
 *         active:
 *           type: boolean
 *           description: Status de ativação do cliente
 *         registration_date:
 *           type: string
 *           format: date-time
 *           description: Data de registro do cliente
 *
 *     Attendant:
 *       type: object
 *       required:
 *         - name
 *         - company_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do atendente
 *         name:
 *           type: string
 *           description: Nome do atendente
 *         company_id:
 *           type: string
 *           format: uuid
 *           description: ID da empresa à qual o atendente pertence
 *         email:
 *           type: string
 *           description: Email do atendente
 *         phone:
 *           type: string
 *           description: Telefone do atendente
 *         active:
 *           type: boolean
 *           description: Status de ativação do atendente
 *         registration_date:
 *           type: string
 *           format: date-time
 *           description: Data de registro do atendente
 *         color:
 *           type: string
 *           description: Cor para identificação do atendente no calendário
 *
 *     Specialty:
 *       type: object
 *       required:
 *         - name
 *         - company_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da especialidade
 *         name:
 *           type: string
 *           description: Nome da especialidade
 *         company_id:
 *           type: string
 *           format: uuid
 *           description: ID da empresa à qual a especialidade pertence
 *         description:
 *           type: string
 *           description: Descrição da especialidade
 *         duration:
 *           type: integer
 *           description: Duração em minutos do serviço
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do serviço
 *         active:
 *           type: boolean
 *           description: Status de ativação da especialidade
 *         registration_date:
 *           type: string
 *           format: date-time
 *           description: Data de registro da especialidade
 *
 *     Appointment:
 *       type: object
 *       required:
 *         - client_id
 *         - attendant_id
 *         - company_id
 *         - appointment_date
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do agendamento
 *         client_id:
 *           type: string
 *           format: uuid
 *           description: ID do cliente
 *         attendant_id:
 *           type: string
 *           format: uuid
 *           description: ID do atendente
 *         company_id:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 *         appointment_date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         service_performed:
 *           type: boolean
 *           description: Indica se o serviço foi realizado
 *         notes:
 *           type: string
 *           description: Observações sobre o agendamento
 *         status:
 *           type: string
 *           enum: [scheduled, confirmed, canceled, completed, rejected]
 *           description: Status do agendamento
 *         registration_date:
 *           type: string
 *           format: date-time
 *           description: Data de registro do agendamento
 *
 *     Schedule:
 *       type: object
 *       required:
 *         - attendant_id
 *         - day_of_week
 *         - start_time
 *         - end_time
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do horário
 *         attendant_id:
 *           type: string
 *           format: uuid
 *           description: ID do atendente
 *         day_of_week:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *           description: Dia da semana (0 = Domingo, 6 = Sábado)
 *         start_time:
 *           type: string
 *           format: time
 *           description: Hora de início do expediente
 *         end_time:
 *           type: string
 *           format: time
 *           description: Hora de término do expediente
 *         active:
 *           type: boolean
 *           description: Status de ativação do horário
 *
 *     Config:
 *       type: object
 *       required:
 *         - company_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da configuração
 *         company_id:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 *         theme_color:
 *           type: string
 *           description: Cor do tema da empresa
 *         logo_url:
 *           type: string
 *           description: URL do logotipo da empresa
 *         allow_client_registration:
 *           type: boolean
 *           description: Permite registro de clientes pelo site
 *         send_email_notifications:
 *           type: boolean
 *           description: Envia notificações por email
 *         send_sms_notifications:
 *           type: boolean
 *           description: Envia notificações por SMS
 *         ai_provider:
 *           type: string
 *           enum: [openai, anthropic, google]
 *           description: Provedor de IA
 *         ai_api_key:
 *           type: string
 *           description: Chave de API do provedor de IA
 *         ai_model:
 *           type: string
 *           description: Modelo específico de IA a ser usado
 *         ai_temperature:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           description: Temperatura para controle de criatividade da IA
 *         ai_prompt:
 *           type: string
 *           description: Prompt personalizado para processamento de agendamentos
 *
 *     AIConfig:
 *       type: object
 *       properties:
 *         provider:
 *           type: string
 *           enum: [openai, anthropic, google]
 *           description: Provedor de IA
 *         apiKey:
 *           type: string
 *           description: Chave de API do provedor de IA (mascarada por segurança)
 *         model:
 *           type: string
 *           description: Modelo específico de IA a ser usado
 *         temperature:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           description: Temperatura para controle de criatividade da IA
 *         prompt:
 *           type: string
 *           description: Prompt personalizado para processamento de agendamentos
 */

module.exports = {};
