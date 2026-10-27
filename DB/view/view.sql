CREATE VIEW customer_transaction_details AS
SELECT c.name,
       t.transaction_type,
       t.amount,
       t.transaction_date
FROM customers c
JOIN accounts a     ON c.customer_id = a.customer_id
JOIN transactions t ON a.account_id  = t.account_id;

--drop view customer_transaction_details;

SELECT * FROM customer_transaction_details;