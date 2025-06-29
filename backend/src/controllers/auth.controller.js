import { User } from "../models/user.model.js";

export const authCallback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    await User.updateOne(
      { clerkId: id },
      {
        $setOnInsert: {
          fullName: `${firstName || ""} ${lastName || ""}`.trim(),
          imageUrl,
        },
      },
      { upsert: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in authCallback:", error.message);
    res.status(500).json({ message: error.message });
  }
};
