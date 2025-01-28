import db from "..";

// Enum type definition
const createGenreEnumQuery = `CREATE TYPE genre_enum AS ENUM ('mb', 'country', 'classic', 'rock', 'jazz');`;
const createGenderEnumQuery = `CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');`;

const createArtistTableQuery = `
  CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE NULL,
    gender gender_enum NULL,
    address VARCHAR(255) NULL,
    first_release_year INTEGER NULL,
    no_of_albums_released INTEGER NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`;

const createMusicTableQuery = `
  CREATE TABLE IF NOT EXISTS music (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    album_name VARCHAR(255) NULL,
    genre genre_enum NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`;

export async function createArtistMusicTables() {
  try {
    // Create the enum types
    await db.query(createGenreEnumQuery).catch((err) => {
      if (err.code !== "42710") {
        // Ignore "type already exists" error
        throw err;
      }
    });

    await db.query(createGenderEnumQuery).catch((err) => {
      if (err.code !== "42710") {
        // Ignore "type already exists" error
        throw err;
      }
    });

    // Create the tables
    await db.query(createArtistTableQuery);
    await db.query(createMusicTableQuery);
    console.log("Artist and Music tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}
