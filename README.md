# E-commerce Backend API

A robust and scalable e-commerce backend API built with NestJS, TypeScript, and PostgreSQL.

## Features

- 🔐 Authentication & Authorization
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Secure password hashing with bcrypt

- 👤 User Management
  - User registration and login
  - Profile management
  - Role-based permissions

- 🛍️ Product Management (Coming Soon)
  - CRUD operations for products
  - Category management
  - Inventory tracking

- 🛒 Shopping Cart (Coming Soon)
  - Add/remove items
  - Update quantities
  - Price calculations

- 💳 Order Management (Coming Soon)
  - Order creation and tracking
  - Order history
  - Status updates

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Authentication:** [Passport.js](http://www.passportjs.org/) with JWT
- **API Documentation:** [Swagger/OpenAPI](https://swagger.io/)
- **Validation:** [Joi](https://joi.dev/)

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/eqinox/eCommercev2-db.git
cd eCommercev2-db
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=ecommerce_db
JWT_SECRET=your_jwt_secret
```

4. Start the development server:
```bash
npm run start:dev
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Available Scripts

- `npm run start:dev` - Start the application in development mode
- `npm run build` - Build the application
- `npm run start:prod` - Start the application in production mode
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management module
├── config/         # Configuration files
├── main.ts         # Application entry point
└── app.module.ts   # Root module
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/eqinox/eCommercev2-db](https://github.com/eqinox/eCommercev2-db)
