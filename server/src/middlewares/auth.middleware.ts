import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface ItokenUser extends JwtPayload {
  _id: string; // userId
}

// Extract credentials
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    // Verify the token
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as ItokenUser;

    // Add the user to the request object
    (req as Request & { user: ItokenUser }).user = user; // Inline assertion. Include ItokenUser type to avoid unassignable.

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
