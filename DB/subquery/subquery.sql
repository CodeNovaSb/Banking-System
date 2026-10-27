--single subquery
--Query 3 — Accounts whose total transaction amount is above the overall
--average (SUM + GROUP BY + HAVING)
--here the avg(amount) is sum of all transaction divided by total no. of transaction.


SELECT account_id, SUM(amount) AS total_amount
FROM transactions
GROUP BY account_id
HAVING SUM(amount) > (
    SELECT AVG(amount)
    FROM transactions
)
ORDER BY total_amount DESC;


--multi subquery

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
