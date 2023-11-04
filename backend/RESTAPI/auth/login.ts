import { RESTHandler, RESTMethods } from "../../server";
import {
  EncryptionHasher,
  Encryptions,
} from "../../utils/handlers/EncryptionsHandler";
import { UserManager } from "../../utils/handlers/UserManager";

export const login = {
  path: "/login",
  method: RESTMethods.POST,
  sendUser: false,
  run: async (req, res, next) => {
    // Check if request has the required parameters
    if (!req.body.email || !req.body.password)
      return res.status(400).json({ error: "Missing parameters" });
    try {
      // Check if there is a user with the given email address
      const user = await UserManager.getUserByEmailAddress(req.body.email);
      // If there is no user, return an error
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      // Verify that the password matches the stored hash
      const isVerified = await EncryptionHasher.verifyPassword(
        req.body.password,
        user.password
      );
      // If the password doesn't match, return an error
      if (!isVerified)
        return res.status(401).json({ error: "Invalid credentials" });
      // Issue a JWT token for the user
      const token = await Encryptions.issueUserAccessToken(user._id!);
      // Return success and the token
      return res.json({ success: true, token });
    } catch (er: any) {
      // Return error
      return res.status(400).json({ error: er.message });
    }
  },
} as RESTHandler;
export default login;
