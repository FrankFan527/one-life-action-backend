# FIT5120 Backend

Backend service for the FIT5120 project, built with Node.js and Express.

## Project Structure

backend/
├── controllers/
│   └── recommendationController.js
├── data/
│   └── sampleData.js
├── routes/
│   └── recommendation.js
├── server.js
├── package.json
├── package-lock.json
└── .gitignore

## Architecture

The backend currently follows this workflow:

Frontend
→ API Route
→ Controller
→ Mock Data
→ JSON Response

At the current development stage, mock data is used for API testing.

The planned workflow is:

Frontend
→ API Route
→ Controller
→ Database
→ JSON Response

Once the database is ready, the mock data will be replaced by database queries while keeping the API contract consistent.

## Current API

### POST /recommendation

Example request:

{
  "age": 45,
  "bmi": 27,
  "smoking": false
}

Example response:

{
  "success": true,
  "riskLevel": "medium",
  "recommendations": [
    "Exercise for at least 150 minutes per week",
    "Reduce sugar and salt intake",
    "Monitor blood pressure regularly"
  ]
}

Note: The current recommendation logic and data are for development and integration testing only.

## Getting Started

### 1. Clone the repository

git clone <repository-url>

### 2. Install dependencies

npm install

### 3. Start the backend

npm start

The server will run at:

http://localhost:3000

## Development Status

Current:
- Backend project structure established
- Express server configured
- Recommendation API prototype created
- Mock data available for frontend integration

Next:
- Finalise API requirements with frontend
- Connect the database
- Implement the final recommendation logic
- Add input validation and error handling
- Prepare for deployment
