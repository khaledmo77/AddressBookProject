# Address Book Project

A full-stack web application for managing contacts with a modern architecture and robust features.

## Architecture Overview

The project follows a clean N-Tier architecture pattern with clear separation of concerns:

### Backend (.NET Core)

#### 1. Domain Layer (`AddressBook.Domain`)
- Contains core business entities:
  - `AddressBookEntry`: Main contact entity with properties like name, contact info, job, department
  - `Job`: Job position entity
  - `Department`: Department entity
- Pure domain models with business logic

#### 2. Data Access Layer (`AddressBook.DAL`)
- Implements data persistence using Entity Framework Core
- Features:
  - Generic Repository pattern implementation
  - Custom repositories for specific entities
  - Entity Framework Core context and configurations
  - Data access abstractions through interfaces

#### 3. Business Logic Layer (`AddressBook.BLL`)
- Implements business rules and operations
- Services:
  - `AddressBookEntryService`: Contact management
  - `JobService`: Job position management
  - `DepartmentService`: Department management
  - `AdminService`: Admin authentication and management
- Handles data validation and business rules

#### 4. Common Layer (`AddressBook.Common`)
- Shared DTOs (Data Transfer Objects)
- Constants and utilities
- Response models
- Validation attributes

#### 5. API Layer (`AddressBook.API`)
- RESTful API endpoints
- Authentication and authorization
- File handling for contact photos
- API documentation

### Frontend (Angular)

#### 1. Core Features
- Modern Angular application with TypeScript
- Responsive design using SCSS
- Component-based architecture

#### 2. Key Modules
- `auth`: Authentication and authorization
- `address-book`: Contact management
- `jobs`: Job position management
- `departments`: Department management
- `dashboard`: Main application dashboard
- `shared`: Reusable components and services

#### 3. Services
- API integration services
- Authentication service
- File upload service
- Data management services

## Features

### Contact Management
- Create, read, update, and delete contacts
- Search contacts with multiple criteria
- Export contacts to Excel
- Photo upload and management
- Age calculation based on birth date

### Job and Department Management
- CRUD operations for jobs and departments
- Hierarchical organization structure
- Validation and business rules

### Security
- Admin authentication
- Password protection
- Input validation
- Secure file handling

### Data Validation
- Email format validation
- Phone number format validation
- Required field validation
- Business rule enforcement

## Technical Stack

### Backend
- .NET Core
- Entity Framework Core
- SQL Server
- JWT Authentication
- AutoMapper
- Fluent Validation

### Frontend
- Angular
- TypeScript
- SCSS
- RxJS
- Angular Material (if used)

## Getting Started

### Prerequisites
- .NET Core SDK
- Node.js and npm
- SQL Server
- Angular CLI

### Backend Setup
1. Navigate to the Server directory
2. Restore NuGet packages
3. Update connection string in appsettings.json
4. Run database migrations
5. Start the API project

### Frontend Setup
1. Navigate to the Client/address-book-client directory
2. Install dependencies: `npm install`
3. Update API URL in environment files
4. Start the development server: `ng serve`

## Project Structure

```
AddressBookProject/
├── Server/
│   └── AddressBookSolution/
│       ├── AddressBook.API/
│       ├── AddressBook.BLL/
│       ├── AddressBook.DAL/
│       ├── AddressBook.Domain/
│       └── AddressBook.Common/
└── Client/
    └── address-book-client/
        └── src/
            ├── app/
            │   ├── address-book/
            │   ├── auth/
            │   ├── dashboard/
            │   ├── departments/
            │   ├── jobs/
            │   ├── services/
            │   └── shared/
            └── assets/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 