### Terminal 1: Start PostgreSQL
docker-compose up -d

### Terminal 2: Start Django
cd backend
source venv/Scripts/activate
python manage.py runserver

### Terminal 3: Start React
cd frontend
npm run dev


### migrations
python manage.py makemigrations
python manage.py migrate

### Tests
python test_validation.py

# Invoice Generator

A modern, full-stack invoice generator application that allows users to create, manage, and download professional invoices as PDFs.

## 🚀 Features

- **Interactive Invoice Form**: Easy-to-use form with real-time calculations
- **PDF Generation**: Download invoices as professional PDF documents
- **Data Persistence**: Save invoices to database for future reference
- **Company & Client Management**: Store and reuse company and client information
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Calculations**: Automatic subtotal, tax, and total calculations
- **Invoice History**: View and manage all created invoices
- **RESTful API**: Clean API endpoints for integration and extensibility

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **React PDF** for PDF generation
- **Date-fns** for date handling
- **Vite** for development and build tooling

### Backend
- **Django 4.2** with Django REST Framework
- **PostgreSQL** database
- **Django CORS Headers** for frontend integration
- **UUID** primary keys for security

### Deployment
- **Frontend**: Vercel
- **Backend & Database**: Railway
- **Development Database**: PostgreSQL with Docker

## 📁 Project Structure

```
invoice-generator/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx          # Main application component
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Django application
│   ├── invoice_backend/      # Django project settings
│   ├── invoices/            # Main app with models, views, serializers
│   ├── requirements.txt
│   └── manage.py
├── docker-compose.yml       # PostgreSQL for local development
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker (for local PostgreSQL)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd invoice-generator
   ```

2. **Start PostgreSQL Database**
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api/
   - Django Admin: http://localhost:8000/admin/

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/invoices/` | GET | List all invoices |
| `/api/invoices/create-from-form/` | POST | Create invoice from form data |
| `/api/invoices/<id>/` | GET, PUT, DELETE | Manage specific invoice |
| `/api/companies/` | GET, POST | Manage companies |
| `/api/clients/` | GET, POST | Manage clients |
| `/api/stats/` | GET | Get invoice statistics |

## 🗄️ Database Schema

### Core Models
- **Company**: Business information (name, address, contact details)
- **Client**: Customer information (name, address, contact details)
- **Invoice**: Invoice header (numbers, dates, totals, status)
- **InvoiceItem**: Line items (description, quantity, rate, amount)

## 🎯 Usage

1. **Fill out the invoice form** with company and client details
2. **Add line items** with descriptions, quantities, and rates
3. **Set tax rate** for automatic tax calculations
4. **Add notes** for payment terms or additional information
5. **Generate PDF** to download the formatted invoice
6. **View invoice history** through the admin panel or API

## 🔧 Development

### Adding New Features
- Models: Add to `backend/invoices/models.py`
- API Endpoints: Add to `backend/invoices/views.py` and `urls.py`
- Frontend Components: Add to `frontend/src/components/`

### Running Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests (if added)
cd frontend
npm test
```

## 🚀 Deployment

### Production Setup
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway with managed PostgreSQL
- **Environment Variables**: Configured for production security

### Environment Variables
```bash
# Backend (.env)
SECRET_KEY=your-django-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed for small businesses and freelancers
- PDF generation powered by React-PDF
- Database management with Django ORM

---

**Live Demo**: https://invoice-generator-two-gold.vercel.app/  
**API Documentation**: [Your Railway URL]/api/

For questions or support, please open an issue or contact pavelrahman.dev@gmail.com