import sqlite3

def check():
    conn = sqlite3.connect('database/greenwings.db')
    
    # Let's get the columns
    columns = [col[1] for col in conn.execute("PRAGMA table_info(success_stories)").fetchall()]
    
    for col in ['profileImage', 'coverImage', 'featuredImage', 'mediaUrl', 'imageUrl']:
        if col in columns:
            conn.execute(f"UPDATE success_stories SET {col} = REPLACE({col}, 'Gorakhnath_Shelke', 'Gorakhnath%20Shelke') WHERE {col} LIKE '%Gorakhnath_Shelke%'")
            print(f"Updated {col}")
    
    conn.commit()
    print("Database updated!")
    conn.close()

if __name__ == '__main__':
    check()
