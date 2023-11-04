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
