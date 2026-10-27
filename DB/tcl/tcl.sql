-- Add two accounts with some balance
-- INSERT INTO accounts (account_id, customer_id, account_type, balance, branch_id)
-- VALUES (1, 1, 'SAVINGS', 10000.00, 1);

-- INSERT INTO accounts (account_id, customer_id, account_type, balance, branch_id)
-- VALUES (2, 2, 'SAVINGS', 5000.00, 1);

SELECT account_id, balance FROM accounts;

--first transaction

BEGIN;

INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (1, 'Debit', 5000, CURRENT_DATE);

INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (2, 'Credit', 5000, CURRENT_DATE);

INSERT INTO payments (account_id, payment_type, amount, payment_date)
VALUES (1, 'Transfer', 5000, CURRENT_DATE);

COMMIT;

-- SELECT * FROM transactions;
-- SELECT * FROM payments;

--ROLLBACK;

--second transaction

BEGIN;

INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (1, 'Debit', 5000, CURRENT_DATE);

INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (2, 'Credit', 5000, CURRENT_DATE);

ROLLBACK;

SELECT account_id, balance FROM accounts;

--third transaction 
BEGIN;

-- Record in transactions
INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (1, 'Debit', 5000, CURRENT_DATE);

INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (2, 'Credit', 5000, CURRENT_DATE);

-- Record transfer in payments using correct value 'Transfer'
INSERT INTO payments (account_id, payment_type, amount, payment_date)
VALUES (1, 'Transfer', 5000, CURRENT_DATE);

-- Create savepoint after transfer is done
SAVEPOINT transfer_done;

-- Now try to charge fee, using 'Utility' as payment_type
INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (1, 'Debit', 200, CURRENT_DATE);

INSERT INTO payments (account_id, payment_type, amount, payment_date)
VALUES (1, 'Utility', 200, CURRENT_DATE);

-- Fee system failed, cancel only the fee part
ROLLBACK TO transfer_done;

-- Save only the transfer part
COMMIT;

SELECT account_id, balance FROM accounts;

SELECT * FROM payments;

ROLLBACK;


--demo

--third transaction 
BEGIN;

-- Record in transactions
INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (3, 'Debit', 5000, CURRENT_DATE);

INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (4, 'Credit', 5000, CURRENT_DATE);

-- Record transfer in payments using correct value 'Transfer'
INSERT INTO payments (account_id, payment_type, amount, payment_date)
VALUES (3, 'Transfer', 5000, CURRENT_DATE);

-- Create savepoint after transfer is done
SAVEPOINT transfer_done;

-- Now try to charge fee, using 'Utility' as payment_type
INSERT INTO transactions (account_id, transaction_type, amount, transaction_date)
VALUES (3, 'Debit', 200, CURRENT_DATE);

INSERT INTO payments (account_id, payment_type, amount, payment_date)
VALUES (3, 'Utility', 200, CURRENT_DATE);

-- Fee system failed, cancel only the fee part
ROLLBACK TO transfer_done;

-- Save only the transfer part
COMMIT;





