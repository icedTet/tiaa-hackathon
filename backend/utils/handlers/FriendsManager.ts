import { ObjectId } from "mongodb";

export type Friend = {
  userID: string;
  friendsSince: number;
};
export type Friends = {
  _id?: ObjectId;
  userID: string;
  friends: Friend[];
};

export type FriendRequest = {
  _id?: ObjectId;
  senderID: string;
  receiverID: string;
  createdAt: Date;
  message: string;
};

export class FriendsManager {
  static instance: FriendsManager;
  static async sendFriendRequest(
    senderID: string,
    receiverID: string,
    message: string = "I want to be your friend!"
  ) {
    const req = {
      _id: new ObjectId(),
      senderID,
      receiverID,
      createdAt: new Date(),
      message,
    };
    if (
      (await MongoDB?.db("Users").collection("friendRequests").insertOne(req))
        ?.acknowledged
    ) {
      return req as FriendRequest;
    }
    return null;
  }
  static async findFriendRequest(senderID: string, receiverID: string) {
    const request = await MongoDB?.db("Users")
      .collection("friendRequests")
      .findOne({ senderID, receiverID });

    return request as FriendRequest;
  }
  static async getExistingFriendRequest(requestID: string) {
    if (!ObjectId.isValid(requestID)) return null;
    const request = await MongoDB?.db("Users")
      .collection("friendRequests")
      .findOne({ _id: new ObjectId(requestID) });
    return request as FriendRequest;
  }

  static async getFriendRequestsSent(userID: string) {
    const requests = await MongoDB?.db("Users")
      .collection("friendRequests")
      .find({ senderID: userID })
      .toArray();
    return requests as FriendRequest[];
  }
  static async getFriendRequestsReceived(userID: string) {
    const requests = await MongoDB?.db("Users")
      .collection("friendRequests")
      .find({ receiverID: userID })
      .toArray();
    return requests as FriendRequest[];
  }
  static async getFriends(userID: string) {
    const friends = await MongoDB?.db("Users")
      .collection("friends")
      .findOne({ userID });
    if (!friends) return null;
    return friends as Friends;
  }
  static async addFriend(user: string, userIDToAdd: string) {
    // check if user is already friends with userIDToAdd
    const friends = await this.getFriends(user);
    if (friends?.friends.find((f) => f.userID === userIDToAdd)) return null;
    await MongoDB?.db("Users")
      .collection("friends")
      .updateOne(
        { userID: user },
        {
          $push: { friends: { userID: userIDToAdd, friendsSince: Date.now() } },
        },
        { upsert: true }
      );
    return friends as Friends;
  }
  static async removeFriend(user: string, userIDToRemove: string) {
    const friends = await this.getFriends(user);
    if (!friends?.friends.find((f) => f.userID === userIDToRemove)) return null;
    await MongoDB?.db("Users")
      .collection("friends")
      .updateOne(
        { userID: user },
        { $pull: { friends: { userID: userIDToRemove } } }
      );
    return friends as Friends;
  }
  static async acceptFriendRequest(requestID: string) {
    const request = await MongoDB?.db("Users")
      .collection("friendRequests")
      .findOne({ _id: new ObjectId(requestID) });
    if (!request) return null;
    this.addFriend(request.senderID, request.receiverID);
    this.addFriend(request.receiverID, request.senderID);
    await MongoDB?.db("Users")
      .collection("friendRequests")
      .deleteOne({ _id: new ObjectId(requestID) });
    return request as FriendRequest;
  }
  static async rejectFriendRequest(requestID: string) {
    const request = await MongoDB?.db("Users")
      .collection("friendRequests")
      .findOne({ _id: new ObjectId(requestID) });
    if (!request) return null;
    await MongoDB?.db("Users")
      .collection("friendRequests")
      .deleteOne({ _id: new ObjectId(requestID) });
    return request as FriendRequest;
  }
  static async cancelFriendRequest(requestID: string) {
    const request = await MongoDB?.db("Users")
      .collection("friendRequests")
      .findOne({ _id: new ObjectId(requestID) });
    if (!request) return null;
    await MongoDB?.db("Users")
      .collection("friendRequests")
      .deleteOne({ _id: new ObjectId(requestID) });
    return request as FriendRequest;
  }
}
