import { Request, Response } from "express";
import db from "../database";
import { APIResponse } from "../response/apiResponse";

const dashboardData = async (req: Request, res: Response) => {
  const query = `SELECT
        (SELECT COUNT(*) FROM artists) AS artist_count,
        (SELECT COUNT(*) FROM music) AS music_count,
        (SELECT COUNT(*) FROM users) AS user_count`;
  try {
    const { rows } = await db.query(query);
    return APIResponse({
      res,
      statusCode: 200,
      status: 1,
      data: rows[0],
      message: "Dashboard data retrieved successfully",
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
export { dashboardData };
