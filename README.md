## US States API 
Author: Chealyfey Vutha

This project is a Node.js REST API built with Express and MongoDB that provides access to US state data.

### Features

* Retrieves data for all US states from `statesData.json`.
* Stores fun facts for specific states in a MongoDB collection.
* Provides various API endpoints for accessing state information:
    * List all states with data from both sources (JSON file and MongoDB).
    * Filter states by contiguous status (contiguous or non-contiguous).
    * Get detailed information for a specific state (by abbreviation).
    * Retrieve a random fun fact for a state.
    * Get state capital, nickname, population, and admission date.
    * Add, update (patch), and delete fun facts for a state.

### Requirements

* Node.js and npm installed
* MongoDB database
* Glitch.com account (for deployment)

### Setup

1. Clone this repository.
2. Install dependencies: `npm install`
3. Create a `.env` file to store environment variables (refer to deployment instructions).
4. Configure your MongoDB connection details in the code.
5. Deploy the project to Glitch.com.

### Usage

**Base URL:** https://valuable-boom-silica.glitch.me/

**API Endpoints:**

* **GET /states/**  - Retrieves all state data.
* **GET /states/?contig=true** - Retrieves data for contiguous states.
* **GET /states/?contig=false** - Retrieves data for non-contiguous states.
* **GET /states/:state** - Retrieves data for a specific state (by abbreviation).
* **GET /states/:state/funfact** - Retrieves a random fun fact for a state.
* **GET /states/:state/capital** - Retrieves state capital.
* **GET /states/:state/nickname** - Retrieves state nickname.
* **GET /states/:state/population** - Retrieves state population.
* **GET /states/:state/admission** - Retrieves state admission date.
* **POST /states/:state/funfact** - Adds fun facts to a state.
* **PATCH /states/:state/funfact** - Updates (replaces) a specific fun fact for a state.
* **DELETE /states/:state/funfact** - Deletes a specific fun fact for a state.

Use tools like Postman to test the API requests and responses. Refer to the code for detailed request body formats for POST and PATCH methods.

### Deployment

1. Create a Glitch.com account.
2. Push your code to a GitHub repository.
3. Deploy your project to Glitch from your GitHub repository.
4. Configure environment variables in Glitch (avoid storing `.env` file publicly).

### Additional Notes

* Refer to the code for specific error handling and response formats.
* This project offers opportunities for further development, such as data sorting, filtering by admission year, etc.

### Contributing

Feel free to fork the repository and contribute improvements.

### License

This project is licensed under the MIT License.


