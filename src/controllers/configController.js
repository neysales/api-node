const { Config, Company } = require('../models');
const { v4: uuidv4 } = require('uuid');

const getConfig = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { api_key: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const config = await Config.findOne({
      where: { company_id: empresa.id }
    });

    if (!config) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    return res.json(config);
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createConfig = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { api_key: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    // Verificar se já existe configuração
    const configExistente = await Config.findOne({
      where: { company_id: empresa.id }
    });

    if (configExistente) {
      return res.status(400).json({ error: 'Configuração já existe para esta empresa' });
    }

    const novaConfig = await Config.create({
      id: uuidv4(),
      company_id: empresa.id,
      logo_url: req.body.logo_url,
      evolution_url: req.body.evolution_url,
      evolution_key: req.body.evolution_key,
      evolution_instance: req.body.evolution_instance,
      minio_bucket: req.body.minio_bucket,
      minio_port: req.body.minio_port,
      minio_access_key: req.body.minio_access_key,
      minio_secret_key: req.body.minio_secret_key,
      minio_endpoint: req.body.minio_endpoint,
      email: req.body.email,
      email_password: req.body.email_password,
      email_smtp: req.body.email_smtp,
      email_port: req.body.email_port,
      email_text_scheduled: req.body.email_text_scheduled,
      email_text_canceled: req.body.email_text_canceled,
      email_text_confirmed: req.body.email_text_confirmed,
      email_text_rejected: req.body.email_text_rejected,
      ai_provider: req.body.ai_provider || 'openai',
      ai_api_key: req.body.ai_api_key,
      ai_model: req.body.ai_model || 'gpt-3.5-turbo',
      registration_date: new Date()
    });

    return res.status(201).json(novaConfig);
  } catch (error) {
    console.error('Erro ao criar configuração:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateConfig = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { api_key: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const config = await Config.findOne({
      where: { company_id: empresa.id }
    });

    if (!config) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    await config.update({
      logo_url: req.body.logo_url || config.logo_url,
      evolution_url: req.body.evolution_url || config.evolution_url,
      evolution_key: req.body.evolution_key || config.evolution_key,
      evolution_instance: req.body.evolution_instance || config.evolution_instance,
      minio_bucket: req.body.minio_bucket || config.minio_bucket,
      minio_port: req.body.minio_port || config.minio_port,
      minio_access_key: req.body.minio_access_key || config.minio_access_key,
      minio_secret_key: req.body.minio_secret_key || config.minio_secret_key,
      minio_endpoint: req.body.minio_endpoint || config.minio_endpoint,
      email: req.body.email || config.email,
      email_password: req.body.email_password || config.email_password,
      email_smtp: req.body.email_smtp || config.email_smtp,
      email_port: req.body.email_port || config.email_port,
      email_text_scheduled: req.body.email_text_scheduled || config.email_text_scheduled,
      email_text_canceled: req.body.email_text_canceled || config.email_text_canceled,
      email_text_confirmed: req.body.email_text_confirmed || config.email_text_confirmed,
      email_text_rejected: req.body.email_text_rejected || config.email_text_rejected,
      ai_provider: req.body.ai_provider || config.ai_provider,
      ai_api_key: req.body.ai_api_key || config.ai_api_key,
      ai_model: req.body.ai_model || config.ai_model
    });

    return res.json(config);
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteConfig = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { api_key: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const config = await Config.findOne({
      where: { company_id: empresa.id }
    });

    if (!config) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    await config.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir configuração:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getConfig,
  createConfig,
  updateConfig,
  deleteConfig
};
