import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import db from "../database";
import { APIResponse } from "../response/apiResponse";

import { config } from "dotenv";

config();

export interface RootInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  created_at: string;
}

const createUserSchema = Joi.object({
  first_name: Joi.string().required().messages({
    "string.empty": "First name is required.",
    "any.required": "First name is required.",
  }),
  last_name: Joi.string().required().messages({
    "string.empty": "Last name is required.",
    "any.required": "Last name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
    "string.empty": "Email is required.",
  }),
  password: Joi.string()
    .min(6)
    .when("$isNew", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "any.required": "Password is required.",
      "string.min": "Password must be at least 6 characters.",
      "string.empty": "Password is required.",
    }),
  phone: Joi.string().required().messages({
    "any.required": "Phone number is required.",
    "string.empty": "Phone number is required.",
  }),
  dob: Joi.date().optional().allow(null),
  address: Joi.string().optional().allow(null),
  gender: Joi.string().valid("male", "female", "other").required().messages({
    "string.empty": "Gender is required.",
    "any.only": "Gender must be 'male', 'female', or 'other'.",
  }),
  id: Joi.number().optional(), // Only present for updates
});

const passwordChangeSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Invalid user ID.",
    "any.required": "User ID is required.",
  }),
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old password is required.",
    "any.required": "Old password is required.",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "string.empty": "New password is required.",
    "any.required": "New password is required.",
  }),
});
export const validate = (
  schema: Joi.ObjectSchema,
  data: any,
  isNew: boolean
) => {
  const { error } = schema.validate(data, {
    abortEarly: false,
    context: { isNew },
  });
  if (error) {
    return error.details.map((err) => err.message)[0];
  }
  return null;
};
// Helper to exclude sensitive fields (like password)
const excludeSensitiveFields = (rows: RootInterface[]) => {
  return rows.map(({ password, ...rest }) => rest);
};

// Centralized query execution function
const executeQuery = async (
  res: Response,
  query: string,
  values: any[],
  successStatusCode: number,
  successMessage: string,
  notFoundMessage: string
) => {
  try {
    const { rows } = await db.query(query, values);
    if (!rows.length) {
      return APIResponse({
        res,
        statusCode: 404,
        status: 0,
        message: notFoundMessage,
      });
    }
    const data = excludeSensitiveFields(rows);
    return APIResponse({
      res,
      statusCode: successStatusCode,
      status: 1,
      data: Array.isArray(data) && data.length === 1 ? data[0] : data,
      message: successMessage,
    });
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 400,
      status: 0,
      message: "An error occurred",
      error: (err as Error).message,
    });
  }
};

// Create or update a user
const createUser = async (req: Request, res: Response) => {
  const {
    id,
    first_name,
    last_name,
    email,
    password,
    phone,
    dob,
    address,
    gender,
  } = req.body;
  const validationErrors = validate(createUserSchema, req.body, !id);
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
    if (!id) {
      // Check if the email already exists (only for new users)
      const emailCheckQuery = `SELECT * FROM users WHERE email = $1`;
      const emailCheckResult = await db.query(emailCheckQuery, [email]);
      if (emailCheckResult.rows.length) {
        return APIResponse({
          res,
          statusCode: 400,
          status: 0,
          message: "User with this email already exists.",
        });
      }
    }

    if (id) {
      // Update existing user
      const query = `UPDATE users SET first_name = $1, last_name = $2, email = $3,  phone = $4, dob = $5, address = $6, gender = $7,updated_at = NOW() WHERE id = $8 RETURNING *`;
      const values = [
        first_name,
        last_name,
        email,
        phone,
        dob || null,
        address || null,
        gender,
        id,
      ];

      return executeQuery(
        res,
        query,
        values,
        200,
        "User updated successfully.",
        "User not found."
      );
    } else {
      // Create new user

      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `INSERT INTO users (first_name, last_name, email, password, phone, dob, address, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
      const values = [
        first_name,
        last_name,
        email,
        hashedPassword,
        phone,
        dob || null,
        address || null,
        gender,
      ];
      return executeQuery(
        res,
        query,
        values,
        201,
        "User created successfully.",
        "User creation failed."
      );
    }
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred during user creation/update.",
      error: (err as Error).message,
    });
  }
};
// Login user`
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await db.query(query, [email]);

    if (!rows.length) {
      return APIResponse({
        res,
        statusCode: 404,
        status: 0,
        message: "Invalid email or password",
      });
    }

    const user = rows[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return APIResponse({
        res,
        statusCode: 401,
        status: 0,
        message: "Invalid email or password",
      });
    }

    // Exclude password before sending the response
    const { password: _, ...userWithoutPassword } = user;

    // Create JWT token
    const payload = {
      id: user.id,
      email: user.email,
    };

    const secretKey = process.env.JWT_SECRET ?? "randomSecretKey";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Token expires in 1 hour

    const expirationTime = Date.now() + 60 * 60 * 1000;

    // Send the response with the token
    return APIResponse({
      res,
      statusCode: 200,
      status: 1,
      data: {
        ...userWithoutPassword,
        tokenDetails: { token: token, expiresIn: expirationTime },
      },
      message: "Login successful",
    });
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred during login",
      error: (err as Error).message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const { page = 0, limit = 10 } = req.query;
  const pageNumber = Number(page);
  const offset = pageNumber * Number(limit);

  const dataCountQuery = `SELECT COUNT(*) FROM users`;
  const query = `SELECT * FROM users ORDER BY id OFFSET $1 LIMIT $2`;
  try {
    const { rows: dataCountRows } = await db.query(dataCountQuery);
    const { rows } = await db.query(query, [offset, limit]);
    const data = excludeSensitiveFields(rows);
    return APIResponse({
      res,
      statusCode: 200,
      status: 1,
      data,
      totalItems: +dataCountRows[0].count,
    });
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred while fetching users",
      error: (err as Error).message,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const query = `SELECT * FROM users WHERE id = $1`;

  return executeQuery(
    res,
    query,
    [id],
    200,
    "User retrieved successfully",
    "User not found"
  );
};

const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const query = `DELETE FROM users WHERE id = $1 RETURNING *`;

  return executeQuery(
    res,
    query,
    [id],
    200,
    "User deleted successfully",
    "User not found"
  );
};

const changePassword = async (req: Request, res: Response) => {
  const { id, oldPassword, newPassword } = req.body;
  const validationErrors = validate(passwordChangeSchema, req.body, false);
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
    // Check if the user exists
    const query = `SELECT * FROM users WHERE id = $1`;
    const { rows } = await db.query(query, [id]);

    if (!rows.length) {
      return APIResponse({
        res,
        statusCode: 404,
        status: 0,
        message: "User not found",
      });
    }

    const user = rows[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return APIResponse({
        res,
        statusCode: 401,
        status: 0,
        message: "Invalid old password",
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`;
    const { rows: updateRows } = await db.query(updateQuery, [
      hashedPassword,
      id,
    ]);

    // Exclude password before sending the response
    const { password: _, ...userWithoutPassword } = updateRows[0];

    return APIResponse({
      res,
      statusCode: 200,
      status: 1,
      data: userWithoutPassword,
      message: "Password updated successfully",
    });
  } catch (err) {
    return APIResponse({
      res,
      statusCode: 500,
      status: 0,
      message: "An error occurred during password update",
      error: (err as Error).message,
    });
  }
};
export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  loginUser,
  changePassword,
};
