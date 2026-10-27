--create function for trigger
CREATE OR REPLACE FUNCTION update_balance_on_transaction()
RETURNS TRIGGER AS $$
DECLARE
    current_balance DECIMAL(12,2);
    trigger_enabled TEXT;
BEGIN

    -- Manual switch: trigger runs only when enabled in the current session.
    trigger_enabled := current_setting('bank.enable_balance_trigger', true);
    IF COALESCE(trigger_enabled, 'off') <> 'on' THEN
        RETURN NEW;
    END IF;

    -- Get current balance before update
    SELECT balance INTO current_balance
    FROM accounts
    WHERE account_id = NEW.account_id;

    RAISE NOTICE '-----------------------------------';
    RAISE NOTICE 'Trigger fired for account_id: %', NEW.account_id;
    RAISE NOTICE 'Transaction type: %', NEW.transaction_type;
    RAISE NOTICE 'Transaction amount: %', NEW.amount;
    RAISE NOTICE 'Balance BEFORE: %', current_balance;

    -- CREDIT
    IF NEW.transaction_type = 'Credit' THEN

        UPDATE accounts
        SET balance = balance + NEW.amount
        WHERE account_id = NEW.account_id;

        RAISE NOTICE 'Credit applied → New Balance: %', current_balance + NEW.amount;

    -- DEBIT
    ELSIF NEW.transaction_type = 'Debit' THEN

        UPDATE accounts
        SET balance = balance - NEW.amount
        WHERE account_id = NEW.account_id;

        RAISE NOTICE 'Debit applied → New Balance: %', current_balance - NEW.amount;

    END IF;

    RAISE NOTICE '-----------------------------------';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--call trigger function

CREATE TRIGGER trigger_update_balance
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_balance_on_transaction();

DROP TRIGGER trigger_update_balance ON transactions;

-- INSERT INTO transactions (account_id, transaction_type, amount)
-- VALUES (8, 'Credit', 5000);

