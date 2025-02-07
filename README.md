# Wallet Api

## Description
This wallet project is a backend application built with Nest.js and typeorm, providing RESTful APIs for managing account data.

## Features
1.User Accounts: simple authentication and authorization flow for managing financial data.

2.Transaction Handling: Support for money transfers.

3.Filtering options: for fetching specific transactions data.

4.Comprehensive unit tests: to ensure functionality and reliability.

5.Swagger Documentation: Comprehensive API documentation for easy integration.

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/AbdalhamidAlhamad/wallet-api.git

cd wallet-api
```

### 2. Install Application dependencies

```sh
npm install
```


### 3. Running the Application
```sh
npm start
```
This command will set up the Nest.js application and the sqllite database. It will also run any necessary database migrations.

### 4. Once the application is running, you can access the Swagger API Documentation at:

 http://localhost:5000/api-docs

## API Usage
The application exposes various endpoints, such as:

1./api/auth - Manage authentication.

2./api/account - Manage account operation.

3./api/transactions - Manage transactions.


For detailed information about the API endpoints and usage, refer to the Swagger documentation available at 
http://localhost:5000/api-docs

## Running Unit Tests
To run the unit tests and see coverage , use the following command:


```sh
npm run test:cov
```

## Running End To End tests
To run the end to end tests and see coverage , use the following command:

```sh
npm run test:e2e
```


