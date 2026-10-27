INSERT INTO branches (branch_name, city) VALUES
('Chennai Main',   'Chennai'),
('Mumbai Central', 'Mumbai'),
('Hyderabad Hub',  'Hyderabad'),
('Delhi North',    'Delhi');


INSERT INTO customers (name, dob, gender, phone, email, address) VALUES
('Arjun Sharma',    '1990-03-15', 'Male',   '9876543210', 'arjun.sharma@email.com',    '12, MG Road, Chennai'),
('Priya Nair',      '1995-07-22', 'Female', '9812345678', 'priya.nair@email.com',      '45, Anna Nagar, Chennai'),
('Rahul Mehta',     '1988-11-05', 'Male',   '9745612380', 'rahul.mehta@email.com',     '7, Linking Road, Mumbai'),
('Sneha Reddy',     '2000-01-30', 'Female', '9654321789', 'sneha.reddy@email.com',     '23, Banjara Hills, Hyderabad'),
('Karthik Iyer',   '1983-06-18', 'Male',   '9523416780', 'karthik.iyer@email.com',    '89, Jayanagar, Bengaluru'),
('Meena Pillai',    '1992-09-10', 'Female', '9411237654', 'meena.pillai@email.com',    '3, Connaught Place, Delhi'),
('Vikram Singh',    '1979-12-25', 'Male',   '9378456123', 'vikram.singh@email.com',    '56, Civil Lines, Jaipur');


INSERT INTO employees (name, role, branch_id, salary) VALUES
('Suresh Kumar',   'Manager', 1, 95000.00),
('Divya Menon',    'Teller',  1, 42000.00),
('Ravi Shankar',   'Manager', 2, 98000.00),
('Anjali Gupta',   'Analyst', 3, 65000.00),
('Nikhil Bose',    'Support', 4, 38000.00),
('Lakshmi Iyer',   'Teller',  2, 41000.00);


INSERT INTO accounts (customer_id, branch_id, account_type, balance, created_date) VALUES
(1, 1, 'Savings',  85000.00,  '2020-04-01'),
(2, 1, 'Current',  200000.00, '2019-08-15'),
(3, 2, 'Savings',  45000.50,  '2021-01-10'),
(4, 3, 'Fixed',    500000.00, '2022-03-22'),
(5, 1, 'Savings',  12000.75,  '2023-06-05'),
(6, 4, 'Current',  330000.00, '2018-11-30'),
(7, 2, 'Savings',  67500.00,  '2020-07-19'),
(1, 1, 'Current',  15000.00,  '2023-01-01'); 

INSERT INTO transactions (account_id, transaction_type, amount, transaction_date) VALUES
(1, 'Credit',   10000.00, '2024-01-05 10:30:00'),
(1, 'Debit',     2500.00, '2024-01-12 14:15:00'),
(2, 'Credit',   50000.00, '2024-01-08 09:00:00'),
(3, 'Debit',     1200.00, '2024-02-01 11:45:00'),
(4, 'Credit',  100000.00, '2024-02-14 16:00:00'),
(5, 'Debit',     3000.00, '2024-02-20 13:30:00'),
(6, 'Transfer',  20000.00, '2024-03-01 10:00:00'),
(7, 'Credit',   15000.00, '2024-03-10 08:45:00'),
(8, 'Debit',     5000.00, '2024-03-15 17:20:00'),
(1, 'Transfer',  7500.00, '2024-03-22 12:00:00');

INSERT INTO payments (account_id, payment_type, amount, payment_date) VALUES
(1, 'EMI',      25000.00, '2024-01-01'),
(2, 'Bill',      3500.00, '2024-01-15'),
(3, 'Utility',   1200.00, '2024-02-05'),
(5, 'EMI',       8500.00, '2024-02-10'),
(6, 'Transfer', 50000.00, '2024-03-01'),
(7, 'Bill',      2200.00, '2024-03-12');

INSERT INTO cards (account_id, card_type, expiry_date) VALUES
(1, 'Debit',  '2027-12-31'),
(2, 'Credit', '2026-06-30'),
(3, 'Debit',  '2028-03-31'),
(4, 'Credit', '2027-09-30'),
(6, 'Credit', '2026-12-31'),
(7, 'Debit',  '2029-01-31');

INSERT INTO loans (customer_id, loan_type, amount, interest_rate, start_date) VALUES
(1, 'Home',      5000000.00, 8.50,  '2021-06-01'),
(3, 'Car',        800000.00, 9.75,  '2022-09-15'),
(4, 'Personal',   250000.00, 13.00, '2023-03-10'),
(5, 'Education',  400000.00, 7.25,  '2023-07-01'),
(7, 'Home',      3500000.00, 8.25,  '2020-11-20');
