# FIT5120 Backend

Backend service for the FIT5120 project, built with Node.js and Express.

## Architecture

The backend currently follows this workflow:

Frontend
→ API Route
→ Controller
→ Database
→ JSON Response

## Current API

### POST /recommendation

Example request:

{
  "ageBand": "45-54",
  "heightCm": 170,
  "weightKg": 78,
  "meals": {
    "breakfast": 4,
    "lunch": 12,
    "tea": 18,
    "dinner": 25
  }
}

Example response:

{
  "success": true,

  "healthContext": {
    "bmi": 26.99,
    "bmiCategory": "Overweight",
    "bmiDisclaimer": "BMI is a screening indicator and not a medical diagnosis."
  },

  "mortalityContext": {
    "ageBand": "45-54",
    "leadingCauses": [],
    "source": "DOSM",
    "reportingPeriod": "..."
  },

  "dailyAnalysis": {
    "totals": {
      "energyKcal": 2150,
      "sugarG": 68,
      "saturatedFatG": 24,
      "sodiumMg": 2800
    },

    "nutrients": {
      "sugar": {
        "guideline": 25,
        "ratio": 2.72,
        "exceeded": true
      },
      "sodium": {
        "guideline": 2000,
        "ratio": 1.4,
        "exceeded": true
      },
      "saturatedFat": {
        "guideline": 20,
        "ratio": 1.2,
        "exceeded": true
      }
    }
  },

  "priority": {
    "nutrient": "sugar",
    "ratio": 2.72,
    "healthExplanation": "..."
  },

  "recommendation": {
    "originalDish": {},
    "replacementDish": {},
    "priorityNutrient": "sugar",
    "reason": "...",
    "explanation": "..."
  },

  "impact": {
    "originalTotal": 68,
    "revisedTotal": 45,
    "absoluteReduction": 23,
    "percentageReduction": 33.82,
    "withinGuideline": false
  }
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
