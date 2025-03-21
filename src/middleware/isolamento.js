/**
 * Data isolation middleware for multi-tenant system
 * Automatically adds company filtering to all requests
 */

const isolamentoDados = (req, res, next) => {
  // Check if company was set by apiKeyAuth middleware
  if (!req.empresa || !req.empresa.id) {
    return res.status(401).json({ 
      error: 'Unauthorized access. Company identification not found.' 
    });
  }

  // Add company filter to request object
  req.companyFilter = { company_id: req.empresa.id };
  
  // Add company ID as separate property for easier access
  req.companyId = req.empresa.id;
  
  // Debug logging (optional, can be removed in production)
  console.log(`Authorized access for Company ID: ${req.empresa.id}`);
  
  next();
};

module.exports = { isolamentoDados };
