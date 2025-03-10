const os = require("os");
const axios = require("axios");

function gerarChecksum(dados) {
    return dados.split('')
        .reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
        .toString(16)
        .slice(-8)
        .toUpperCase();
}

function validarChaveLicenca(chave) {
    try {
        // Verificar formato básico
        const partes = chave.split('-');
        if (partes.length !== 4) return false;
        
        const [prefixo, timestamp, dados, checksumRecebido] = partes;
        
        // Verificar prefixo
        if (prefixo !== 'AGD') return false;
        
        // Verificar checksum
        const baseChave = `${prefixo}-${timestamp}-${dados}`;
        const checksumCalculado = gerarChecksum(baseChave);
        
        return checksumRecebido === checksumCalculado;
    } catch (error) {
        return false;
    }
}

async function validarLicenca(chave) {
    try {
        console.log("Validando licença...");
        
        // Validar o formato e checksum da chave primeiro
        if (!chave) {
            console.error("Erro: Chave de licença não fornecida");
            return false;
        }

        if (!validarChaveLicenca(chave)) {
            console.error("Erro: Chave de licença inválida (formato ou checksum inválido)");
            return false;
        }

        // No modelo multi-tenant, validamos apenas o formato da licença localmente
        // e permitimos que o servidor inicie, mesmo sem validação online
        
        try {
            // Obter o endereço MAC
            const interfaces = os.networkInterfaces();
            const mac = Object.values(interfaces)
                .flat()
                .find((iface) => iface && iface.mac && iface.mac !== "00:00:00:00:00:00")?.mac;

            if (mac) {
                // Configuração do axios com timeout
                const instance = axios.create({
                    timeout: 5000, // 5 segundos
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Tentativa de validação online (não bloqueia o início do servidor)
                instance.post("https://licenca.agendero.com/validar-licenca", { 
                    chave, 
                    mac 
                }).catch(error => {
                    // Apenas log, não impede o funcionamento
                    console.warn("Aviso: Não foi possível validar a licença online. A aplicação continuará funcionando.");
                });
            }
        } catch (error) {
            // Ignorar erros de validação online
            console.warn("Aviso: Erro na validação online da licença. A aplicação continuará funcionando.");
        }
        
        console.log("Licença validada com sucesso!");
        return true;
    } catch (error) {
        console.error("Erro ao validar licença:", error.message);
        // No modelo multi-tenant, permitimos que o servidor continue mesmo com erros
        console.warn("Aviso: Continuando sem validação completa da licença.");
        return true;
    }
}

module.exports = validarLicenca;
