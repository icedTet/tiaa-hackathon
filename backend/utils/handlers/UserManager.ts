import { ObjectId } from "mongodb";
import { CleanedUser, RawUser, User } from "../../types";
import { Request } from "express";
import { Encryptions } from "./EncryptionsHandler";

export class UserManager {
  static async getUser(userID: string) {
    if (ObjectId.isValid(userID) === false) return null;
    const user = await MongoDB?.db("Users")
      .collection("user")
      .findOne({ _id: new ObjectId(userID) });
    if (!user) return null;
    return {
      ...user,
      _id: user._id.toString(),
    } as User;
  }
  static async getUserByUsername(username: string) {
    const user = await MongoDB?.db("Users")
      .collection("user")
      .findOne({ username });
    if (!user) return null;
    return {
      ...user,
      _id: user._id.toString(),
    } as User;
  }
  static cleanUser(user: RawUser | User) {
    return {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      profilePicture: user.profilePicture,
      bio: user.bio,
    } as CleanedUser;
  }
  static async getUserByEmailAddress(email: string) {
    const user = await MongoDB?.db("Users")
      .collection("user")
      .findOne({ email });
    if (!user) return null;
    return {
      ...user,
      _id: user._id.toString(),
    } as User;
  }
}

export const getUserFromAuthHeader = async (
  req: Request
): Promise<User | null> => {
  const authStr = req.headers.authorization || "";
  const authSplit = authStr.split(" ");
  if (authSplit.length !== 2) return null;
  const [key, accessToken] = authSplit;
  if (key !== "Bearer") return null;
  const userID = await Encryptions.getUserIDFromAccessToken(accessToken);
  if (!userID) return null;
  const user = await UserManager.getUser(userID);
  if (!user) return null;
  return user;
};
