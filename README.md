# SpendMila - Personal Finance Management Application

## Overview

SpendMila is a comprehensive personal finance management application designed to help users track, categorize, and analyze their expenses. The platform provides intuitive tools for financial management, enabling users to gain better control over their spending habits and make informed financial decisions.

### Key Features

- **Expense Tracking**: Record and categorize your daily expenses
- **Spending Analytics**: Visualize your spending patterns with interactive charts and graphs
- **Budget Management**: Create and manage budgets for different expense categories
- **Financial Reports**: Generate detailed financial reports for better insights
- **Responsive Design**: Access your financial data from any device with a seamless user experience

## Technology Stack

### Backend

The backend of SpendMila is built with a robust and modern tech stack:

- **Framework**: FastAPI (Python-based, high-performance web framework)
- **Database**: PostgreSQL with SQLModel ORM
- **Authentication**: JWT-based authentication
- **API Documentation**: Automatic OpenAPI/Swagger documentation
- **Containerization**: Docker
- **Dependency Management**: UV (Python package manager)
- **Testing**: Pytest
- **Database Migrations**: Alembic
- **Email Processing**: Jinja2 templates with MJML

### Frontend

The frontend is developed with modern JavaScript/TypeScript technologies:

- **Framework**: React with TypeScript
- **Routing**: React Router and TanStack Router
- **State Management**: TanStack Query (formerly React Query)
- **UI Components**:
  - Radix UI components
  - Shadcn UI
  - Chakra UI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Testing**: Playwright for end-to-end testing
- **Code Quality**: Biome (linting, formatting)

## Getting Started

Please refer to the individual README files in the backend and frontend directories for detailed setup instructions:

- [Backend Setup](/backend/README.md)
- [Frontend Setup](/frontend/README.md)

## Project Structure

```
SpendMila/
├── backend/             # FastAPI backend
│   ├── app/             # Application code
│   ├── scripts/         # Utility scripts
│   └── .venv/           # Python virtual environment
├── frontend/            # React frontend
│   ├── src/             # Source code
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── routes/      # Application routes
│   │   └── client/      # Generated API client
│   └── public/          # Static assets
└── docker-compose.yml   # Docker Compose configuration
```

## Development Workflow

The project uses Docker Compose for local development. Start the development environment with:

```bash
docker compose up -d
```

For frontend development, it's recommended to run the development server locally:

```bash
cd frontend
npm run dev
```

## License

[License Information] 