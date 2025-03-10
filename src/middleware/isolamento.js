/**
 * Middleware para isolamento de dados em um sistema multi-tenant
 * Adiciona automaticamente o filtro de empresa_id em todas as requisições
 */

const isolamentoDados = (req, res, next) => {
  // Verifica se a empresa foi definida pelo middleware apiKeyAuth
  if (!req.company || !req.company.id) {
    return res.status(401).json({ 
      error: 'Acesso não autorizado. Identificação da empresa não encontrada.' 
    });
  }

  // Adiciona o filtro de empresa ao objeto de requisição
  req.filtroEmpresa = { empresa_id: req.company.id };
  
  // Adiciona o ID da empresa como propriedade separada para facilitar o acesso
  req.empresaId = req.company.id;
  
  // Log para depuração (opcional, pode ser removido em produção)
  console.log(`Acesso autorizado para empresa ID: ${req.company.id}`);
  
  next();
};

module.exports = { isolamentoDados };
