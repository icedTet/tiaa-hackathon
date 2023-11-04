import { RESTMethods, RESTHandler } from "../../server";

export const getSelf = {
  path: "/users/@me",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    res.send(
        {
            ...user,
            _id: user?._id?.toString(),
            password: undefined,
        }
    );
  },
} as RESTHandler;
export default getSelf;
