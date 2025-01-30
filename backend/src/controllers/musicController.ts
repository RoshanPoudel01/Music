import { Request, Response } from "express";
import Joi from "joi";

import db from "../database";
import { APIResponse } from "../response/apiResponse";
import { validate } from "./userController";
export interface MusicInterface {
  id: number;
  artist_id: number;
  title: string;
  album_name: string;
  genre: string;
  created_at: string;
  updated_at: string;
}
const createMusicSchema = Joi.object({
  artist_id: Joi.number().required().messages({
    "number.base": "Artist ID must be a number.",
    "any.required": "Artist ID is required.",
  }),
  title: Joi.string().required().messages({
    "string.empty": "Music title is required.",
    "any.required": "Music title is required.",
  }),
  album_name: Joi.string().optional().allow(null),
  genre: Joi.string()
    .valid("mb", "country", "classic", "rock", "jazz")
    .required()
    .messages({
      "string.empty": "Genre is required.",
      "any.only":
        "Genre must be one of: 'mb', 'country', 'classic', 'rock', 'jazz'.",
    }),
  id: Joi.number().optional(),
});

const createMusic = async (req: Request, res: Response) => {
  const { id, artist_id, title, album_name, genre } = req.body;

  const validationErrors = validate(createMusicSchema, req.body, !id);
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
    // Check if artist exists
    const artistCheck = await db.query(`SELECT id FROM artists WHERE id = $1`, [
      artist_id,
    ]);
    if (!artistCheck.rows.length) {
      return APIResponse({
        res,
        statusCode: 404,
        status: 0,
        message: "Artist not found",
      });
    }

    if (id) {
      // Update existing music
      const query = `
          UPDATE music 
          SET artist_id = $1, title = $2, album_name = $3, genre = $4,
              updated_at = NOW()
          WHERE id = $5 
          RETURNING *`;
      const values = [artist_id, title, album_name || null, genre, id];

      const { rows } = await db.query(query, values);
      if (!rows.length) {
        return APIResponse({
          res,
          statusCode: 404,
          status: 0,
          message: "Music not found.",
        });
      }
      return APIResponse({
        res,
        statusCode: 200,
        status: 1,
        data: rows[0],
        message: "Music updated successfully.",
      });
    } else {
      // Create new music
      const query = `
          INSERT INTO music (artist_id, title, album_name, genre) 
          VALUES ($1, $2, $3, $4) 
          RETURNING *`;
      const values = [artist_id, title, album_name || null, genre];

      const { rows } = await db.query(query, values);
      return APIResponse({
        res,
        statusCode: 201,
        status: 1,
        data: rows[0],
        message: "Music created successfully.",
      });
    }
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred during music creation/update.",
      error: (err as Error).message,
    });
  }
};

const getAllMusic = async (req: Request, res: Response) => {
  const { page = 0, limit = 10, artist_id } = req.query;
  const pageNumber = Number(page);
  const offset = pageNumber * Number(limit);

  let query = `
      SELECT m.*, a.name as artist_name 
      FROM music m 
      LEFT JOIN artists a ON m.artist_id = a.id`;

  const values: any[] = [];
  let countQuery = `SELECT COUNT(*) FROM music`;

  if (artist_id) {
    query += ` WHERE m.artist_id = $1`;
    countQuery += ` WHERE artist_id = $1`;
    values.push(artist_id);
  }

  query += ` ORDER BY m.id OFFSET $${values.length + 1} LIMIT $${
    values.length + 2
  }`;
  values.push(offset, limit);

  try {
    const { rows: dataCountRows } = await db.query(
      countQuery,
      artist_id ? [artist_id] : []
    );
    const { rows } = await db.query(query, values);
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
      message: "An error occurred while fetching music",
      error: (err as Error).message,
    });
  }
};

const getMusicById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const query = `
      SELECT m.*, a.name as artist_name 
      FROM music m 
      LEFT JOIN artists a ON m.artist_id = a.id 
      WHERE m.id = $1`;

  try {
    const { rows } = await db.query(query, [id]);
    if (!rows.length) {
      return APIResponse({
        res,
        statusCode: 404,
        status: 0,
        message: "Music not found",
      });
    }
    return APIResponse({
      res,
      statusCode: 200,
      status: 1,
      data: rows[0],
      message: "Music retrieved successfully",
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

const deleteMusic = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const query = `DELETE FROM music WHERE id = $1 RETURNING *`;

  try {
    const { rows } = await db.query(query, [id]);
    if (!rows.length) {
      return APIResponse({
        res,
        statusCode: 404,
        status: 0,
        message: "Music not found",
      });
    }
    return APIResponse({
      res,
      statusCode: 200,
      status: 1,
      message: "Music deleted successfully",
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
export const MusicController = {
  createMusic,
  getAllMusic,
  getMusicById,
  deleteMusic,
};
