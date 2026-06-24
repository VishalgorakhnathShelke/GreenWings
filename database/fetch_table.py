import sqlite3
import pandas as pd
import os

db_path = "greenwings.db"

conn = sqlite3.connect(db_path)

# Get all table names
tables = pd.read_sql_query(
    "SELECT * FROM sqlite_master WHERE type='subtypes';",
    conn
)

print("Tables found:")
print(tables)

# Create export folder
os.makedirs("csv_exports", exist_ok=True)

# Export each table
for table in tables["name"]:
    df = pd.read_sql_query(f"SELECT * FROM {table}", conn)
    csv_file = f"csv_exports/{table}.csv"
    df.to_csv(csv_file, index=False)
    print(f"Exported {table} -> {csv_file}")

conn.close()

print("Done!")