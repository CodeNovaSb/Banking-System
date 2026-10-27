
-- Drop tables in reverse FK order (children first, parents last)
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS branches CASCADE;

-- 2. BRANCHES
CREATE TABLE branches (
    branch_id     SERIAL          PRIMARY KEY,
    branch_name   VARCHAR(100)    NOT NULL,
    city          VARCHAR(50)     NOT NULL
);

-- 1. CUSTOMERS
CREATE TABLE customers (
    customer_id   SERIAL          PRIMARY KEY,
    name          VARCHAR(100)    NOT NULL,
    dob           DATE            NOT NULL CHECK (dob < CURRENT_DATE),
    gender        VARCHAR(10)     CHECK (gender IN ('Male', 'Female', 'Other')),
    phone         VARCHAR(15)     NOT NULL UNIQUE,
    email         VARCHAR(100)    NOT NULL UNIQUE,
    address       TEXT
);

-- 5. EMPLOYEES
CREATE TABLE employees (
    employee_id   SERIAL          PRIMARY KEY,
    name          VARCHAR(100)    NOT NULL,
    role          VARCHAR(50)     NOT NULL CHECK (role IN ('Manager', 'Teller', 'Analyst', 'Support')),
    branch_id     INT             NOT NULL REFERENCES branches(branch_id) ON DELETE RESTRICT,
    salary        DECIMAL(10,2)   NOT NULL CHECK (salary > 0)
);

-- 3. ACCOUNTS
CREATE TABLE accounts (
    account_id    SERIAL          PRIMARY KEY,
    customer_id   INT             NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    branch_id     INT             NOT NULL REFERENCES branches(branch_id) ON DELETE RESTRICT,
    account_type  VARCHAR(20)     NOT NULL CHECK (account_type IN ('Savings', 'Current', 'Fixed')),
    balance       DECIMAL(12,2)   NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    created_date  DATE            NOT NULL DEFAULT CURRENT_DATE
);

-- 4. TRANSACTIONS
CREATE TABLE transactions (
    transaction_id    SERIAL          PRIMARY KEY,
    account_id        INT             NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    transaction_type  VARCHAR(20)     NOT NULL CHECK (transaction_type IN ('Debit', 'Credit', 'Transfer')),
    amount            DECIMAL(12,2)   NOT NULL CHECK (amount > 0),
    transaction_date  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 7. PAYMENTS
CREATE TABLE payments (
    payment_id    SERIAL          PRIMARY KEY,
    account_id    INT             NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    payment_type  VARCHAR(50)     NOT NULL CHECK (payment_type IN ('Bill', 'EMI', 'Transfer', 'Utility')),
    amount        DECIMAL(12,2)   NOT NULL CHECK (amount > 0),
    payment_date  DATE            NOT NULL DEFAULT CURRENT_DATE
);

-- 8. CARDS
CREATE TABLE cards (
    card_id       SERIAL          PRIMARY KEY,
    account_id    INT             NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    card_type     VARCHAR(20)     NOT NULL CHECK (card_type IN ('Debit', 'Credit')),
    expiry_date   DATE            NOT NULL CHECK (expiry_date > CURRENT_DATE)
);

-- 6. LOANS
CREATE TABLE loans (
    loan_id         SERIAL          PRIMARY KEY,
    customer_id     INT             NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    loan_type       VARCHAR(50)     NOT NULL CHECK (loan_type IN ('Home', 'Car', 'Personal', 'Education')),
    amount          DECIMAL(12,2)   NOT NULL CHECK (amount > 0),
    interest_rate   DECIMAL(5,2)    NOT NULL CHECK (interest_rate BETWEEN 0 AND 100),
    start_date      DATE            NOT NULL DEFAULT CURRENT_DATE
);
