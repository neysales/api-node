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
        // Validar o formato e checksum da chave primeiro
        if (!chave) {
            console.error("Erro: Chave de licença não fornecida");
            return false;
        }

        if (!validarChaveLicenca(chave)) {
            console.error("Erro: Chave de licença inválida (formato ou checksum inválido)");
            return false;
        }

        // Obter o endereço MAC
        const interfaces = os.networkInterfaces();
        const mac = Object.values(interfaces)
            .flat()
            .find((iface) => iface && iface.mac && iface.mac !== "00:00:00:00:00:00")?.mac;

        if (!mac) {
            console.error("Erro: Não foi possível obter o endereço MAC da máquina");
            return false;
        }

        // Configuração do axios com timeout
        const instance = axios.create({
            timeout: 10000, // 10 segundos
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Fazer a requisição para validar a licença
        const { data } = await instance.post("https://licenca.agenderocom/api/validar-licenca", { 
            chave, 
            mac 
        });

        console.log("Licença validada com sucesso:", data);
        return true;
    } catch (error) {
        // Lista de códigos de erro que indicam problemas de conexão
        const connectionErrors = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNABORTED'];
        
        if (connectionErrors.includes(error.code)) {
            console.warn("Aviso: Não foi possível validar a licença devido a problemas de conexão com o servidor. A aplicação continuará funcionando.");
            return true;
        } else {
            console.error("Erro ao validar licença:", error.response?.data || error.message);
            return false;
        }
    }
}

module.exports = validarLicenca;
