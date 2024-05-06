const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve the index.html file
router.get('^/$|/index(.html)?', (req, res) => {
    // Send the index.html file as response
    res.status(201).sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;
