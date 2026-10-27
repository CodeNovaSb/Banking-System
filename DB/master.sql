-- BANKING SYSTEM — Master Script (PostgreSQL)
-- Run: psql -U postgres -d Bank_managment_system -f master.sql

\echo '================================'
\echo ' BANKING SYSTEM Master Script'
\echo '================================'

\echo 'Step 1: Creating tables...'
\i ddl/schema.sql
\echo 'Done.'

\echo 'Step 2: Inserting data...'
\i dml/insert_data.sql
\echo 'Done.'

\echo 'Step 3: Applying roles and permissions...'
\i dcl/dcl.sql
\echo 'Done.'

\echo 'Step 4: Creating views...'
\i view/view.sql
\echo 'Done.'

\echo 'Step 5: Creating triggers...'
\i trigger/trigger.sql
\echo 'Done.'

\echo 'Step 6: Enabling manual trigger mode for this master run...'
SET bank.enable_balance_trigger = 'on';
\echo 'Done.'

\echo 'Step 7: Running transaction control...'
\i tcl/tcl.sql
\echo 'Done.'

\echo 'Step 8: Disabling manual trigger mode after master run...'
SET bank.enable_balance_trigger = 'off';
\echo 'Done.'

\echo 'Step 9: Running cursors...'
\i cursor/cursor.sql
\echo 'Done.'

\echo 'Step 10: Running join queries...'
\i join/join.sql
\echo 'Done.'

\echo 'Step 11: Running subqueries...'
\i subquery/subquery.sql
\echo 'Done.'

\echo '================================'
\echo ' All steps completed. DB ready!'
\echo '================================'