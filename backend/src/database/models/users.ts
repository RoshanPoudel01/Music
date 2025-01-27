import db from "..";

const createEnumQuery = `CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');`;

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20)  NULL,
    dob DATE  NULL,
    address VARCHAR(100)  NULL,
    gender gender_enum NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

export async function createUserTable() {
  try {
    // Create the enum type
    await db.query(createEnumQuery).catch((err) => {
      if (err.code !== "42710") {
        // Ignore "type already exists" error
        throw err;
      }
    });

    // Create the table
    await db.query(createUserTableQuery);
    console.log("Table created successfully");
  } catch (err) {
    console.error("Error creating table:", err);
  }
}
