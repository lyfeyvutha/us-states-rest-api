const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve CSS file
router.get('/css/style(.css)?', (req, res) => {
    console.log("Inside Public");
    // Send the CSS file as response
    res.status(201).sendFile(path.join(__dirname, '..', 'public', 'css', 'style.css'));
});

module.exports = router;
