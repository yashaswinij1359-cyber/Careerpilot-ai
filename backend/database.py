import sqlite3

DATABASE = "career_pilot.db"


def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db


def init_db():

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS career (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            goal TEXT,
            role TEXT,
            company TEXT,
            progress INTEGER DEFAULT 0
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            level TEXT,
            progress INTEGER DEFAULT 0
        )
    """)

    db.commit()
    db.close()