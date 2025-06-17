# 環境変数
POSTGRES_USER=db_user
POSTGRES_PASSWORD=db_password
POSTGRES_DB=db_name
POSTGRES_CONTAINER=job_hunting_supporter_postgres

# マイグレーションファイルのディレクトリ
MIGRATIONS_DIR=Database/migrations

# マイグレーションアップのファイル一覧 (番号順に並べ替える)
MIGRATION_UP_FILES=$(shell ls $(MIGRATIONS_DIR)/*.up.sql | sort)

# マイグレーションダウンのファイル一覧 (番号順に並べ替える)
MIGRATION_DOWN_FILES=$(shell ls $(MIGRATIONS_DIR)/*.down.sql | sort)

# コンテナが起動しているか確認
check_container_running:
	@if [ -z "$$(docker ps -q --filter "name=$(POSTGRES_CONTAINER)")" ]; then \
		echo "Postgresコンテナが起動していません。"; \
		exit 1; \
	fi

# 開発環境のビルド
build-dev:
	docker-compose -f docker-compose.yaml up --build
	@echo "Waiting for Postgres container to start..."
	sleep 5 # コンテナが完全に起動するのを待機（必要に応じて調整）
	@echo "Applying migrations..."
	make create-schema # スキーマ作成のマイグレーションを適用

# Postgresを起動
build-up:
	docker-compose -f docker-compose.yaml up

# Postgresを停止
build-down:
	docker-compose -f docker-compose.yaml down

# スキーマ作成マイグレーション (up.sqlを実行)
create-schema: check_container_running
	@echo "Applying schema creation (up.sql)..."
	@for sql in $(MIGRATION_UP_FILES); do \
		file_name=$$(basename $$sql); \
		docker cp $$sql $(POSTGRES_CONTAINER):/tmp/$$file_name; \
		docker exec -i $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -f /tmp/$$file_name; \
	done

# スキーマ削除マイグレーション (down.sqlを実行)
drop-schema: check_container_running
	@echo "Rolling back schema (down.sql)..."
	@for sql in $(MIGRATION_DOWN_FILES); do \
  		file_name=$$(basename $$sql); \
        docker cp $$sql $(POSTGRES_CONTAINER):/tmp/$$file_name; \
		docker exec -i $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -f /tmp/$$file_name; \
	done

# スキーマのマイグレーションをアップとダウンで分けて実行
create-db-schemer: create-schema

# スキーマをロールバックするマイグレーション
rollback-db-schemer: drop-schema
