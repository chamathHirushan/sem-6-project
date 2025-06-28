# Sem-6-project

## To run Frontend

1) &nbsp;
   Navigate to frontend folder
2) ```
   npm install
3) &nbsp;
   Make an .env with VITE_BACKEND_URL
4) ```
   npm run dev

## To run Backend

1) &nbsp;
   Navigate to backend folder
2) &nbsp;
   Create or activate your venv
3) &nbsp;
   Make an .env with FRONTEND_URL
4) ```
   pip install -r requirements.txt
5) ```
   uvicorn main:app --reload

# now can access frontend and backend with db via docker
1. docker-compose build
2. docker-compose up -d
