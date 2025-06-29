import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  if (!req.auth.userId) {
    return res.status(401).json({ message: "UnAuthorized access" });
  }

  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isEmail =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
    if (!isEmail)
      return res.status(401).json({ message: "UnAuthorized access" });

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
