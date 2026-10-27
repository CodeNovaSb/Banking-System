# 🏦 Banking System — ER Diagram (Refined)

> **8 Entities · 40+ Attributes · 7 Relationships**  
> Constraints: PRIMARY KEY · FOREIGN KEY · UNIQUE · NOT NULL · CHECK

---

## 📐 Entity-Relationship Overview

```
CUSTOMERS ──< ACCOUNTS >── BRANCHES
    │              │
    │              ├──< TRANSACTIONS
    │              ├──< PAYMENTS
    │              └──< CARDS
    │
    └──< LOANS

BRANCHES ──< EMPLOYEES
```

---

## 🗂️ Entities & Attributes

---

### 1. CUSTOMERS

> Stores personal information about bank customers.

| Column        | Data Type      | Constraints                     |
|---------------|----------------|---------------------------------|
| `customer_id` | INT            | **PK**, NOT NULL, AUTO_INCREMENT |
| `name`        | VARCHAR(100)   | NOT NULL                        |
| `dob`         | DATE           | NOT NULL, CHECK (dob < CURDATE()) |
| `gender`      | VARCHAR(10)    | CHECK (gender IN ('Male','Female','Other')) |
| `phone`       | VARCHAR(15)    | UNIQUE, NOT NULL                |
| `email`       | VARCHAR(100)   | UNIQUE, NOT NULL                |
| `address`     | TEXT           | —                               |

---

### 2. BRANCHES

> Represents physical bank branches.

| Column        | Data Type      | Constraints                     |
|---------------|----------------|---------------------------------|
| `branch_id`   | INT            | **PK**, NOT NULL, AUTO_INCREMENT |
| `branch_name` | VARCHAR(100)   | NOT NULL                        |
| `city`        | VARCHAR(50)    | NOT NULL                        |

---

### 3. ACCOUNTS

> Links customers to branches; holds account financial details.

| Column          | Data Type       | Constraints                                        |
|-----------------|-----------------|----------------------------------------------------|
| `account_id`    | INT             | **PK**, NOT NULL, AUTO_INCREMENT                   |
| `customer_id`   | INT             | **FK** → CUSTOMERS(customer_id), NOT NULL          |
| `branch_id`     | INT             | **FK** → BRANCHES(branch_id), NOT NULL             |
| `account_type`  | VARCHAR(20)     | NOT NULL, CHECK (account_type IN ('Savings','Current','Fixed')) |
| `balance`       | DECIMAL(12,2)   | NOT NULL, CHECK (balance >= 0), DEFAULT 0.00       |
| `created_date`  | DATE            | NOT NULL, DEFAULT CURDATE()                        |

---

### 4. TRANSACTIONS

> Records all debit/credit operations on an account.

| Column             | Data Type      | Constraints                                              |
|--------------------|----------------|----------------------------------------------------------|
| `transaction_id`   | INT            | **PK**, NOT NULL, AUTO_INCREMENT                         |
| `account_id`       | INT            | **FK** → ACCOUNTS(account_id), NOT NULL                  |
| `transaction_type` | VARCHAR(20)    | NOT NULL, CHECK (transaction_type IN ('Debit','Credit','Transfer')) |
| `amount`           | DECIMAL(12,2)  | NOT NULL, CHECK (amount > 0)                             |
| `transaction_date` | DATETIME       | NOT NULL, DEFAULT NOW()                                  |

---

### 5. EMPLOYEES

> Stores staff information tied to specific branches.

| Column        | Data Type      | Constraints                              |
|---------------|----------------|------------------------------------------|
| `employee_id` | INT            | **PK**, NOT NULL, AUTO_INCREMENT          |
| `name`        | VARCHAR(100)   | NOT NULL                                 |
| `role`        | VARCHAR(50)    | NOT NULL, CHECK (role IN ('Manager','Teller','Analyst','Support')) |
| `branch_id`   | INT            | **FK** → BRANCHES(branch_id), NOT NULL   |
| `salary`      | DECIMAL(10,2)  | NOT NULL, CHECK (salary > 0)             |

---

### 6. LOANS

> Tracks loan records associated with customers.

| Column          | Data Type      | Constraints                                    |
|-----------------|----------------|------------------------------------------------|
| `loan_id`       | INT            | **PK**, NOT NULL, AUTO_INCREMENT               |
| `customer_id`   | INT            | **FK** → CUSTOMERS(customer_id), NOT NULL      |
| `loan_type`     | VARCHAR(50)    | NOT NULL, CHECK (loan_type IN ('Home','Car','Personal','Education')) |
| `amount`        | DECIMAL(12,2)  | NOT NULL, CHECK (amount > 0)                   |
| `interest_rate` | DECIMAL(5,2)   | NOT NULL, CHECK (interest_rate BETWEEN 0 AND 100) |
| `start_date`    | DATE           | NOT NULL, DEFAULT CURDATE()                    |

---

### 7. PAYMENTS

> Records payments made from accounts (bills, EMIs, etc.).

| Column         | Data Type      | Constraints                                              |
|----------------|----------------|----------------------------------------------------------|
| `payment_id`   | INT            | **PK**, NOT NULL, AUTO_INCREMENT                         |
| `account_id`   | INT            | **FK** → ACCOUNTS(account_id), NOT NULL                  |
| `payment_type` | VARCHAR(50)    | NOT NULL, CHECK (payment_type IN ('Bill','EMI','Transfer','Utility')) |
| `amount`       | DECIMAL(12,2)  | NOT NULL, CHECK (amount > 0)                             |
| `payment_date` | DATE           | NOT NULL, DEFAULT CURDATE()                              |

---

### 8. CARDS

> Stores debit/credit card info linked to accounts.

| Column       | Data Type    | Constraints                                      |
|--------------|--------------|--------------------------------------------------|
| `card_id`    | INT          | **PK**, NOT NULL, AUTO_INCREMENT                 |
| `account_id` | INT          | **FK** → ACCOUNTS(account_id), NOT NULL          |
| `card_type`  | VARCHAR(20)  | NOT NULL, CHECK (card_type IN ('Debit','Credit')) |
| `expiry_date`| DATE         | NOT NULL, CHECK (expiry_date > CURDATE())         |

---

## 🔗 Relationships & Cardinality

| Relationship               | From Entity  | To Entity      | Cardinality | Description                                          |
|----------------------------|--------------|----------------|-------------|------------------------------------------------------|
| **has**                    | CUSTOMERS    | ACCOUNTS       | 1 : M       | One customer can hold multiple accounts              |
| **belongs to**             | ACCOUNTS     | BRANCHES       | M : 1       | Many accounts belong to one branch                  |
| **works at**               | EMPLOYEES    | BRANCHES       | M : 1       | Many employees work at one branch                   |
| **has**                    | ACCOUNTS     | TRANSACTIONS   | 1 : M       | One account can have many transactions               |
| **has**                    | ACCOUNTS     | PAYMENTS       | 1 : M       | One account can have many payments                   |
| **has**                    | ACCOUNTS     | CARDS          | 1 : M       | One account can have multiple cards                  |
| **takes**                  | CUSTOMERS    | LOANS          | 1 : M       | One customer can take multiple loans                 |

---

## 📊 Cardinality Summary

```
CUSTOMERS  ───(1)────────────(M)───  ACCOUNTS
BRANCHES   ───(1)────────────(M)───  ACCOUNTS
BRANCHES   ───(1)────────────(M)───  EMPLOYEES
ACCOUNTS   ───(1)────────────(M)───  TRANSACTIONS
ACCOUNTS   ───(1)────────────(M)───  PAYMENTS
ACCOUNTS   ───(1)────────────(M)───  CARDS
CUSTOMERS  ───(1)────────────(M)───  LOANS
```

> ⚠️ No M:N (Many-to-Many) relationships exist in this schema.  
> All relationships are **1-to-Many (1:M)** with FK enforcement.

---

## 🔒 Constraint Legend

| Symbol | Meaning |
|--------|---------|
| **PK** | PRIMARY KEY — uniquely identifies each row |
| **FK** | FOREIGN KEY — enforces referential integrity |
| **UNIQUE** | No duplicate values allowed in the column |
| **NOT NULL** | Column must always have a value |
| **CHECK** | Column must satisfy a specific condition |
| **DEFAULT** | Value applied automatically if none is given |
| **AUTO_INCREMENT** | Integer auto-generated on each insert |

---

## 🧩 Schema Summary

```sql
-- Key FKs at a glance
ACCOUNTS.customer_id     → CUSTOMERS.customer_id
ACCOUNTS.branch_id       → BRANCHES.branch_id
TRANSACTIONS.account_id  → ACCOUNTS.account_id
PAYMENTS.account_id      → ACCOUNTS.account_id
CARDS.account_id         → ACCOUNTS.account_id
LOANS.customer_id        → CUSTOMERS.customer_id
EMPLOYEES.branch_id      → BRANCHES.branch_id
```

---

*Generated from Banking System ER Diagram — Refined with full constraints and cardinality.*
