import { RESTMethods, RESTHandler } from "../../server";
import { SignupsManager } from "../../utils/handlers/SignupsManager";

export const signup = {
  path: "/signup",
  method: RESTMethods.POST,
  sendUser: false,
  run: async (req, res, next) => {
    const { username, email, password, firstName, lastName } = req.body;
    const signupResponse = await SignupsManager.signupStep1({
      username,
      email,
      password,
      firstName,
      lastName,
    }).catch((er: any) => ({ error: er.message }));
    if (signupResponse.error) return res.status(400).json(signupResponse);
    res.send(signupResponse);
  },
} as RESTHandler;
export default signup;
