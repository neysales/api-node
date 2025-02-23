const Config = require('../models/config');

class ConfigController {
    static async getAll(req, res) {
        try {
            const configs = await Config.getAll();
            res.json(configs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const config = await Config.getById(req.params.id);
            if (!config) {
                return res.status(404).json({ error: 'Configuração não encontrada' });
            }
            res.json(config);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const config = await Config.create(req.body);
            res.status(201).json(config);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const config = await Config.update(req.params.id, req.body);
            if (!config) {
                return res.status(404).json({ error: 'Configuração não encontrada' });
            }
            res.json(config);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const config = await Config.delete(req.params.id);
            if (!config) {
                return res.status(404).json({ error: 'Configuração não encontrada' });
            }
            res.json({ message: 'Configuração removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ConfigController;
