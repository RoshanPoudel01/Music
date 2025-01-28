import { Request, Response } from "express";
import Joi from "joi";
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
  const validationErrors = validate(
    createArtistSchema,
    req.body,
    !req.params.id
  );
  if (validationErrors) {
    return APIResponse({
      res,
      statusCode: 400,
      status: 0,
      message: "Validation failed.",
      error: validationErrors,
    });
  }

  const {
    id,
    name,
    dob,
    gender,
    address,
    first_release_year,
    no_of_albums_released,
  } = req.body;

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
  const offset = pageNumber;
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
      totalItems: dataCountRows[0].count,
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

export const ArtistController = {
  createArtist,
  getAllArtists,
  getArtistById,
  deleteArtist,
};
