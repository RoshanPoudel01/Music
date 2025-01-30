import { parse } from "csv-parse";
import { Request, Response } from "express";
import Joi from "joi";
import path from "path";
import { Readable } from "stream";
import * as XLSX from "xlsx";
import db from "../database";
import { APIResponse } from "../response/apiResponse";
import { validate } from "./userController";
// Interfaces
export interface ArtistInterface {
  id: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
  created_at: string;
  updated_at: string;
}

// Validation Schemas
const createArtistSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Artist name is required.",
    "any.required": "Artist name is required.",
  }),
  dob: Joi.date().optional().allow(null),
  gender: Joi.string().valid("male", "female", "other").optional().allow(null),
  address: Joi.string().optional().allow(null),
  first_release_year: Joi.number().integer().optional().allow(null),
  no_of_albums_released: Joi.number().integer().optional().allow(null),
  id: Joi.number().optional(),
});

// Artist Controller
const createArtist = async (req: Request, res: Response) => {
  const {
    id,
    name,
    dob,
    gender,
    address,
    first_release_year,
    no_of_albums_released,
  } = req.body;

  const validationErrors = validate(createArtistSchema, req.body, !id);
  if (validationErrors) {
    return APIResponse({
      res,
      statusCode: 400,
      status: 0,
      message: "Validation failed.",
      error: validationErrors,
    });
  }

  try {
    if (id) {
      // Update existing artist
      const query = `
        UPDATE artists 
        SET name = $1, dob = $2, gender = $3, address = $4, 
            first_release_year = $5, no_of_albums_released = $6,
            updated_at = NOW()
        WHERE id = $7 
        RETURNING *`;
      const values = [
        name,
        dob || null,
        gender || null,
        address || null,
        first_release_year || null,
        no_of_albums_released || null,
        id,
      ];

      const { rows } = await db.query(query, values);
      if (!rows.length) {
        return APIResponse({
          res,
          statusCode: 404,
          status: 0,
          message: "Artist not found.",
        });
      }
      return APIResponse({
        res,
        statusCode: 200,
        status: 1,
        data: rows[0],
        message: "Artist updated successfully.",
      });
    } else {
      // Create new artist
      const query = `
        INSERT INTO artists (
          name, dob, gender, address, 
          first_release_year, no_of_albums_released
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`;
      const values = [
        name,
        dob || null,
        gender || null,
        address || null,
        first_release_year || null,
        no_of_albums_released || null,
      ];

      const { rows } = await db.query(query, values);
      return APIResponse({
        res,
        statusCode: 201,
        status: 1,
        data: rows[0],
        message: "Artist created successfully.",
      });
    }
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred during artist creation/update.",
      error: (err as Error).message,
    });
  }
};

const getAllArtists = async (req: Request, res: Response) => {
  const { page = 0, limit = 10 } = req.query;
  const pageNumber = Number(page);
  const offset = pageNumber * Number(limit);

  const dataCountQuery = `SELECT COUNT(*) FROM artists`;
  const query = `SELECT * FROM artists ORDER BY id OFFSET $1 LIMIT $2`;
  try {
    const { rows: dataCountRows } = await db.query(dataCountQuery);
    const { rows } = await db.query(query, [offset, limit]);
    return APIResponse({
      res,
      statusCode: 200,
      status: 1,
      data: rows,
      totalItems: +dataCountRows[0].count,
    });
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred while fetching artists",
      error: (err as Error).message,
    });
  }
};

const getArtistById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const query = `SELECT * FROM artists WHERE id = $1`;

  try {
    const { rows } = await db.query(query, [id]);
    if (!rows.length) {
      return APIResponse({
        res,
        statusCode: 404,
        status: 0,
        message: "Artist not found",
      });
    }
    return APIResponse({
      res,
      statusCode: 200,
      status: 1,
      data: rows[0],
      message: "Artist retrieved successfully",
    });
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred",
      error: (err as Error).message,
    });
  }
};

const deleteArtist = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const query = `DELETE FROM artists WHERE id = $1 RETURNING *`;

  try {
    const { rows } = await db.query(query, [id]);
    if (!rows.length) {
      return APIResponse({
        res,
        statusCode: 404,
        status: 0,
        message: "Artist not found",
      });
    }
    return APIResponse({
      res,
      statusCode: 200,
      status: 1,
      message: "Artist deleted successfully",
    });
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred",
      error: (err as Error).message,
    });
  }
};
// Validate single artist data
const validateArtistData = (artist: any) => {
  // Basic validation
  if (!artist.name) {
    return "Artist name is required";
  }

  if (
    artist.gender &&
    !["male", "female", "other"].includes(artist.gender.toLowerCase())
  ) {
    return "Invalid gender value";
  }

  if (artist.first_release_year && isNaN(Number(artist.first_release_year))) {
    return "Invalid first release year";
  }

  if (
    artist.no_of_albums_released &&
    isNaN(Number(artist.no_of_albums_released))
  ) {
    return "Invalid number of albums";
  }

  return null;
};

// Process CSV data
const processCSV = (buffer: Buffer): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on("data", (data) => results.push(data))
      .on("error", (error) => reject(error))
      .on("end", () => resolve(results));
  });
};

// Process Excel data
const processExcel = (buffer: Buffer): any[] => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(firstSheet);
};

const bulkUploadArtists = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return APIResponse({
        res,
        statusCode: 400,
        status: 0,
        message: "No file uploaded",
      });
    }

    let artists: any[] = [];
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Parse file based on type
    if (fileExt === ".csv") {
      artists = await processCSV(req.file.buffer);
    } else {
      artists = processExcel(req.file.buffer);
    }

    // Validate and process artists
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const artist of artists) {
      // Validate artist data
      const validationError = validateArtistData(artist);
      if (validationError) {
        results.failed++;
        results.errors.push(validationError);
        continue;
      }

      try {
        // Insert artist into database
        const query = `
          INSERT INTO artists (
            name, dob, gender, address, 
            first_release_year, no_of_albums_released
          ) 
          VALUES ($1, $2, $3, $4, $5, $6)`;

        const values = [
          artist.name,
          artist.dob || null,
          artist.gender?.toLowerCase() || null,
          artist.address || null,
          artist.first_release_year || null,
          artist.no_of_albums_released || null,
        ];

        await db.query(query, values);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Database error for ${artist.name}: ${(error as Error).message}`
        );
      }
    }

    if (results.failed === 0) {
      return APIResponse({
        res,
        statusCode: 201,
        status: 1,
        message: "Artists uploaded successfully",
        data: results,
      });
    } else {
      return APIResponse({
        res,
        statusCode: 207,
        status: 0,
        message: "Some artists failed to upload",
        data: null,
        error: results.errors,
      });
    }
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred during bulk upload",
      error: (err as Error).message,
    });
  }
};

export const ArtistController = {
  createArtist,
  getAllArtists,
  getArtistById,
  deleteArtist,
  bulkUploadArtists,
};
