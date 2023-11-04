import { RESTMethods, RESTHandler } from "../../server";
import { Encryptions } from "../../utils/handlers/EncryptionsHandler";
import { SignupsManager } from "../../utils/handlers/SignupsManager";
import { UserManager } from "../../utils/handlers/UserManager";

export const verifyEmail = {
  path: "/signup/verify",
  method: RESTMethods.POST,
  sendUser: false,
  run: async (req, res, next) => {
    // Check if the request has the required parameters
    if (!req.body.code || !req.body.email)
      return res.status(400).json({ error: "Missing parameters" });
    try {
      // Verify the user's email address and complete the sign up process.
      await SignupsManager.signupStep2(req.body.code, req.body.email);
      // Get the user's ID
      const user = await UserManager.getUserByEmailAddress(req.body.email);
      if (!user || !user._id) throw new Error("User not found");
      // Issue a JWT token for the user
      const token = await Encryptions.issueUserAccessToken(user._id);

      // Return success and the token
      return res.json({ success: true, token });
    } catch (er: any) {
      // Return error
      return res.status(400).json({ error: er.message });
    }
  },
} as RESTHandler;
export default verifyEmail;
