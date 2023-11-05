import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TextBox from "../../components/Inputs/TextBox";
import { SidebarLayout } from "../../components/SidebarLayout";
import { useAPIProp } from "../../utils/hooks/useAPI";
import { apiDomain } from "../../constants";
import { Modal } from "../../components/Modal";
import { use, useEffect, useMemo, useState } from "react";
import { UserProfile } from "../../components/UserProfile";
import { FriendBook, FriendRequest, User } from "../../utils/types";
import { FriendSearchResult } from "../../components/Friends/FriendSearchResult";
import dayjs from "dayjs";
import {
  IncomingFriendRequest,
  OutgoingFriendRequest,
} from "../../components/Friends/FriendRequest";

export const FriendsPage = () => {
  const [friends, setFriends] = useAPIProp<FriendBook>({
    APIPath: `${apiDomain}/users/@me/friends`,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useAPIProp<User[]>({
    APIPath: `${apiDomain}/users/@search?q=${searchTerm}`,
    cacheable: false,
  });
  const [friendRequests, setFriendRequests] = useAPIProp<{
    friendRequestsSent: FriendRequest[];
    friendRequestsReceived: FriendRequest[];
    users: User[];
  }>({
    APIPath: `${apiDomain}/friends/requests`,
    cacheable: false,
  });
  const userMap = useMemo(() => {
    const umap = new Map<string, User>();
    friendRequests?.users?.forEach((user) => {
      umap.set(user._id!, user);
    });
    friends?.users?.forEach((friend) => {
      umap.set(friend._id!, friend);
    });
    return umap;
  }, [friendRequests?.users, friends]);
  useEffect(() => {
    setInterval(() => {
      setFriendRequests();
      setFriends()
    }, 5000);
  }, []);
  const [addFriend, setAddFriend] = useState(false);
  return (
    <SidebarLayout title={"Friends"}>
      <div className={`flex flex-col gap-8 p-8 pl-0 grow`}>
        <div className="flex flex-col gap-4 items-start">
          <span className={`text-2xl font-bold font-montserrat`}>Friends</span>
          <span className={`text-gray-400`}>Find and manage your friends.</span>
        </div>
        <div className={`flex flex-row gap-4 items-center`}>
          <TextBox
            placeholder={`Search`}
            className={`w-full rounded-2xl`}
            icon={MagnifyingGlassIcon}
          />
          <button
            className={`flex flex-row gap-2 items-center px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 ease-in-out`}
            onClick={() => setAddFriend(true)}
          >
            <span
              className={`text-sm font-bold text-gray-100 whitespace-nowrap`}
            >
              Add New Friend
            </span>
          </button>
        </div>
        {/* {JSON.stringify(friendRequests)} */}
        {!!friendRequests?.friendRequestsReceived?.length && (
          <div className={`flex flex-col gap-4`}>
            <span className={`text-xl font-bold font-montserrat`}>
              Incoming Friend Requests
            </span>
            <div className={`flex flex-col gap-4`}>
              {!!friendRequests?.friendRequestsReceived?.length &&
                friendRequests?.friendRequestsReceived?.map((request) => (
                  <IncomingFriendRequest
                    request={request}
                    user={userMap.get(request.senderID)!}
                    onAccept={setFriendRequests}
                    onReject={setFriendRequests}
                    key={request._id}
                  />
                ))}
            </div>
          </div>
        )}{" "}
        {!!friendRequests?.friendRequestsSent?.length && (
          <div className={`flex flex-col gap-4`}>
            <span className={`text-xl font-bold font-montserrat`}>
              Outgoing Friend Requests
            </span>
            <div className={`flex flex-col gap-4`}>
              {!!friendRequests?.friendRequestsSent?.length &&
                friendRequests?.friendRequestsSent?.map((request) => (
                  <OutgoingFriendRequest
                    request={request}
                    user={userMap.get(request.receiverID)!}
                    key={request._id}
                  />
                ))}
            </div>
          </div>
        )}
        <div className={`flex flex-col gap-4`}>
          <span className={`text-xl font-bold font-montserrat`}>
            Friends ({friends?.friends.length})
          </span>
          <div className={`flex flex-col gap-4`}>
            {!!friends?.friends.length &&
              friends?.friends?.map((friend) => (
                <div
                  className={`flex flex-row gap-4 items-center w-70 p-6 bg-gray-850 rounded-3xl border border-gray-100/5`}
                  key={friend.userID}
                >
                  <UserProfile
                    user={userMap.get(friend.userID)}
                    className={`w-12 h-12`}
                  />
                  <div className={`flex flex-col gap-1`}>
                    <span className={`text-base font-bold text-gray-100`}>
                      {userMap.get(friend.userID)?.firstName}{" "}
                      {userMap.get(friend.userID)?.lastName}
                    </span>
                    <span className={`text-sm font-medium text-gray-100/30`}>
                      @{userMap.get(friend.userID)?.username}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Modal
        onClose={() => setAddFriend(false)}
        visible={addFriend}
        className={`max-w-prose w-full`}
      >
        <div className={`flex flex-col gap-4 p-8 grow`}>
          <div className={`flex flex-col gap-4`}>
            <span className={`text-2xl font-bold font-montserrat`}>
              Add Friend
            </span>
            <span className={`text-gray-400`}>
              Finance is more fun with friends! Add a friend to get started.
            </span>
            <TextBox
              placeholder={`Search for a name or username`}
              className={`w-full rounded-2xl`}
              icon={MagnifyingGlassIcon}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={`flex flex-col gap-4`}>
            {!!search?.length &&
              search?.map((user) => (
                <FriendSearchResult
                  user={user}
                  onAdd={setFriendRequests}
                  key={user._id}
                />
              ))}
            {!search?.length && searchTerm && (
              <span className={`text-gray-400`}>
                No users found with that name or username.
              </span>
            )}
          </div>
        </div>
      </Modal>
    </SidebarLayout>
  );
};
export default FriendsPage;
