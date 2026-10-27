--inner join

SELECT c.name, a.account_id, a.balance,
       t.transaction_type, t.amount
FROM customers c
INNER JOIN accounts a ON c.customer_id = a.customer_id
INNER JOIN transactions t ON a.account_id = t.account_id;

--left outer join

SELECT c.name, COUNT(t.transaction_id) AS total_transactions,
       SUM(t.amount) AS total_amount
FROM customers c
RIGHT JOIN accounts a ON c.customer_id = a.customer_id
RIGHT JOIN transactions t ON a.account_id = t.account_id
GROUP BY c.name
ORDER BY total_amount DESC;

--right join

SELECT c.name, a.account_id, a.balance,
       l.loan_type, l.amount AS loan_amount
FROM customers c
RIGHT JOIN accounts a  ON c.customer_id = a.customer_id
RIGHT JOIN loans l     ON c.customer_id = l.customer_id;