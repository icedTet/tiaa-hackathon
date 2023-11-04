import { RESTHandler, RESTMethods } from "../server";

export const ping = {
  path: "/ping",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next,user) => {
    res.send(user);
  },
} as RESTHandler;
export default ping;
