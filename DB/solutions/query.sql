CREATE TABLE TODOS
(
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	title TEXT NOT NULL CHECK (title <> ''),
	description TEXT,
    status TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER
)

INSERT INTO TODOS(title, description, status)
	VALUES ('Homework', 'Math p.54', 'active' )

SELECT * FROM TODOS

UPDATE TODOS
SET description = 'Math p.55'
WHERE ID=1

UPDATE TODOS
SET status = 'completed'
WHERE ID=1

INSERT INTO TODOS(title, description, status)
	VALUES ('Homework', 'English p.57', 'active' )

DELETE FROM TODOS
WHERE ID=2

SELECT * FROM TODOS
	WHERE status='active'

SELECT * FROM TODOS
	ORDER BY created_at ASC
	
SELECT * FROM TODOS
	ORDER BY created_at DESC

SELECT * FROM TODOS 
	WHERE title ILIKE '%meeting%' or description ILIKE '%meeting%';

CREATE TABLE USERS
	(
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name TEXT NOT NULL CHECK (name <> ''),
	email TEXT NOT NULL UNIQUE CHECK (email <> ''),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

INSERT INTO USERS (name, email) 
VALUES 
    ('Иван Иванов', 'ivan@example.com'),
    ('Анна Петрова', 'anna@example.com'),
    ('Петр Сидоров', 'petr@example.com')
RETURNING id, name, email, created_at;

ALTER TABLE TODOS 
	ADD COLUMN user_id INTEGER;

ALTER TABLE TODOS 
	ADD CONSTRAINT fk_todos_user FOREIGN KEY (user_id) REFERENCES users(id);

SELECT 
    status, 
    COUNT(*) AS total_todos
FROM TODOS
GROUP BY status;

SELECT 
    u.name, 
    u.email, 
    COUNT(t.id) AS todos_count
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email;

SELECT 
    u.name, 
    u.email
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
WHERE t.id IS NULL;

CREATE INDEX idx_todos_status ON todos (status);

EXPLAIN ANALYZE 
SELECT * FROM todos WHERE status = 'active';

CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_todo_changes()
RETURNS TRIGGER AS $$
BEGIN
    
    INSERT INTO audit_log (todo_id, action, changed_at)
    VALUES (OLD.id, TG_OP, CURRENT_TIMESTAMP);
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_todo_changes
AFTER UPDATE OR DELETE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_changes();