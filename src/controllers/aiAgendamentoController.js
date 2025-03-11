const aiService = require('../services/aiService');
const axios = require('axios');

class AIAgendamentoController {
    async processarSolicitacao(req, res) {
        try {
            const { mensagem } = req.body;
            const apiKey = req.headers['x-api-key'];
            
            if (!mensagem) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'É necessário fornecer uma mensagem para processar.'
                });
            }

            // Processa a mensagem com a IA
            const resultadoIA = await aiService.processarSolicitacao(mensagem, apiKey);
            let dados;

            try {
                dados = JSON.parse(resultadoIA);
            } catch (error) {
                return res.status(500).json({
                    sucesso: false,
                    mensagem: 'Erro ao interpretar a resposta da IA',
                    erro: error.message
                });
            }

            // Se a IA retornou um erro, repasse-o
            if (!dados.sucesso && dados.mensagem) {
                return res.status(400).json(dados);
            }

            // Processa a ação baseado no resultado da IA
            const resultado = await this.executarAcao(dados, apiKey);

            return res.json(resultado);
        } catch (error) {
            console.error('Erro ao processar solicitação:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao processar a solicitação',
                erro: error.message
            });
        }
    }

    async executarAcao(dados, apiKey) {
        const baseURL = process.env.API_BASE_URL || 'http://localhost:3002';
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        };

        try {
            switch (dados.acao) {
                case 'agendar':
                    return await this.criarAgendamento(dados, baseURL, config);
                case 'cancelar':
                    return await this.cancelarAgendamento(dados, baseURL, config);
                case 'alterar':
                    return await this.alterarAgendamento(dados, baseURL, config);
                case 'listar':
                    return await this.listarAgendamentos(dados, baseURL, config);
                default:
                    throw new Error('Ação não reconhecida');
            }
        } catch (error) {
            throw new Error(`Erro ao executar ação: ${error.message}`);
        }
    }

    async criarAgendamento(dados, baseURL, config) {
        try {
            // Primeiro, verifica se o cliente existe ou precisa ser criado
            let cliente = await this.buscarOuCriarCliente(dados, baseURL, config);
            
            // Depois, busca o atendente
            const atendente = await this.buscarAtendente(dados.nome_atendente, baseURL, config);
            
            // Cria o agendamento
            const agendamentoData = {
                clienteId: cliente.id,
                atendenteId: atendente.id,
                data: dados.data,
                hora: dados.hora
            };

            const response = await axios.post(`${baseURL}/api/agendamentos`, agendamentoData, config);
            
            return {
                sucesso: true,
                mensagem: 'Agendamento criado com sucesso',
                dados: response.data
            };
        } catch (error) {
            throw new Error(`Erro ao criar agendamento: ${error.message}`);
        }
    }

    async cancelarAgendamento(dados, baseURL, config) {
        try {
            // Busca o agendamento pelo cliente e data
            const agendamentos = await axios.get(`${baseURL}/api/agendamentos`, {
                ...config,
                params: {
                    email_cliente: dados.email_cliente,
                    data: dados.data
                }
            });

            if (!agendamentos.data || agendamentos.data.length === 0) {
                throw new Error('Agendamento não encontrado');
            }

            // Cancela o agendamento
            await axios.delete(`${baseURL}/api/agendamentos/${agendamentos.data[0].id}`, config);

            return {
                sucesso: true,
                mensagem: 'Agendamento cancelado com sucesso'
            };
        } catch (error) {
            throw new Error(`Erro ao cancelar agendamento: ${error.message}`);
        }
    }

    async alterarAgendamento(dados, baseURL, config) {
        try {
            // Busca o agendamento existente
            const agendamentos = await axios.get(`${baseURL}/api/agendamentos`, {
                ...config,
                params: {
                    email_cliente: dados.email_cliente,
                    data: dados.data
                }
            });

            if (!agendamentos.data || agendamentos.data.length === 0) {
                throw new Error('Agendamento não encontrado');
            }

            const agendamentoAtual = agendamentos.data[0];
            
            // Prepara os dados para atualização
            const dadosAtualizacao = {
                ...agendamentoAtual,
                data: dados.data,
                hora: dados.hora
            };

            // Se foi especificado um novo atendente, atualiza
            if (dados.nome_atendente) {
                const atendente = await this.buscarAtendente(dados.nome_atendente, baseURL, config);
                dadosAtualizacao.atendenteId = atendente.id;
            }

            // Atualiza o agendamento
            const response = await axios.put(
                `${baseURL}/api/agendamentos/${agendamentoAtual.id}`,
                dadosAtualizacao,
                config
            );

            return {
                sucesso: true,
                mensagem: 'Agendamento atualizado com sucesso',
                dados: response.data
            };
        } catch (error) {
            throw new Error(`Erro ao alterar agendamento: ${error.message}`);
        }
    }

    async listarAgendamentos(dados, baseURL, config) {
        try {
            const params = {};
            
            if (dados.email_cliente) {
                params.email_cliente = dados.email_cliente;
            }
            if (dados.data) {
                params.data = dados.data;
            }

            const response = await axios.get(`${baseURL}/api/agendamentos`, {
                ...config,
                params
            });

            return {
                sucesso: true,
                mensagem: 'Agendamentos encontrados',
                dados: response.data
            };
        } catch (error) {
            throw new Error(`Erro ao listar agendamentos: ${error.message}`);
        }
    }

    async buscarOuCriarCliente(dados, baseURL, config) {
        try {
            // Tenta buscar o cliente pelo email
            const clientesResponse = await axios.get(`${baseURL}/api/clientes`, {
                ...config,
                params: { email: dados.email_cliente }
            });

            if (clientesResponse.data && clientesResponse.data.length > 0) {
                return clientesResponse.data[0];
            }

            // Se não encontrou, cria um novo cliente
            const novoCliente = {
                nome: dados.nome_cliente,
                email: dados.email_cliente
            };

            const response = await axios.post(`${baseURL}/api/clientes`, novoCliente, config);
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao buscar/criar cliente: ${error.message}`);
        }
    }

    async buscarAtendente(nomeAtendente, baseURL, config) {
        try {
            const response = await axios.get(`${baseURL}/api/atendentes`, {
                ...config,
                params: { nome: nomeAtendente }
            });

            if (!response.data || response.data.length === 0) {
                throw new Error(`Atendente ${nomeAtendente} não encontrado`);
            }

            return response.data[0];
        } catch (error) {
            throw new Error(`Erro ao buscar atendente: ${error.message}`);
        }
    }
}

module.exports = new AIAgendamentoController();
