import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TextBox from "../../components/Inputs/TextBox";
import { SidebarLayout } from "../../components/SidebarLayout";
import { useAPIProp } from "../../utils/hooks/useAPI";
import { apiDomain } from "../../constants";
import { Modal } from "../../components/Modal";
import { use, useMemo, useState } from "react";
import { UserProfile } from "../../components/UserProfile";
import { FriendRequest, User } from "../../utils/types";
import { FriendSearchResult } from "../../components/Friends/FriendSearchResult";
import dayjs from "dayjs";

export const FriendsPage = () => {
  const [friends, setFriends] = useAPIProp({
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
    return umap;
  }, [friendRequests?.users]);
  const [addFriend, setAddFriend] = useState(true);
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
        {JSON.stringify(friendRequests)}
        {!!friendRequests?.friendRequestsReceived?.length && (
          <div className={`flex flex-col gap-4`}>
            <span className={`text-xl font-bold font-montserrat`}>
              Incoming Friend Requests
            </span>
            <div className={`flex flex-col gap-4`}>
              {!!friendRequests?.friendRequestsReceived?.length &&
                friendRequests?.friendRequestsReceived?.map((request) => (
                  <div
                    className={`w-[50ch] aspect-video p-8 flex flex-col gap-4 bg-gray-850 rounded-3xl relative border border-gray-100/5 shadow-lg drop-shadow-md`}
                    key={request._id}
                  >
                    <div className={`flex flex-row gap-4 items-center`}>
                      <UserProfile
                        user={userMap.get(request.senderID)!}
                        className={`w-12 h-12`}
                      />
                      <div className={`flex flex-col gap-1`}>
                        <span className={`text-base font-bold text-gray-100`}>
                          {userMap.get(request.senderID)?.firstName}{" "}
                          {userMap.get(request.senderID)?.lastName}
                        </span>
                        <span
                          className={`text-sm font-medium text-gray-100/30`}
                        >
                          @{userMap.get(request.senderID)?.username}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex flex-row gap-4 items-start font-wsans text-gray-100/40 grow border border-gray-100/5  p-4 rounded-2xl`}
                    >
                      {request.message}
                    </div>
                    <div
                      className={`flex flex-row justify-between w-full items-baseline`}
                    >
                      <div className={`flex flex-row gap-4 items-center`}>
                        <button
                          className={`flex flex-row gap-2 items-center px-4 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 ease-in-out`}
                        >
                          <span
                            className={`text-sm font-bold text-gray-100 whitespace-nowrap`}
                          >
                            Accept
                          </span>
                        </button>
                        <button
                          className={`flex flex-row gap-2 items-center px-4 py-2 rounded-2xl bg-red-500 hover:bg-red-600 transition-all duration-200 ease-in-out`}
                        >
                          <span
                            className={`text-sm font-bold text-gray-100 whitespace-nowrap`}
                          >
                            Decline
                          </span>
                        </button>
                      </div>
                      <span
                        className={`text-sm font-medium text-gray-100/10 font-wsans w-full text-end`}
                      >
                        {/* format time with the specific time in day */}
                        {dayjs(request.createdAt).format("MM/DD/YYYY")} at{" "}
                        {dayjs(request.createdAt).format("h:mm A")}
                      </span>
                    </div>
                  </div>
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
                  <div
                    className={`w-[50ch] aspect-video p-8 flex flex-col gap-4 bg-gray-850 rounded-3xl relative border border-gray-100/5 shadow-lg drop-shadow-md`}
                    key={request._id}
                  >
                    <div className={`flex flex-row gap-4 items-center`}>
                      <UserProfile
                        user={userMap.get(request.receiverID)!}
                        className={`w-12 h-12`}
                      />
                      <div className={`flex flex-col gap-1`}>
                        <span className={`text-base font-bold text-gray-100`}>
                          {userMap.get(request.receiverID)?.firstName}{" "}
                          {userMap.get(request.receiverID)?.lastName}
                        </span>
                        <span
                          className={`text-sm font-medium text-gray-100/30`}
                        >
                          @{userMap.get(request.receiverID)?.username}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex flex-row gap-4 items-start font-wsans text-gray-100/40 grow border border-gray-100/5  p-4 rounded-2xl`}
                    >
                      {request.message}
                    </div>

                    <span
                      className={`text-sm font-medium text-gray-100/10 font-wsans w-full text-end`}
                    >
                      {/* format time with the specific time in day */}
                      {dayjs(request.createdAt).format("MM/DD/YYYY")} at{" "}
                      {dayjs(request.createdAt).format("h:mm A")}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
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
                <FriendSearchResult user={user} onAdd={setFriendRequests} key={user._id} />
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
