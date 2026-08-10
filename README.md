# one-life-action-backend

Backend service for the FIT5120 One Life Action project, built with Node.js and Express.

## Tech Stack

- Node.js
- Express.js
- MySQL
- REST API

## Project Structure

```backend/
 ├── certificates/
 │   └── ca.pem
 ├── config/
 │   └── database.js
 ├── controllers/
 │   ├── assessmentController.js
 │   └── dishController.js
 ├── data/
 │   └── sampleData.js
 ├── repositories/
 │   ├── dishRepository.js
 │   ├── guidelineRepository.js
 │   ├── mealSwapRepository.js
 │   ├── mortalityRepository.js
 │   └── nutrientConditionRepository.js
 ├── routes/
 │   └── assessmentRoutes.js
 ├── services/
 │   ├── bmiService.js
 │   ├── dishService.js
 │   ├── mortalityService.js
 │   ├── nutrientService.js
 │   └── recommendationService.js
 ├── .gitignore
 ├── package.json
 ├── package-lock.json
 └── server.js
```

## Getting Started

### 1. Clone the repository

git clone <repository-url>

### 2. Install dependencies

npm install

### 3. Start the backend

npm start

## Main Features

- BMI calculation
- Nutrient recommendations
- Dish recommendations
- Meal swap suggestions
- Mortality-related assessment
- Dietary guideline retrieval

## Project Architecture

The backend follows a layered structure:

Routes → Controllers → Services → Repositories → Database

- **Routes** define API endpoints.
- **Controllers** handle HTTP requests and responses.
- **Services** contain business logic.
- **Repositories** handle database access.
