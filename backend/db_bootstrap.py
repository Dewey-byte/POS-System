from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url


def ensure_database_exists(database_uri: str) -> None:
    """
    Create the target database if it does not exist yet.
    Currently supports MySQL/MariaDB URIs.
    """
    if not database_uri:
        return

    url = make_url(database_uri)
    backend = url.get_backend_name()

    # For sqlite (file DB), database file is created automatically.
    if backend == "sqlite":
        return

    # This bootstrap currently targets MySQL-compatible backends.
    if backend not in {"mysql", "mariadb"}:
        return

    db_name = url.database
    if not db_name:
        return

    server_url = url.set(database=None)
    engine = create_engine(server_url, pool_pre_ping=True)

    with engine.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{db_name}`"))
        conn.commit()

    engine.dispose()
