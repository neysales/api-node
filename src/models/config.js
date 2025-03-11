const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dbConfig = require('../config/database');

// Obter configurações do ambiente atual
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Criar pool de conexão com as configurações corretas
const pool = new Pool({
    host: config.host,
    database: config.database,
    user: config.username,
    password: config.password,
    port: config.port
});

class Config {
    static async getAll() {
        const query = 'SELECT * FROM config';
        const { rows } = await pool.query(query);
        return rows;
    }

    static async getById(id) {
        const query = 'SELECT * FROM config WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    static async getByEmpresaId(empresaId) {
        const query = 'SELECT * FROM config WHERE empresa_id = $1';
        const { rows } = await pool.query(query, [empresaId]);
        return rows[0];
    }

    static async create(configData) {
        const id = uuidv4();
        const query = `
            INSERT INTO config (
                id, empresa_id, logo_url, evolution_url, evolution_key, evolution_instancia,
                minio_bucket, minio_port, minio_access_key, minio_secret_key,
                minio_endpoint, email, email_senha, email_smtp, email_porta,
                email_texto_agendado, email_texto_cancelado,
                email_texto_confirmado, email_texto_recusado, 
                ai_provider, ai_api_key, ai_model,
                data_cadastro
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const values = [
            id,
            configData.empresa_id,
            configData.logo_url,
            configData.evolution_url,
            configData.evolution_key,
            configData.evolution_instancia,
            configData.minio_bucket,
            configData.minio_port,
            configData.minio_access_key,
            configData.minio_secret_key,
            configData.minio_endpoint,
            configData.email,
            configData.email_senha,
            configData.email_smtp,
            configData.email_porta,
            configData.email_texto_agendado,
            configData.email_texto_cancelado,
            configData.email_texto_confirmado,
            configData.email_texto_recusado,
            configData.ai_provider || 'openai',
            configData.ai_api_key,
            configData.ai_model || 'gpt-3.5-turbo'
        ];

        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async update(id, configData) {
        const query = `
            UPDATE config
            SET logo_url = $1,
                evolution_url = $2,
                evolution_key = $3,
                evolution_instancia = $4,
                minio_bucket = $5,
                minio_port = $6,
                minio_access_key = $7,
                minio_secret_key = $8,
                minio_endpoint = $9,
                email = $10,
                email_senha = $11,
                email_smtp = $12,
                email_porta = $13,
                email_texto_agendado = $14,
                email_texto_cancelado = $15,
                email_texto_confirmado = $16,
                email_texto_recusado = $17,
                ai_provider = $18,
                ai_api_key = $19,
                ai_model = $20
            WHERE id = $21
            RETURNING *
        `;

        const values = [
            configData.logo_url,
            configData.evolution_url,
            configData.evolution_key,
            configData.evolution_instancia,
            configData.minio_bucket,
            configData.minio_port,
            configData.minio_access_key,
            configData.minio_secret_key,
            configData.minio_endpoint,
            configData.email,
            configData.email_senha,
            configData.email_smtp,
            configData.email_porta,
            configData.email_texto_agendado,
            configData.email_texto_cancelado,
            configData.email_texto_confirmado,
            configData.email_texto_recusado,
            configData.ai_provider,
            configData.ai_api_key,
            configData.ai_model,
            id
        ];

        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM config WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = Config;
