const aiService = require('../services/aiService');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

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

            if (!dados.sucesso && dados.mensagem) {
                return res.status(400).json(dados);
            }

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

    async sugerirAgendamento(req, res) {
        try {
            const { cliente, preferencias } = req.body;
            const apiKey = req.headers['x-api-key'];
            
            if (!cliente || !preferencias) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'É necessário fornecer dados do cliente e preferências para sugerir um agendamento.'
                });
            }

            // Buscar horários disponíveis
            const baseURL = process.env.API_BASE_URL || 'http://localhost:3002';
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                }
            };

            // Buscar atendentes disponíveis
            const atendentesResponse = await axios.get(`${baseURL}/api/attendants`, config);
            
            if (!atendentesResponse.data || atendentesResponse.data.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Não há atendentes disponíveis para sugerir agendamentos.'
                });
            }

            // Buscar horários disponíveis para os próximos 7 dias
            const hoje = new Date();
            const sugestoes = [];
            
            for (let i = 0; i < 7; i++) {
                const data = new Date(hoje);
                data.setDate(data.getDate() + i);
                
                const dataFormatada = data.toISOString().split('T')[0];
                
                for (const atendente of atendentesResponse.data) {
                    // Buscar horários do atendente
                    const horariosResponse = await axios.get(`${baseURL}/api/schedules`, {
                        ...config,
                        params: { attendant_id: atendente.id }
                    });
                    
                    if (horariosResponse.data && horariosResponse.data.length > 0) {
                        // Verificar agendamentos existentes para o dia
                        const agendamentosResponse = await axios.get(`${baseURL}/api/appointments`, {
                            ...config,
                            params: { 
                                attendant_id: atendente.id,
                                date: dataFormatada
                            }
                        });
                        
                        const horariosOcupados = agendamentosResponse.data.map(a => 
                            new Date(a.appointment_date).getHours()
                        );
                        
                        // Para cada horário de trabalho, verificar se está disponível
                        for (const horario of horariosResponse.data) {
                            const inicio = parseInt(horario.start_time.split(':')[0]);
                            const fim = parseInt(horario.end_time.split(':')[0]);
                            
                            for (let hora = inicio; hora < fim; hora++) {
                                if (!horariosOcupados.includes(hora)) {
                                    sugestoes.push({
                                        data: dataFormatada,
                                        hora: `${hora}:00`,
                                        atendente: {
                                            id: atendente.id,
                                            nome: atendente.name
                                        }
                                    });
                                    
                                    // Limitar a 5 sugestões
                                    if (sugestoes.length >= 5) break;
                                }
                            }
                            
                            if (sugestoes.length >= 5) break;
                        }
                    }
                    
                    if (sugestoes.length >= 5) break;
                }
                
                if (sugestoes.length >= 5) break;
            }
            
            return res.json({
                sucesso: true,
                mensagem: 'Sugestões de agendamento geradas com sucesso',
                sugestoes
            });
        } catch (error) {
            console.error('Erro ao sugerir agendamento:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao gerar sugestões de agendamento',
                erro: error.message
            });
        }
    }

    async validarSolicitacao(req, res) {
        try {
            const { mensagem } = req.body;
            const apiKey = req.headers['x-api-key'];
            
            if (!mensagem) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'É necessário fornecer uma mensagem para validar.'
                });
            }

            const resultadoIA = await aiService.validarSolicitacao(mensagem, apiKey);
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

            return res.json(dados);
        } catch (error) {
            console.error('Erro ao validar solicitação:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao validar a solicitação',
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
            let cliente = await this.buscarOuCriarCliente(dados, baseURL, config);
            const atendente = await this.buscarAtendente(dados.nome_atendente, baseURL, config);
            
            const agendamentoData = {
                id: uuidv4(),
                client_id: cliente.id,
                company_id: config.headers['x-api-key'],
                attendant_id: atendente.id,
                appointment_date: `${dados.data} ${dados.hora}`,
                service_performed: false,
                notes: dados.observacoes || null,
                status: 'scheduled',
                registration_date: new Date()
            };

            const response = await axios.post(`${baseURL}/api/appointments`, agendamentoData, config);
            
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
            const agendamentos = await axios.get(`${baseURL}/api/appointments`, {
                ...config,
                params: {
                    client_email: dados.email_cliente,
                    appointment_date: dados.data
                }
            });

            if (!agendamentos.data || agendamentos.data.length === 0) {
                throw new Error('Agendamento não encontrado');
            }

            await axios.delete(`${baseURL}/api/appointments/${agendamentos.data[0].id}`, config);

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
            const agendamentos = await axios.get(`${baseURL}/api/appointments`, {
                ...config,
                params: {
                    client_email: dados.email_cliente,
                    appointment_date: dados.data
                }
            });

            if (!agendamentos.data || agendamentos.data.length === 0) {
                throw new Error('Agendamento não encontrado');
            }

            const agendamentoAtual = agendamentos.data[0];
            
            const dadosAtualizacao = {
                ...agendamentoAtual,
                appointment_date: `${dados.data} ${dados.hora}`,
                notes: dados.observacoes || agendamentoAtual.notes
            };

            if (dados.nome_atendente) {
                const atendente = await this.buscarAtendente(dados.nome_atendente, baseURL, config);
                dadosAtualizacao.attendant_id = atendente.id;
            }

            const response = await axios.put(
                `${baseURL}/api/appointments/${agendamentoAtual.id}`,
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
                params.client_email = dados.email_cliente;
            }
            if (dados.data) {
                params.appointment_date = dados.data;
            }

            const response = await axios.get(`${baseURL}/api/appointments`, {
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
            const clientesResponse = await axios.get(`${baseURL}/api/clients`, {
                ...config,
                params: { email: dados.email_cliente }
            });

            if (clientesResponse.data && clientesResponse.data.length > 0) {
                return clientesResponse.data[0];
            }

            const novoCliente = {
                id: uuidv4(),
                name: dados.nome_cliente,
                email: dados.email_cliente,
                phone_mobile: dados.telefone || '',
                active: true,
                registration_date: new Date()
            };

            const response = await axios.post(`${baseURL}/api/clients`, novoCliente, config);
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao buscar/criar cliente: ${error.message}`);
        }
    }

    async buscarAtendente(nomeAtendente, baseURL, config) {
        try {
            const response = await axios.get(`${baseURL}/api/attendants`, {
                ...config,
                params: { name: nomeAtendente }
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
