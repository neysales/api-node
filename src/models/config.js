const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const pool = new Pool();

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

    static async create(configData) {
        const id = uuidv4();
        const query = `
            INSERT INTO config (
                id, logo_url, evolution_url, evolution_key, evolution_instancia,
                minio_bucket, minio_port, minio_access_key, minio_secret_key,
                minio_endpoint, email, email_senha, email_smtp, email_porta,
                email_texto_agendado, email_texto_cancelado,
                email_texto_confirmado, email_texto_recusado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING *
        `;
        
        const values = [
            id,
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
            configData.email_texto_recusado
        ];

        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async update(id, configData) {
        const query = `
            UPDATE config SET
                logo_url = $2,
                evolution_url = $3,
                evolution_key = $4,
                evolution_instancia = $5,
                minio_bucket = $6,
                minio_port = $7,
                minio_access_key = $8,
                minio_secret_key = $9,
                minio_endpoint = $10,
                email = $11,
                email_senha = $12,
                email_smtp = $13,
                email_porta = $14,
                email_texto_agendado = $15,
                email_texto_cancelado = $16,
                email_texto_confirmado = $17,
                email_texto_recusado = $18
            WHERE id = $1
            RETURNING *
        `;

        const values = [
            id,
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
            configData.email_texto_recusado
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
