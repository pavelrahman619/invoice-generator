# Terminal 1: Start PostgreSQL
docker-compose up -d

# Terminal 2: Start Django
cd backend
source venv/Scripts/activate
python manage.py runserver

# Terminal 3: Start React
cd frontend
npm run dev


### migrations
python manage.py makemigrations
python manage.py migrate

### Tests
python test_validation.py