const express = require('express');
const router = express.Router();
const { Company } = require('../../models');

/**
 * Route to check for active companies
 * This route doesn't require authentication as it's used to check if any companies exist
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
    
    if (!company) {
      console.log('No active companies found');
      return res.status(404).json({ 
        success: false, 
        message: 'No active companies found' 
      });
    }
    
    console.log('Active company found:', company.id);
    
    res.json({ 
      success: true, 
      message: 'Active company found',
      company: {
        id: company.id,
        name: company.name,
        apiKey: company.api_key
      }
    });
  } catch (error) {
    console.error('Error checking companies:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error checking companies: ' + error.message 
    });
  }
});

module.exports = router;