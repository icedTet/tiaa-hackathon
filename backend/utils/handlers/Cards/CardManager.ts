import { ObjectId } from "mongodb";

export type Card = {
  _id: string;
  name: string;
  description: string;
  type: string;
  theme: string;
  image: string;
  createdAt: string;
  editedAt: string;
  links: CardLink[];
  themeProps: CardThemeProps;
  owner: string;
};

export type RawCard = Omit<Omit<Card, "_id">, "owner"> & {
  _id: ObjectId;
  owner: ObjectId;
};

export type CardLink = {
  name: string;
  description: string;
  type: string;
};
export type CardThemeProps = any;
export class CardManager {
  static getCard(cardId: string): Card {
    
  }
}
