import { ObjectId } from "mongodb";

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  name: string;
  bio: string;
  profilePicture: string;
  _id?: string;
};
export type RawUser = Omit<User, "_id"> & { _id: ObjectId };

export type CleanedUser = Omit<Omit<User, "password">, "email">

export type StockTimeSerie = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
};