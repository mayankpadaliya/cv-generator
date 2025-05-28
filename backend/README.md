# CV Generator Backend

This is the backend service for the CV Generator application. It handles storing and retrieving CV data in JSON format.

## Setup

1. Make sure you have Python 3.7+ installed
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Flask server:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Save CV Data
- **POST** `/api/cv`
- Request body: JSON object containing CV data
- Returns: Message confirming save and generated filename

### Get All CVs
- **GET** `/api/cv`
- Returns: Array of all stored CV files with their data

### Get Specific CV
- **GET** `/api/cv/<filename>`
- Returns: CV data for the specified filename

## Data Storage

CV data is stored in JSON files in the `cv_data` directory. Each file is named with a timestamp for uniqueness. 