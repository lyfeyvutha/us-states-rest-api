const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

// Route to get all state data
router.get('/', statesController.getAllStates);

// Route to handle fun facts for a particular state
router.route('/:stateCode/funfact')
    .all(statesController.verifyStates) // Middleware to verify state code validity
    .get(statesController.getFunFact) // Get fun facts for the state
    .post(statesController.createNewFunFact) // Create new fun fact for the state
    .patch(statesController.updateFunFact) // Update existing fun fact for the state
    .delete(statesController.deleteFunFact); // Delete existing fun fact for the state

// Route to get the state capital
router.get('/:stateCode/capital', 
    statesController.verifyStates, // Middleware to verify state code validity
    statesController.getStateCapital); // Get the capital of the state

// Route to get the state nickname
router.get('/:stateCode/nickname', 
    statesController.verifyStates, // Middleware to verify state code validity
    statesController.getStateNickname); // Get the nickname of the state

// Route to get the state population
router.get('/:stateCode/population',
    statesController.verifyStates, // Middleware to verify state code validity
    statesController.getStatePopulation); // Get the population of the state

// Route to get the state admission date
router.get('/:stateCode/admission',
    statesController.verifyStates, // Middleware to verify state code validity
    statesController.getStateAdmission); // Get the admission date of the state

// Route to get single state data
router.route('/:stateCode')
    .all(statesController.verifyStates) // Middleware to verify state code validity
    .get(statesController.getState); // Get data of a single state

module.exports = router;