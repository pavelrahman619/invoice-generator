# Terminal 1: Start PostgreSQL
docker-compose up -d

# Terminal 2: Start Django
cd backend
source venv/bin/activate
python manage.py runserver

# Terminal 3: Start React
cd frontend
npm run dev