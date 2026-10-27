# Banking DBMS SQL Project Documentation

Done by Subehaa SB, M-tech FSD

A complete PostgreSQL-based banking database project that demonstrates core DBMS concepts through practical SQL scripts.

This project covers:
- DDL (schema design with constraints and referential integrity)
- DML (seed/sample data)
- DCL (users, grants, revokes)
- TCL (transactions, commit, rollback, savepoint)
- Views
- Triggers
- Cursors
- Joins
- Subqueries
- ER modeling

---

## 1. Project Overview

The database models a simplified banking system with the following business entities:
- Branches
- Customers
- Employees
- Accounts
- Transactions
- Payments
- Cards
- Loans

The schema enforces data quality and integrity using:
- `PRIMARY KEY`
- `FOREIGN KEY`
- `NOT NULL`
- `UNIQUE`
- `CHECK`
- `DEFAULT`

The scripts are organized by SQL topic and can be run individually or via a master script.

---

## 2. Folder Structure

```text
DB/
├── master.sql
├── ddl/
│   └── schema.sql
├── dml/
│   └── insert_data.sql
├── dcl/
│   └── dcl.sql
├── tcl/
│   └── tcl.sql
├── view/
│   └── view.sql
├── trigger/
│   └── trigger.sql
├── cursor/
│   └── cursor.sql
├── join/
│   └── join.sql
├── subquery/
│   └── subquery.sql
└── er_diagram/
    ├── banking_er_diagram.md
    ├── banking_er_diagram.mermaid
    └── banking_er_diagram.svg
```

---

## 3. Technology and Environment

- Database: PostgreSQL
- Script Runner: `psql` CLI
- SQL Features used:
  - PL/pgSQL (`DO $$`, trigger function)
  - Transaction control statements
  - Role and privilege management

Recommended:
- PostgreSQL 13+
- A database created for this project (example: `Bank_managment_system`)

---

## 4. How to Run the Project

### 4.1 Run Everything in One Command

From inside the `DB` folder:

```bash
psql -U postgres -d Bank_managment_system -f master.sql
```

`master.sql` executes scripts in this order:
1. `ddl/schema.sql`
2. `dml/insert_data.sql`
3. `dcl/dcl.sql`
4. `tcl/tcl.sql`
5. `view/view.sql`
6. `trigger/trigger.sql`
7. `cursor/cursor.sql`
8. `join/join.sql`
9. `subquery/subquery.sql`

### 4.2 Run Script-by-Script (Optional)

```bash
psql -U postgres -d Bank_managment_system -f ddl/schema.sql
psql -U postgres -d Bank_managment_system -f dml/insert_data.sql
psql -U postgres -d Bank_managment_system -f dcl/dcl.sql
psql -U postgres -d Bank_managment_system -f tcl/tcl.sql
psql -U postgres -d Bank_managment_system -f view/view.sql
psql -U postgres -d Bank_managment_system -f trigger/trigger.sql
psql -U postgres -d Bank_managment_system -f cursor/cursor.sql
psql -U postgres -d Bank_managment_system -f join/join.sql
psql -U postgres -d Bank_managment_system -f subquery/subquery.sql
```

---

## 5. Data Model Summary

### 5.1 Entities
- `branches`
- `customers`
- `employees`
- `accounts`
- `transactions`
- `payments`
- `cards`
- `loans`

### 5.2 Core Relationships (1:M)
- One branch -> many accounts
- One branch -> many employees
- One customer -> many accounts
- One customer -> many loans
- One account -> many transactions
- One account -> many payments
- One account -> many cards

### 5.3 Key Constraint Highlights
- `customers.phone` and `customers.email` are unique.
- `accounts.balance >= 0` ensures non-negative balances.
- Domain checks validate fields such as:
  - `account_type` (`Savings`, `Current`, `Fixed`)
  - `transaction_type` (`Debit`, `Credit`, `Transfer`)
  - `payment_type` (`Bill`, `EMI`, `Transfer`, `Utility`)
  - `loan_type` and `employee.role`
- `cards.expiry_date > CURRENT_DATE` ensures future expiry dates.

---

## 6. Script-by-Script Documentation

## 6.1 `ddl/schema.sql`

Purpose:
- Recreates full schema from scratch.
- Drops old tables in FK-safe order.
- Defines all 8 tables with constraints.

Important details:
- Uses `SERIAL` for primary keys.
- Uses `ON DELETE CASCADE` for child tables where dependent cleanup is desired.
- Uses `ON DELETE RESTRICT` where parent deletion should be blocked (e.g., branch with active references).

Best for:
- Fresh initialization before demos/tests.

---

## 6.2 `dml/insert_data.sql`

Purpose:
- Seeds realistic sample records for all tables.

What gets inserted:
- 4 branches
- 7 customers
- 6 employees
- 8 accounts
- 10 transactions
- 6 payments
- 6 cards
- 5 loans

Dataset characteristics:
- Multi-city branch coverage.
- Mixed account types and balances.
- Mixed transaction/payment activity.
- Loan variety across customers.

Best for:
- Running joins, subqueries, and analytical practice.

---

## 6.3 `dcl/dcl.sql`

Purpose:
- Demonstrates role-based access control.

Workflow implemented:
1. Drops old roles (`manager`, `employee`) if present.
2. Creates users with passwords.
3. Grants broad privileges to `manager`.
4. Grants restricted table privileges to `employee`.
5. Shows current grants using `information_schema.role_table_grants`.
6. Revokes selected privileges.
7. Revokes all employee table privileges.
8. Drops `employee` user.

Teaching points:
- Principle of least privilege.
- Difference between `GRANT`, `REVOKE`, and role lifecycle operations.

Note:
- Because the script drops `employee` at the end, this is primarily a demonstration flow.

---

## 6.4 `tcl/tcl.sql`

Purpose:
- Demonstrates transaction management with `BEGIN`, `COMMIT`, `ROLLBACK`, and `SAVEPOINT`.

Scenarios covered:
- Successful transfer transaction (debit one account, credit another, insert transfer payment, commit).
- Full rollback transaction (balance updates rolled back).
- Partial rollback using savepoint:
  - Core transfer executed.
  - Optional fee attempt executed.
  - Rollback to savepoint cancels fee section only.
  - Commit preserves transfer section.
- Additional demo transaction for another account pair.

Teaching points:
- Atomicity and consistency.
- How savepoints allow selective undo.

---

## 6.5 `view/view.sql`

Purpose:
- Creates a reusable derived dataset view.

View created:
- `customer_transaction_details`

Definition behavior:
- Joins `customers`, `accounts`, and `transactions`.
- Exposes customer name, transaction type, amount, and date.

Use case:
- Reporting and simplified query access without rewriting joins.

---

## 6.6 `trigger/trigger.sql`

Purpose:
- Automates account balance updates when new transactions are inserted.

Objects defined:
- Function: `update_balance_on_transaction()`
- Trigger: `trigger_update_balance` (`AFTER INSERT` on `transactions`)

Business logic:
- On `Credit`: adds amount to account balance.
- On `Debit`: subtracts amount from account balance.
- Uses `RAISE NOTICE` logs for step-by-step visibility.

Test included:
- Inserts a debit transaction for account 5 to demonstrate trigger execution.

Important behavior note:
- `Transfer` type exists in schema but is not explicitly handled in trigger logic.
- In current function, only `Credit` and `Debit` branches update balance.

---

## 6.7 `cursor/cursor.sql`

Purpose:
- Demonstrates explicit cursor handling in PL/pgSQL.

Flow:
1. Declares cursor over `customers`.
2. Opens cursor.
3. Fetches rows one by one.
4. Prints each row using `RAISE NOTICE`.
5. Closes cursor.

Teaching points:
- Row-by-row processing in server-side procedural code.

---

## 6.8 `join/join.sql`

Purpose:
- Demonstrates practical join-based analytics.

Queries included:
1. Multi-table `INNER JOIN` across customers, accounts, and transactions.
2. Aggregation query using right joins, grouped by customer name, ordered by total amount.
3. Join including loan data to relate account/customer/loan info.

Learning outcomes:
- Join construction with business relationships.
- Aggregation on joined datasets.
- Result shaping with `GROUP BY` and `ORDER BY`.

---

## 6.9 `subquery/subquery.sql`

Purpose:
- Demonstrates single-level and multi-level subqueries.

Queries included:
1. Accounts whose total transaction amount exceeds overall average transaction amount.
2. Transaction types whose occurrence count is greater than both:
   - minimum transaction-type count
   - average transaction-type count

Learning outcomes:
- `HAVING` with scalar subqueries.
- Nested derived tables for comparative analysis.

---

## 6.10 `master.sql`

Purpose:
- Single-entry orchestration script for end-to-end execution.

Behavior:
- Uses `\i` includes to run all module scripts in sequence.
- Uses `\echo` messages to show execution progress per step.

Best for:
- Repeatable setup and live demonstration.

---

## 6.11 `er_diagram/` Files

- `banking_er_diagram.mermaid`: Mermaid source for ER structure.
- `banking_er_diagram.md`: Human-readable ER documentation with attribute tables and relationship summary.
- `banking_er_diagram.svg`: Rendered visual ER diagram asset.

---

## 7. Quick Verification Queries

Run these after setup to validate core behavior:

```sql
-- Row counts
SELECT 'branches' AS table_name, COUNT(*) FROM branches
UNION ALL SELECT 'customers', COUNT(*) FROM customers
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'accounts', COUNT(*) FROM accounts
UNION ALL SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'cards', COUNT(*) FROM cards
UNION ALL SELECT 'loans', COUNT(*) FROM loans;
```

```sql
-- Validate view
SELECT *
FROM customer_transaction_details
ORDER BY transaction_date DESC
LIMIT 10;
```

```sql
-- Check account balances after transaction demos
SELECT account_id, balance
FROM accounts
ORDER BY account_id;
```

---

## 8. Expected Learning Outcomes

By studying/running this project, you practice:
- End-to-end relational database design.
- Constraint-driven schema quality.
- Seed data loading patterns.
- Access control through SQL privileges.
- Transaction safety and partial rollback.
- Data abstraction through views.
- Event-driven updates via triggers.
- Procedural SQL with cursors.
- Complex retrieval with joins and subqueries.

---

## 9. Notes and Considerations

- Project scripts are written for PostgreSQL syntax and behavior.
- Running `schema.sql` resets (drops and recreates) all project tables.
- Running `dcl.sql` drops the `employee` user at the end (demo lifecycle).
- Trigger logic currently handles `Credit` and `Debit`; `Transfer` rows are logged but not balance-adjusted by trigger function.
- The ER markdown includes terms like `AUTO_INCREMENT` and `CURDATE()` for conceptual readability; actual implementation in SQL scripts uses PostgreSQL constructs (`SERIAL`, `CURRENT_DATE`).

---

## 10. Suggested Improvements (Optional)

- Add indexes for high-frequency query columns (`account_id`, `customer_id`, `branch_id`, `transaction_date`).
- Add a transfer-specific trigger branch to support dual-account transfer handling.
- Add audit tables for DCL/TCL operations.
- Add stored procedures for standardized transfer workflows.
- Add automated test scripts to assert expected balances after TCL scenarios.

---

## 11. License / Usage

This project appears to be an educational DBMS learning implementation. You can adapt this structure for labs, demonstrations, and practice projects.

If you plan production use, add:
- stronger security policy
- migration/versioning strategy
- backup/restore plan
- performance benchmarks and indexing policy
