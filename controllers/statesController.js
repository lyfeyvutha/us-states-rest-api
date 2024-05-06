// Importing required modules
const fs = require('fs').promises;
const path = require('path');
const State = require('../model/State');
const statesData = require('../statesData.json');

// Middleware function to verify the validity of the passed state abbreviation parameter
const verifyStates = (req, res, next) => {
    const stateCode = req.params.stateCode.toUpperCase(); // Get state abbreviation parameter
    const stateCodes = statesData.map(state => state.code); // Get state codes from JSON data

    if (!stateCodes.includes(stateCode)) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    // Add stateCode to request object for future use
    req.stateCode = stateCode;
    next();
};

// Route handler to get all state entries along with fun facts
const getAllStates = async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, '..', 'statesData.json'), 'utf8'); // Read state data from JSON file
        const states = JSON.parse(data); // Parse JSON data

        // Check for contig URL query parameter
        if (req.query.contig !== undefined) {
            const nonContiguousStates = ['AK', 'HI']; // Non-contiguous states
            const contig = req.query.contig.toLowerCase() === 'true'; // Check value of contig query parameter

            // Filter states based on query parameter value
            const filteredStates = states.filter(state => {
                const isContiguous = !nonContiguousStates.includes(state.code);
                return isContiguous === contig;
            });

            // Fetch fun facts for filtered states
            const funFactsPromises = filteredStates.map(state => getStateFunFacts(state.code));
            const allFunFacts = await Promise.all(funFactsPromises);

            // Append fun facts to filtered states
            filteredStates.forEach((state, index) => {
                if (allFunFacts[index]) {
                    state.funfacts = allFunFacts[index];
                }
            });

            return res.json(filteredStates);
        } else {
            // Fetch fun facts for all states
            const funFactsPromises = states.map(state => getStateFunFacts(state.code));
            const allFunFacts = await Promise.all(funFactsPromises);

            // Append fun facts to states
            states.forEach((state, index) => {
                if (allFunFacts[index]) {
                    state.funfacts = allFunFacts[index];
                }
            });

            return res.json(states);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Route handler to get single state entry along with fun facts
const getState = async (req, res) => {
    try {
        const state = await getStateData(req.stateCode); // Get state data
        const funfacts = await getStateFunFacts(req.stateCode); // Get fun facts for the state
        
        // Add fun facts to the state
        if (funfacts) {
            state.funfacts = funfacts;
        }
        res.json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to get single state data
const getStateData = async (stateCode) => {
    const data = await fs.readFile(path.join(__dirname, '..', 'statesData.json'), 'utf8'); // Read state data from JSON file
    const states = JSON.parse(data); // Parse JSON data
    const state = states.find(state => state.code === stateCode.toUpperCase()); // Find specific state entry
    return state || null;
};

// Route handler to get state capital
const getStateCapital = async (req, res) => {
    const state = await getStateData(req.stateCode); // Get state data
    res.json({ "state": state.state, "capital": state.capital_city });
};

// Route handler to get state nickname
const getStateNickname = async (req, res) => {
    const state = await getStateData(req.stateCode); // Get state data
    res.json({ "state": state.state, "nickname": state.nickname });
};

// Route handler to get state population
const getStatePopulation = async (req, res) => {
    const state = await getStateData(req.stateCode); // Get state data

    // Convert population number to string with commas
    const formattedPopulation = state.population.toLocaleString('en-US');
    res.json({ "state": state.state, "population": formattedPopulation });
};

// Route handler to get state admission date
const getStateAdmission = async (req, res) => {
    const state = await getStateData(req.stateCode); // Get state data
    res.json({ "state": state.state, "admitted": state.admission_date });
};

// Helper function to get fun facts for a state from MongoDB
const getStateFunFacts = async (stateCode) => {
    const state = await State.findOne({ stateCode: stateCode.toUpperCase() });
    return state ? state.funfacts : null;
};

// Route handler to get single state fun fact entry
const getFunFact = async (req, res) => {
    try {
        const funfacts = await getStateFunFacts(req.stateCode); // Get fun facts for the state
        const state = await getStateData(req.stateCode); // Get state data
    
        if (!funfacts || funfacts.length === 0) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` });
        }
    
        // Select random fun fact from available state fun facts
        const randomIndex = Math.floor(Math.random() * funfacts.length);
        const funfact = funfacts[randomIndex];
    
        res.json({ funfact });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Route handler to create new fun fact
const createNewFunFact = async (req, res) => {
    const funfact = req.body.funfacts;
    const stateCode = req.stateCode;

    if (!funfact || funfact.length === 0) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    if (!Array.isArray(funfact)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }

    try {
        const updatedState = await State.findOneAndUpdate(
            { stateCode }, 
            { $push: { funfacts: { $each: funfact } } },
            { new: true, upsert: true }
        );

        if (!updatedState) {
            return res.status(404).json({ 'message': 'State not found' });
        }

        res.status(200).json(updatedState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Route handler to update existing fun fact (PATCH request)
const updateFunFact = async (req, res) => {
    const newFunFact = req.body.funfact;
    let index = req.body.index;
    const stateCode = req.stateCode;

    if (!index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }

    if (!newFunFact) {
        return res.status(400).json({ 'message': 'State fun fact value required' });
    }

    try {
        index = index - 1;
        const stateFunFacts = await getStateFunFacts(stateCode);
        const stateData = await getStateData(stateCode);

        if (!stateFunFacts || stateFunFacts.length === 0) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${stateData.state}` });
        }

        if (index < 0 || index >= stateFunFacts.length) {
            return res.status(404).json({ 'message': `No Fun Fact found at that index for ${stateData.state}` });
        }

        const state = await State.findOneAndUpdate(
            { stateCode: stateCode },
            { $set: { [`funfacts.${index}`]: newFunFact } },
            { new: true }
        );

        return res.status(200).json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Route handler to delete existing fun fact (DELETE request)
const deleteFunFact = async (req, res) => {
    let index = req.body.index;
    const stateCode = req.stateCode;

    if (!index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }

    try {
        index = index - 1;
        const stateFunFacts = await getStateFunFacts(stateCode);
        const stateData = await getStateData(stateCode);

        if (!stateFunFacts || stateFunFacts.length === 0) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${stateData.state}` });
        }

        if (index < 0 || index >= stateFunFacts.length) {
            return res.status(404).json({ 'message': `No Fun Fact found at that index for ${stateData.state}` });
        }

        await State.findOneAndUpdate(
            { stateCode: stateCode },
            { $unset: { [`funfacts.${index}`]: 1 } }
        );
        
        const state = await State.findOneAndUpdate(
            { stateCode: stateCode },
            { $pull: { funfacts: null } },
            { new: true }
        );

        return res.status(200).json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Exporting route handlers
module.exports = {
    verifyStates,
    getAllStates,
    getState,
    getFunFact,
    createNewFunFact,
    getStatePopulation,
    getStateAdmission,
    getStateNickname,
    getStateCapital,
    updateFunFact,
    deleteFunFact
};
