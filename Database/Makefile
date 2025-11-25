init-postgres-detached-to-terminal-container:
	docker run -d --name habitos_db \
		-p 5432:5432 \
		-e POSTGRES_PASSWORD=super_secret \
		-v ./CreateTables.sql:/tmp/CreateTables.sql:ro \
		postgres:latest

init-postgres-attached-to-terminal-container:
	docker run --name habitos_db \
		-p 5432:5433 \
		-e POSTGRES_PASSWORD=super_secret \
		-v ./CreateTables.sql:/tmp/CreateTables.sql:ro \
		postgres:latest

execute-sql-init-file:
	docker exec -i habitos_db  psql -U postgres -d habitos_db < ./CreateTables.sql

execute-sql-dummy-data:
	docker exec -i habitos_db psql -U postgres -d habitos_db < ./InsertData.sql

access-postgres-container:
	docker exec -it habitos_db psql -U postgres -d postgres

init-postgres-only-db-to-terminal-container:
	docker run -d --name habitos_db \
		-p 5432:5432 \
		-e POSTGRES_PASSWORD=super_secret \
		-v ./InitDB.sql:/docker-entrypoint-initdb.d/InitDB.sql \
		postgres:latest

execute-db:
	docker exec -i habitos_db psql -U postgres -d habitos_db < ./InitDB.sql
