export type User = {
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
  pfp?: string;
};

export type SelfUser = User & {
  email: string;
};
export type FriendRequest = {
  _id?: string;
  senderID: string;
  receiverID: string;
  createdAt: Date;
  message: string;
};
export type FriendBook = {
  _id?: string;
  userID: string;
  friends: FriendConnection[];
  users?: User[];
};
export type FriendConnection = {
  userID: string;
  friendsSince: number;
};

export type StockGameUserTimeStamp = {
  _id?: string;
  userID: string;
  simulationTime: Date;
  stocks: StockGameStock[];
  money: number;
};
export type StockGameStock = {
  stockID: string;
  amount: number;
  buyPrice: number;
  boughtAt: number;
};
export type StockGameUserData = {
  _id?: string;
  userID: string;
  currentDay: Date;
  nextAdvanceDay: number;
  advancesLeft: number;
};

export type StockGameMarketData = {
  [stockID: string]: number;
};

export type StockGameAllMarketData = {
  [date: string]: StockGameMarketData;
};
