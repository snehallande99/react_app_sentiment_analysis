# Final Year Project

This repository contains a full-stack web application built with React (Frontend) and Python (Backend).

## Project Structure

```
├── frontend/           # React frontend application
├── backend/           # Python backend application
├── models/           # ML models and related files
└── BE_Project/       # Additional project files
```

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm (Node Package Manager)

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend server:
   ```bash
   python app/main.py
   ```

## Features

- Modern React frontend with Vite
- Python backend
- Machine Learning models integration
- Interactive charts and data visualization
- Responsive design

## Technologies Used

### Frontend
- React
- Vite
- Chart.js
- React Router DOM
- Framer Motion
- React Icons

### Backend
- Python
- FastAPI/Flask (based on your backend implementation)
- Machine Learning libraries (as per your models)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.