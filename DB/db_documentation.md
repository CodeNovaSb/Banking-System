# Banking Syetem Project Documentation
Done by Subehaa SB, M-tech FSD

## 1. Document Control
- Document: Database Technical Documentation
- Project: Banking System
- Repository Root: DB
- Database Platform: PostgreSQL
- Scope: Full analysis of project structure, all SQL scripts, and ER artifacts

## 2. Executive Summary
This project implements a normalized relational banking schema and a complete set of SQL modules demonstrating core DBMS capabilities:
- DDL: schema definition and integrity constraints
- DML: seed data population
- DCL: role and privilege management
- TCL: transactional behavior (commit, rollback, savepoint)
- View: reusable reporting abstraction
- Trigger: automated balance maintenance on transaction insert
- Cursor: row-wise procedural iteration
- Joins and subqueries: analytical query examples
- ER artifacts: conceptual and logical relationship representation

The codebase is suitable for academic and training usage, and can be hardened further for production-like environments.

## 3. Project Structure

```text
DB/
|-- master.sql
|-- README.md
|-- db_documentation.md
|-- ddl/
|   `-- schema.sql
|-- dml/
|   `-- insert_data.sql
|-- dcl/
|   `-- dcl.sql
|-- tcl/
|   `-- tcl.sql
|-- view/
|   `-- view.sql
|-- trigger/
|   `-- trigger.sql
|-- cursor/
|   `-- cursor.sql
|-- join/
|   `-- join.sql
|-- subquery/
|   `-- subquery.sql
`-- er_diagram/
    |-- banking_er_diagram.md
    `-- banking_er_diagram.mermaid
```

## 4. Runtime and Execution Model

### 4.1 Primary Execution Entry Point
`master.sql` orchestrates all modules in this sequence:
1. Schema creation (`ddl/schema.sql`)
2. Seed data insert (`dml/insert_data.sql`)
3. Role and privileges (`dcl/dcl.sql`)
4. View creation (`view/view.sql`)
5. Trigger creation (`trigger/trigger.sql`)
6. Session flag on (`SET bank.enable_balance_trigger = 'on'`)
7. TCL demonstrations (`tcl/tcl.sql`)
8. Session flag off (`SET bank.enable_balance_trigger = 'off'`)
9. Cursor demo (`cursor/cursor.sql`)
10. Join queries (`join/join.sql`)
11. Subquery demos (`subquery/subquery.sql`)

### 4.2 Important Cross-Module Dependency
The trigger function checks a session setting (`bank.enable_balance_trigger`) and executes balance updates only if the value is `on`. Running `tcl/tcl.sql` directly without setting this flag means transaction inserts will not mutate account balances through the trigger.

## 5. Data Model

### 5.1 Core Entities
- `branches`
- `customers`
- `employees`
- `accounts`
- `transactions`
- `payments`
- `cards`
- `loans`

## 6. Schema Dictionary (DDL)

Source: `ddl/schema.sql`

### 6.1 Table: branches
- `branch_id SERIAL PRIMARY KEY`
- `branch_name VARCHAR(100) NOT NULL`
- `city VARCHAR(50) NOT NULL`

### 6.2 Table: customers
- `customer_id SERIAL PRIMARY KEY`
- `name VARCHAR(100) NOT NULL`
- `dob DATE NOT NULL CHECK (dob < CURRENT_DATE)`
- `gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other'))`
- `phone VARCHAR(15) NOT NULL UNIQUE`
- `email VARCHAR(100) NOT NULL UNIQUE`
- `address TEXT`

### 6.3 Table: employees
- `employee_id SERIAL PRIMARY KEY`
- `name VARCHAR(100) NOT NULL`
- `role VARCHAR(50) NOT NULL CHECK (role IN ('Manager', 'Teller', 'Analyst', 'Support'))`
- `branch_id INT NOT NULL REFERENCES branches(branch_id) ON DELETE RESTRICT`
- `salary DECIMAL(10,2) NOT NULL CHECK (salary > 0)`

### 6.4 Table: accounts
- `account_id SERIAL PRIMARY KEY`
- `customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE`
- `branch_id INT NOT NULL REFERENCES branches(branch_id) ON DELETE RESTRICT`
- `account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('Savings', 'Current', 'Fixed'))`
- `balance DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0)`
- `created_date DATE NOT NULL DEFAULT CURRENT_DATE`

### 6.5 Table: transactions
- `transaction_id SERIAL PRIMARY KEY`
- `account_id INT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE`
- `transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('Debit', 'Credit', 'Transfer'))`
- `amount DECIMAL(12,2) NOT NULL CHECK (amount > 0)`
- `transaction_date TIMESTAMP NOT NULL DEFAULT NOW()`

### 6.6 Table: payments
- `payment_id SERIAL PRIMARY KEY`
- `account_id INT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE`
- `payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('Bill', 'EMI', 'Transfer', 'Utility'))`
- `amount DECIMAL(12,2) NOT NULL CHECK (amount > 0)`
- `payment_date DATE NOT NULL DEFAULT CURRENT_DATE`

### 6.7 Table: cards
- `card_id SERIAL PRIMARY KEY`
- `account_id INT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE`
- `card_type VARCHAR(20) NOT NULL CHECK (card_type IN ('Debit', 'Credit'))`
- `expiry_date DATE NOT NULL CHECK (expiry_date > CURRENT_DATE)`

### 6.8 Table: loans
- `loan_id SERIAL PRIMARY KEY`
- `customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE`
- `loan_type VARCHAR(50) NOT NULL CHECK (loan_type IN ('Home', 'Car', 'Personal', 'Education'))`
- `amount DECIMAL(12,2) NOT NULL CHECK (amount > 0)`
- `interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate BETWEEN 0 AND 100)`
- `start_date DATE NOT NULL DEFAULT CURRENT_DATE`

### 6.9 Table Drop Strategy
The script drops tables in reverse dependency order with `CASCADE` to ensure idempotent recreation.

## 7. Seed Data Documentation (DML)

Source: `dml/insert_data.sql`

### 7.1 Insert Statements and Purpose
1. Insert into `branches`: defines four branch records across major cities.
2. Insert into `customers`: defines seven customers with unique phone and email values.
3. Insert into `employees`: defines six employees mapped to valid branches and constrained roles.
4. Insert into `accounts`: defines eight accounts with mixed account types and opening balances.
5. Insert into `transactions`: defines ten sample transactions using Credit, Debit, and Transfer.
6. Insert into `payments`: defines six sample payment records across payment types.
7. Insert into `cards`: defines six cards with valid future expiry dates.
8. Insert into `loans`: defines five customer loan records across loan categories.

### 7.2 Data Quality Notes
- Insert values respect check constraints and FK constraints.
- Account 1 has multiple transactions of different types, useful for query demos.
- Transfer transactions are present in seed data; trigger behavior for `Transfer` type is discussed in section 10.

## 8. Access Control Documentation (DCL)

Source: `dcl/dcl.sql`

### 8.1 Query-by-Query Breakdown
1. `DROP ROLE IF EXISTS manager;`
   - Clears existing manager role for deterministic rerun.
2. `DROP ROLE IF EXISTS employee;`
   - Clears existing employee role for deterministic rerun.
3. `CREATE USER manager WITH PASSWORD 'manager123';`
   - Creates manager principal.
4. `CREATE USER employee WITH PASSWORD 'emp123';`
   - Creates employee principal.
5. `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO manager;`
   - Full table privileges for manager role.
6. `GRANT SELECT ON customers TO employee;`
   - Employee can read customer records.
7. `GRANT SELECT ON accounts TO employee;`
   - Employee can read account records.
8. `GRANT SELECT, INSERT ON transactions TO employee;`
   - Employee can read and add transactions.
9. `GRANT INSERT ON payments TO employee;`
   - Employee can insert payments only.
10. Query against `information_schema.role_table_grants` for employee.
   - Verifies effective grants.
11. Query against `information_schema.role_table_grants` for manager.
   - Verifies effective grants.
12. `REVOKE INSERT ON transactions FROM employee;`
   - Removes transaction insert ability.
13. `REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM employee;`
   - Removes all table privileges from employee.
14. `DROP USER employee;`
   - Removes employee role at script end.

### 8.2 Operational Caveat
Since employee is dropped at script end, this script demonstrates grant/revoke lifecycle rather than preserving an operational RBAC state.

## 9. View Layer Documentation

Source: `view/view.sql`

### 9.1 View Definition
`CREATE VIEW customer_transaction_details AS ...`
- Joins `customers`, `accounts`, and `transactions`
- Exposes `name`, `transaction_type`, `amount`, `transaction_date`

### 9.2 Query-by-Query Breakdown
1. `CREATE VIEW customer_transaction_details AS ...`
   - Creates reusable reporting projection.
2. `SELECT * FROM customer_transaction_details;`
   - Validation/readback query to inspect view output.
3. `--drop view customer_transaction_details;`
   - Commented optional cleanup statement.

### 9.3 Use Cases
- Quick transaction reporting by customer.
- Simplifies analytical queries by abstracting join complexity.

## 10. Trigger Layer Documentation

Source: `trigger/trigger.sql`

### 10.1 Function Definition
`CREATE OR REPLACE FUNCTION update_balance_on_transaction() RETURNS TRIGGER`

Function logic:
1. Reads session flag via `current_setting('bank.enable_balance_trigger', true)`.
2. If flag is not `on`, exits with `RETURN NEW` (no balance mutation).
3. Fetches current account balance.
4. For `Credit`, adds amount to balance.
5. For `Debit`, subtracts amount from balance.
6. Emits `RAISE NOTICE` logs for observability.
7. Returns inserted row.

### 10.2 Trigger Definition
`CREATE TRIGGER trigger_update_balance AFTER INSERT ON transactions FOR EACH ROW EXECUTE FUNCTION update_balance_on_transaction();`

### 10.3 Behavior and Limitations
- Trigger is session-controlled and disabled by default unless flag set.
- `Transfer` transaction type is allowed in schema but has no explicit branch in trigger logic.
- Debit branch does not currently prevent balance from becoming negative before `accounts.balance >= 0` check is enforced by table constraint.

## 11. Transaction Control Documentation (TCL)

Source: `tcl/tcl.sql`

This script demonstrates transactional semantics through multiple blocks.

### 11.1 Pre-check Query
1. `SELECT account_id, balance FROM accounts;`
   - Baseline balance view before transactions.

### 11.2 First Transaction Block (Commit Scenario)
1. `BEGIN;`
2. Insert debit transaction for account 1.
3. Insert credit transaction for account 2.
4. Insert transfer payment for account 1.
5. `COMMIT;`

Expected effect:
- If trigger enabled, account 1 decreases and account 2 increases by 5000.
- Payment row persists.

### 11.3 Second Transaction Block (Rollback Scenario)
1. `BEGIN;`
2. Insert debit transaction for account 1.
3. Insert credit transaction for account 2.
4. `ROLLBACK;`
5. `SELECT account_id, balance FROM accounts;`

Expected effect:
- Both inserted transactions are rolled back.
- No lasting balance changes from this block.

### 11.4 Third Transaction Block (Savepoint Scenario)
1. `BEGIN;`
2. Insert debit transaction for account 1.
3. Insert credit transaction for account 2.
4. Insert transfer payment for account 1.
5. `SAVEPOINT transfer_done;`
6. Insert fee debit transaction (account 1, amount 200).
7. Insert utility payment (account 1, amount 200).
8. `ROLLBACK TO transfer_done;`
9. `COMMIT;`
10. `SELECT account_id, balance FROM accounts;`
11. `SELECT * FROM payments;`
12. `ROLLBACK;` (outside active transaction; generally no-op with warning)

Expected effect:
- Transfer portion persists.
- Fee portion is canceled.

### 11.5 Demo Transaction Block (Accounts 3 and 4)
1. `BEGIN;`
2. Debit account 3 by 5000.
3. Credit account 4 by 5000.
4. Insert transfer payment for account 3.
5. `SAVEPOINT transfer_done;`
6. Insert fee debit/payment for account 3.
7. `ROLLBACK TO transfer_done;`
8. `COMMIT;`

Expected effect mirrors section 11.4.

## 12. Cursor Documentation

Source: `cursor/cursor.sql`

### 12.1 Block Behavior
Anonymous PL/pgSQL block using explicit cursor:
1. Declare cursor over `SELECT customer_id, name FROM customers`.
2. Declare variables `v_id`, `v_name`.
3. Open cursor.
4. Loop with `FETCH` one row at a time.
5. Exit when no row found.
6. Emit each row using `RAISE NOTICE`.
7. Close cursor.

### 12.2 Practical Purpose
Demonstrates row-by-row server-side iteration for procedural workflows.

## 13. Join Query Documentation

Source: `join/join.sql`

### 13.1 Query 1: Inner Join (Customers -> Accounts -> Transactions)
```sql
SELECT c.name, a.account_id, a.balance,
       t.transaction_type, t.amount
FROM customers c
INNER JOIN accounts a ON c.customer_id = a.customer_id
INNER JOIN transactions t ON a.account_id = t.account_id;
```
Purpose:
- Returns only matched records across all three tables.
- Useful for transaction-level customer activity reports.

### 13.2 Query 2: Right Joins with Aggregation
```sql
SELECT c.name, COUNT(t.transaction_id) AS total_transactions,
       SUM(t.amount) AS total_amount
FROM customers c
RIGHT JOIN accounts a ON c.customer_id = a.customer_id
RIGHT JOIN transactions t ON a.account_id = t.account_id
GROUP BY c.name
ORDER BY total_amount DESC;
```
Purpose:
- Aggregates transaction count and amount by customer name.
- Right joins force retention of right-side rows where relationship exists.

Observation:
- In this schema, accounts require customers and transactions require accounts, so inner join could produce equivalent data in normal states.

### 13.3 Query 3: Right Join with Loans
```sql
SELECT c.name, a.account_id, a.balance,
       l.loan_type, l.amount AS loan_amount
FROM customers c
RIGHT JOIN accounts a  ON c.customer_id = a.customer_id
RIGHT JOIN loans l     ON c.customer_id = l.customer_id;
```
Purpose:
- Combines customer account details with loan details.

Observation:
- Join path can multiply rows if customer has multiple accounts and loans.
- Depending on reporting intent, this may need deduplication or aggregation.

## 14. Subquery Documentation

Source: `subquery/subquery.sql`

### 14.1 Query 1: Accounts Above Global Average Transaction Amount
```sql
SELECT account_id, SUM(amount) AS total_amount
FROM transactions
GROUP BY account_id
HAVING SUM(amount) > (
    SELECT AVG(amount)
    FROM transactions
)
ORDER BY total_amount DESC;
```
Purpose:
- Computes total transaction amount per account and retains accounts exceeding global average single-transaction amount.

Note:
- Compares grouped sum against average of individual transactions; this is valid but semantically distinct from comparing against average account total.

### 14.2 Query 2: Transaction Types Above Min and Average Frequency
```sql
SELECT transaction_type, COUNT(*) AS txn_count
FROM transactions
GROUP BY transaction_type
HAVING COUNT(*) > (SELECT MIN(cnt)
                   FROM (SELECT transaction_type, COUNT(*) AS cnt
                         FROM transactions
                         GROUP BY transaction_type) AS sub1)
AND    COUNT(*) > (SELECT AVG(cnt)
                   FROM (SELECT transaction_type, COUNT(*) AS cnt
                         FROM transactions
                         GROUP BY transaction_type) AS sub2);
```
Purpose:
- Returns transaction types whose count exceeds both the minimum type frequency and average type frequency.

## 15. Master Script Documentation

Source: `master.sql`

### 15.1 Query-by-Query Controls
- `\echo` statements provide operator-friendly progress markers.
- `\i` include commands modularize script execution.
- `SET bank.enable_balance_trigger = 'on'` enables trigger updates for the TCL phase.
- `SET bank.enable_balance_trigger = 'off'` restores disabled mode after TCL.

### 15.2 Repeatability
Designed for clean reruns due to schema drop/recreate and deterministic module ordering.

## 16. ER Diagram Detailed Interpretation

Source: `er_diagram/banking_er_diagram.mermaid`

### 16.1 Entity Definitions
The Mermaid file includes all eight entities and marks key attributes:
- `PK` for primary keys
- `FK` for foreign keys
- `UK` for unique attributes in customers (`phone`, `email`)

### 16.2 Relationship Definitions
- `CUSTOMERS ||--o{ ACCOUNTS : "has"`
- `BRANCHES ||--o{ ACCOUNTS : "belongs to"`
- `BRANCHES ||--o{ EMPLOYEES : "works at"`
- `ACCOUNTS ||--o{ TRANSACTIONS : "has"`
- `ACCOUNTS ||--o{ PAYMENTS : "has"`
- `ACCOUNTS ||--o{ CARDS : "has"`
- `CUSTOMERS ||--o{ LOANS : "takes"`

These map accurately to foreign keys defined in `ddl/schema.sql`.

## 17. Constraints and Integrity Coverage

### 17.1 Referential Integrity
All child tables reference parents using FK constraints with explicit delete policies:
- `ON DELETE CASCADE` for dependent transactional artifacts
- `ON DELETE RESTRICT` for branch links where historical/organizational integrity is preferred

### 17.2 Domain Integrity
Check constraints enforce controlled vocabularies and numeric positivity/ranges.

### 17.3 Entity Integrity
Every table has a primary key.

## 18. Security Posture Summary

Current state after full master run:
- `manager` exists with broad table privileges.
- `employee` is dropped by `dcl.sql` and does not persist.

Industry recommendation:
- Move credentials to secure secrets handling.
- Avoid plain text password literals in committed scripts.
- Keep stable runtime roles instead of dropping demo users in production-like environments.

## 19. Operational and Design Observations

1. Trigger toggle behavior is intentional for controlled demonstrations but should be documented for operators.
2. Trigger does not implement `Transfer` handling explicitly; resulting balance behavior depends on intended accounting model.
3. TCL script includes a final `ROLLBACK` outside transaction scope; harmless but noisy.
4. ER markdown file mixes MySQL language in a PostgreSQL project; align terminology for consistency.

## 20. Verification Queries

```sql
SELECT 'branches' AS table_name, COUNT(*) AS row_count FROM branches
UNION ALL SELECT 'customers', COUNT(*) FROM customers
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'accounts', COUNT(*) FROM accounts
UNION ALL SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'cards', COUNT(*) FROM cards
UNION ALL SELECT 'loans', COUNT(*) FROM loans;
```

```sql
SELECT account_id, balance
FROM accounts
ORDER BY account_id;
```

```sql
SELECT *
FROM customer_transaction_details
ORDER BY transaction_date DESC
LIMIT 20;
```

## 21. File-by-File Purpose Matrix

| File | Primary Purpose | Category |
|---|---|---|
| `master.sql` | Orchestrates full run sequence | Control |
| `ddl/schema.sql` | Defines and recreates schema | DDL |
| `dml/insert_data.sql` | Inserts sample data | DML |
| `dcl/dcl.sql` | Demonstrates grants/revokes and role lifecycle | DCL |
| `tcl/tcl.sql` | Demonstrates commit/rollback/savepoint scenarios | TCL |
| `view/view.sql` | Creates reporting view and verifies output | View |
| `trigger/trigger.sql` | Creates balance update trigger function and trigger | Trigger |
| `cursor/cursor.sql` | Demonstrates cursor-based row iteration | PL/pgSQL |
| `join/join.sql` | Demonstrates join and aggregate query patterns | Querying |
| `subquery/subquery.sql` | Demonstrates scalar and nested subqueries | Querying |
| `er_diagram/banking_er_diagram.md` | Human-readable ER documentation | Modeling |
| `er_diagram/banking_er_diagram.mermaid` | Source ER model for rendering | Modeling |
| `README.md` | Existing project overview and run guide | Documentation |

## 22. Conclusion
The project is well-structured for DBMS concept demonstration with strong baseline schema integrity and clear modular separation. The included SQL modules collectively cover foundational database engineering workflows. With minor hardening in security, trigger semantics, and operational conventions, the project can be elevated from training-grade to production-pattern reference quality.
