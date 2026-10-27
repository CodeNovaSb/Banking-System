DROP ROLE IF EXISTS manager;
DROP ROLE IF EXISTS employee;

-- Create manager (admin)
CREATE USER manager WITH PASSWORD 'manager123';

-- Create employee
CREATE USER employee WITH PASSWORD 'emp123';

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO manager;

-- Employee can only view customers
GRANT SELECT ON customers TO employee;

-- Employee can only view accounts
GRANT SELECT ON accounts TO employee;

-- Employee can view and add transactions
GRANT SELECT, INSERT ON transactions TO employee;

-- Employee can only add payments, not view
GRANT INSERT ON payments TO employee;

SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'employee';

SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'manager';

REVOKE INSERT ON transactions FROM employee;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM employee;

DROP USER employee;