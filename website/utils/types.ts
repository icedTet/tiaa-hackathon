export type User = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  name: string;
  pfp?: string;
};

export type SelfUser = User & {
  email: string;
};
