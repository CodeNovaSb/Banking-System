# Banking System Backend Documentation

Project: `banking-system`  
Done by Subehaa SB, M-tech FSD  


## 1) Backend Overview

This backend is a Spring Boot REST API for core banking operations, including:
- Customer management
- Account management
- Transactions and balance updates
- Loans, payments, cards
- Branch and employee management
- User and login operations
- Reporting endpoints for system and branch summaries

### Technology stack
- Java 17 (`pom.xml`)
- Spring Boot 3.5.13
- Spring Web + Spring Data JPA
- PostgreSQL (runtime driver)
- Lombok for model boilerplate

### Runtime configuration
From `src/main/resources/application.properties`:
- Application name: `banking-system`
- Default server port: `8080`
- DB URL: `jdbc:postgresql://localhost:5432/Bank_managment_system`
- JPA mode: `spring.jpa.hibernate.ddl-auto=validate`

Base URL (default local):
```text
http://localhost:8080
```

All controllers currently allow all origins:
```java
@CrossOrigin(origins = "*")
```

## 2) Project Structure Analysis

### Main packages and responsibilities
- `com.bank.controller`  
  Exposes REST endpoints, maps HTTP to service calls, and shapes status codes.
- `com.bank.service`  
  Contains core business logic and transactional behavior.
- `com.bank.repository`  
  Spring Data JPA repositories and custom query methods.
- `com.bank.entity`  
  JPA entities mapping DB tables (`accounts`, `customers`, `transactions`, etc.).
- `com.bank.dto`  
  DTOs used for login and report responses.

### Layering pattern in this project
Typical request flow:
```text
HTTP Request -> Controller -> Service -> Repository -> PostgreSQL
                                          |
                                     Entity/DTO response
```

## 3) API Conventions

- Content type: JSON (`application/json`)
- Path style: plural resource naming (`/api/accounts`, `/api/customers`, etc.)
- Success and errors are returned through `ResponseEntity`
- Error payloads are plain strings in many endpoints (not a unified error object)
- Authentication is currently login-only (`/api/auth/login`) with no token generation or session layer

## 4) Quick Endpoint Index (All Controllers)

| Method | Endpoint | Controller |
|---|---|---|
| GET | `/api/accounts` | `AccountController` |
| GET | `/api/accounts/{id}` | `AccountController` |
| GET | `/api/accounts/customer/{customerId}` | `AccountController` |
| POST | `/api/accounts` | `AccountController` |
| PUT | `/api/accounts/{id}` | `AccountController` |
| DELETE | `/api/accounts/{id}` | `AccountController` |
| POST | `/api/auth/login` | `AuthController` |
| GET | `/api/branches` | `BranchController` |
| GET | `/api/branches/{id}` | `BranchController` |
| POST | `/api/branches` | `BranchController` |
| PUT | `/api/branches/{id}` | `BranchController` |
| DELETE | `/api/branches/{id}` | `BranchController` |
| GET | `/api/cards` | `CardController` |
| GET | `/api/cards/{id}` | `CardController` |
| GET | `/api/cards/account/{accountId}` | `CardController` |
| POST | `/api/cards` | `CardController` |
| GET | `/api/customers` | `CustomerController` |
| GET | `/api/customers/{id}` | `CustomerController` |
| POST | `/api/customers` | `CustomerController` |
| PUT | `/api/customers/{id}` | `CustomerController` |
| DELETE | `/api/customers/{id}` | `CustomerController` |
| GET | `/api/employees` | `EmployeeController` |
| GET | `/api/employees/{id}` | `EmployeeController` |
| GET | `/api/employees/branch/{branchId}` | `EmployeeController` |
| POST | `/api/employees` | `EmployeeController` |
| GET | `/api/loans` | `LoanController` |
| GET | `/api/loans/{id}` | `LoanController` |
| GET | `/api/loans/customer/{customerId}` | `LoanController` |
| POST | `/api/loans` | `LoanController` |
| GET | `/api/payments` | `PaymentController` |
| GET | `/api/payments/{id}` | `PaymentController` |
| GET | `/api/payments/account/{accountId}` | `PaymentController` |
| POST | `/api/payments` | `PaymentController` |
| GET | `/api/reports/summary` | `ReportController` |
| GET | `/api/reports/branch-summary` | `ReportController` |
| GET | `/api/reports/transactions/recent` | `ReportController` |
| GET | `/api/transactions` | `TransactionController` |
| GET | `/api/transactions/{id}` | `TransactionController` |
| GET | `/api/transactions/account/{accountId}` | `TransactionController` |
| POST | `/api/transactions` | `TransactionController` |
| GET | `/api/users` | `UserController` |
| GET | `/api/users/{username}` | `UserController` |
| POST | `/api/users` | `UserController` |
| DELETE | `/api/users/{username}` | `UserController` |

---

## 5) Detailed Controller Documentation

## 5.1 `AuthController` (`/api/auth`)
Source: `src/main/java/com/bank/controller/AuthController.java`

### `POST /api/auth/login`
Authenticates a user by username/password.

**Request body (`LoginRequest`)**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success response `200 OK` (`LoginResponse`)**
```json
{
  "message": "Login successful",
  "role": "ADMIN",
  "username": "admin",
  "referenceId": 1
}
```

**Error response `401 Unauthorized`**
```json
"Invalid username or password"
```

**Implementation snippet**
```java
if (userOptional.isEmpty()) {
    throw new RuntimeException("Invalid username or password");
}
if (!user.getPassword().equals(request.getPassword())) {
    throw new RuntimeException("Invalid username or password");
}
```

---

## 5.2 `UserController` (`/api/users`)
Source: `src/main/java/com/bank/controller/UserController.java`

### `GET /api/users`
Returns all users.
- `200 OK` -> `User[]`

### `GET /api/users/{username}`
Returns a user by username.
- `200 OK` -> `User`
- `404 Not Found`

### `POST /api/users`
Creates a user.
- `201 Created` -> created `User`
- `409 Conflict` -> username already exists (message from service)

**Sample request**
```json
{
  "username": "branch_mgr_01",
  "password": "changeMe123",
  "role": "BRANCH_MANAGER",
  "referenceId": 12
}
```

### `DELETE /api/users/{username}`
Deletes a user by username.
- `200 OK` -> `"User deleted successfully"`
- `404 Not Found` -> `"User not found"`
- `409 Conflict` -> `"Cannot delete user because it is referenced by other records"`

---

## 5.3 `CustomerController` (`/api/customers`)
Source: `src/main/java/com/bank/controller/CustomerController.java`

### `GET /api/customers`
- `200 OK` -> `Customer[]`

### `GET /api/customers/{id}`
- `200 OK` -> `Customer`
- `404 Not Found`

### `POST /api/customers`
Creates customer.
- `201 Created` -> created `Customer`
- `409 Conflict` -> `"Customer already exists with this phone or email"`

**Sample request**
```json
{
  "name": "Aarav Sharma",
  "dob": "1992-08-14",
  "gender": "Male",
  "phone": "9876543210",
  "email": "aarav.sharma@example.com",
  "address": "MG Road, Bengaluru"
}
```

### `PUT /api/customers/{id}`
Updates customer fields.
- `200 OK` -> updated `Customer`
- `404 Not Found`
- `409 Conflict` -> `"Phone or email already in use by another customer"`

### `DELETE /api/customers/{id}`
- `200 OK` -> `"Customer deleted successfully"`
- `404 Not Found`

---

## 5.4 `BranchController` (`/api/branches`)
Source: `src/main/java/com/bank/controller/BranchController.java`

### `GET /api/branches`
- `200 OK` -> `Branch[]`

### `GET /api/branches/{id}`
- `200 OK` -> `Branch`
- `404 Not Found`

### `POST /api/branches`
- `201 Created` -> created `Branch`

### `PUT /api/branches/{id}`
- `200 OK` -> updated `Branch`
- `404 Not Found`

### `DELETE /api/branches/{id}`
- `200 OK` -> `"Branch deleted successfully"`
- `404 Not Found`

---

## 5.5 `EmployeeController` (`/api/employees`)
Source: `src/main/java/com/bank/controller/EmployeeController.java`

### `GET /api/employees`
- `200 OK` -> `Employee[]`

### `GET /api/employees/{id}`
- `200 OK` -> `Employee`
- `404 Not Found`

### `GET /api/employees/branch/{branchId}`
Returns employees in a branch.
- `200 OK` -> `Employee[]`

### `POST /api/employees`
- `201 Created` -> created `Employee`
- `400 Bad Request` -> `"Error creating employee: ..."`

---

## 5.6 `AccountController` (`/api/accounts`)
Source: `src/main/java/com/bank/controller/AccountController.java`

### `GET /api/accounts`
- `200 OK` -> `Account[]`

### `GET /api/accounts/{id}`
- `200 OK` -> `Account`
- `404 Not Found`

### `GET /api/accounts/customer/{customerId}`
Returns all accounts for a customer.
- `200 OK` -> `Account[]`

### `POST /api/accounts`
Creates account.
- `201 Created` -> created `Account`
- `400 Bad Request` -> `"Error creating account: ..."`

**Sample request**
```json
{
  "customer": { "customerId": 5 },
  "branch": { "branchId": 2 },
  "accountType": "Savings",
  "balance": 15000.00,
  "createdDate": "2026-04-09"
}
```

### `PUT /api/accounts/{id}`
Updates account.
- `200 OK` -> updated `Account`
- `404 Not Found`
- `400 Bad Request` -> `"Error updating account: ..."`

### `DELETE /api/accounts/{id}`
- `200 OK` -> `"Account deleted successfully"`
- `404 Not Found`

---

## 5.7 `TransactionController` (`/api/transactions`)
Source: `src/main/java/com/bank/controller/TransactionController.java`

### `GET /api/transactions`
- `200 OK` -> `Transaction[]`

### `GET /api/transactions/{id}`
- `200 OK` -> `Transaction`
- `404 Not Found`

### `GET /api/transactions/account/{accountId}`
- `200 OK` -> `Transaction[]`

### `POST /api/transactions`
Creates transaction and updates account balance (business logic in service).
- `201 Created` -> created `Transaction`
- `400 Bad Request` -> one of:
  - `"Account not found with id: X"`
  - `"Insufficient balance"`
  - `"Invalid transaction type. Use Credit, Debit or Transfer"`

**Important business rule snippet**
```java
if (type.equalsIgnoreCase("Credit")) {
    account.setBalance(account.getBalance().add(amount));
} else if (type.equalsIgnoreCase("Debit") || type.equalsIgnoreCase("Transfer")) {
    if (account.getBalance().compareTo(amount) < 0) {
        throw new RuntimeException("Insufficient balance");
    }
    account.setBalance(account.getBalance().subtract(amount));
} else {
    throw new RuntimeException("Invalid transaction type. Use Credit, Debit or Transfer");
}
```

**Sample request**
```json
{
  "account": { "accountId": 10 },
  "transactionType": "Debit",
  "amount": 500.00
}
```

---

## 5.8 `LoanController` (`/api/loans`)
Source: `src/main/java/com/bank/controller/LoanController.java`

### `GET /api/loans`
- `200 OK` -> `Loan[]`

### `GET /api/loans/{id}`
- `200 OK` -> `Loan`
- `404 Not Found`

### `GET /api/loans/customer/{customerId}`
- `200 OK` -> `Loan[]`

### `POST /api/loans`
- `201 Created` -> created `Loan`
- `400 Bad Request` -> `"Error creating loan: ..."`

---

## 5.9 `PaymentController` (`/api/payments`)
Source: `src/main/java/com/bank/controller/PaymentController.java`

### `GET /api/payments`
- `200 OK` -> `Payment[]`

### `GET /api/payments/{id}`
- `200 OK` -> `Payment`
- `404 Not Found`

### `GET /api/payments/account/{accountId}`
- `200 OK` -> `Payment[]`

### `POST /api/payments`
- `201 Created` -> created `Payment`
- `400 Bad Request` -> `"Error creating payment: ..."`

---

## 5.10 `CardController` (`/api/cards`)
Source: `src/main/java/com/bank/controller/CardController.java`

### `GET /api/cards`
- `200 OK` -> `Card[]`

### `GET /api/cards/{id}`
- `200 OK` -> `Card`
- `404 Not Found`

### `GET /api/cards/account/{accountId}`
- `200 OK` -> `Card[]`

### `POST /api/cards`
- `201 Created` -> created `Card`
- `400 Bad Request` -> `"Error creating card: ..."`

---

## 5.11 `ReportController` (`/api/reports`)
Source: `src/main/java/com/bank/controller/ReportController.java`

### `GET /api/reports/summary`
Returns overall counts.

**Response `200 OK`**
```json
{
  "totalCustomers": 120,
  "totalAccounts": 210,
  "totalBranches": 6,
  "totalEmployees": 45
}
```

### `GET /api/reports/branch-summary`
Returns branch-wise account and balance summary (`BranchSummaryDTO[]`).

**Response item shape**
```json
{
  "branchName": "Koramangala Branch",
  "city": "Bengaluru",
  "totalAccounts": 42,
  "totalBalance": 9876543.21
}
```

### `GET /api/reports/transactions/recent`
Returns latest 10 transactions system-wide (`Transaction[]`).

---

## 6) Data Model Reference (Entities and DTOs)

## 6.1 Core Entities

### `User` (`users`)
- `userId: Integer` (PK)
- `username: String` (unique, not null)
- `password: String` (not null)
- `role: String` (not null)
- `referenceId: Integer`

### `Customer` (`customers`)
- `customerId: Integer` (PK)
- `name: String` (not null)
- `dob: LocalDate` (not null)
- `gender: String`
- `phone: String` (unique)
- `email: String` (unique)
- `address: String`

### `Branch` (`branches`)
- `branchId: Integer` (PK)
- `branchName: String` (not null)
- `city: String` (not null)

### `Employee` (`employees`)
- `employeeId: Integer` (PK)
- `name: String` (not null)
- `role: String`
- `salary: BigDecimal(10,2)`
- `branch: Branch` (many-to-one, not null)

### `Account` (`accounts`)
- `accountId: Integer` (PK)
- `customer: Customer` (many-to-one, not null)
- `branch: Branch` (many-to-one, not null)
- `accountType: String`
- `balance: BigDecimal(12,2)`
- `createdDate: LocalDate` (not null)

### `Transaction` (`transactions`)
- `transactionId: Integer` (PK)
- `account: Account` (many-to-one, not null)
- `transactionType: String`
- `amount: BigDecimal(12,2)`
- `transactionDate: LocalDateTime` (not null; service sets to now)

### `Payment` (`payments`)
- `paymentId: Integer` (PK)
- `account: Account` (many-to-one, not null)
- `paymentType: String`
- `amount: BigDecimal(12,2)`
- `paymentDate: LocalDate` (not null)

### `Loan` (`loans`)
- `loanId: Integer` (PK)
- `customer: Customer` (many-to-one, not null)
- `loanType: String`
- `amount: BigDecimal(12,2)`
- `interestRate: BigDecimal(5,2)`
- `startDate: LocalDate` (not null)

### `Card` (`cards`)
- `cardId: Integer` (PK)
- `account: Account` (many-to-one, not null)
- `cardType: String`
- `expiryDate: LocalDate`

## 6.2 DTOs

### `LoginRequest`
- `username: String`
- `password: String`

### `LoginResponse`
- `message: String`
- `role: String`
- `username: String`
- `referenceId: Integer`

### `BranchSummaryDTO`
- `branchName: String`
- `city: String`
- `totalAccounts: Long`
- `totalBalance: BigDecimal`

---

## 7) Example API Usage Snippets

### Login example (cURL)
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Create account example (cURL)
```bash
curl -X POST "http://localhost:8080/api/accounts" \
  -H "Content-Type: application/json" \
  -d '{
    "customer":{"customerId":1},
    "branch":{"branchId":1},
    "accountType":"Savings",
    "balance":10000.00,
    "createdDate":"2026-04-09"
  }'
```

### Debit transaction example (cURL)
```bash
curl -X POST "http://localhost:8080/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "account":{"accountId":1},
    "transactionType":"Debit",
    "amount":250.00
  }'
```

---

## 8) Suggested Next Improvements (Industry Standard Hardening)

1. Introduce DTO-based request/response contracts for all controllers.
2. Add `@ControllerAdvice` with a unified error format (`code`, `message`, `timestamp`, `path`).
3. Implement Spring Security + JWT and hash passwords (`BCryptPasswordEncoder`).
4. Add bean validation (`@NotNull`, `@Email`, `@Pattern`, `@Positive`) and return 400 validation details.
5. Add OpenAPI/Swagger (`springdoc-openapi`) to auto-publish interactive API docs.
6. Add endpoint-level integration tests (`@SpringBootTest` / `MockMvc`) for success and failure paths.

---

## 9) Source Traceability

Main source files used for this documentation:
- Controllers: `src/main/java/com/bank/controller/*.java`
- Services: `src/main/java/com/bank/service/*.java`
- Repositories: `src/main/java/com/bank/repository/*.java`
- Entities: `src/main/java/com/bank/entity/*.java`
- DTOs: `src/main/java/com/bank/dto/*.java`
- Config: `src/main/resources/application.properties`
- Build: `pom.xml`

