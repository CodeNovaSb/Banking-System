DO $$
DECLARE
    -- Step 1: define cursor
    my_cursor CURSOR FOR
        SELECT customer_id, name
        FROM customers;

    -- Step 2: variables to hold each row
    v_id    INT;
    v_name  VARCHAR;

BEGIN
    -- Step 3: open cursor
    OPEN my_cursor;

    -- Step 4: loop
    LOOP
        -- Step 5: fetch one row
        FETCH my_cursor INTO v_id, v_name;

        -- Step 6: stop if no more rows
        EXIT WHEN NOT FOUND;

        -- Step 7: print the row
        RAISE NOTICE 'ID: % | Name: %', v_id, v_name;

    END LOOP;

    -- Step 8: close cursor
    CLOSE my_cursor;

END;
$$ LANGUAGE plpgsql;