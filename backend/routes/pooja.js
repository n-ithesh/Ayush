const express = require('express');
const router = express.Router();
const { getAllPoojas, createPooja,deletePooja } = require('../controllers/poojaController');

router.get('/', getAllPoojas);
router.post('/', createPooja);
router.delete('/:id', deletePooja); 

module.exports = router;
