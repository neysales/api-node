const express = require('express');
const router = express.Router();
const { Company } = require('../models');

/**
 * Route to check if any company exists in the system
 */
router.get('/', async (req, res) => {
  try {
    console.log('Checking for active companies...');
    
    const company = await Company.findOne({
      where: { 
        active: true 
      },
      attributes: ['id', 'name', 'api_key']
    });

    const companyExists = !!company;
    console.log('Check result:', companyExists ? 'Company found' : 'No company found');
    
    res.json({
      exists: companyExists,
      apiKey: companyExists ? company.api_key : null,
      name: companyExists ? company.name : null
    });
  } catch (error) {
    console.error('Error checking companies:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Error checking companies: ' + error.message });
  }
});

module.exports = router;
