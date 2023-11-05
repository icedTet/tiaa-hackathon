import dayjs from "dayjs";
import { request } from "http";
import { FriendRequest, User } from "../../utils/types";
import { UserProfile } from "../UserProfile";
import { apiDomain } from "../../constants";
import { useState } from "react";
import { fetcher } from "../../utils/Fetcher";

export const IncomingFriendRequest = (props: {
  request: FriendRequest;
  user: User;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}) => {
  const { request, user, onAccept, onReject } = props;
  const [loading, setLoading] = useState(false);
  const acceptRequest = async () => {
    setLoading(true);
    try {
      await fetcher(`${apiDomain}/friends/requests/${request._id}/accept`, {
        method: "POST",
      });
     await onAccept();
    } catch (e) {}
    setLoading(false);
  };
  const rejectRequest = async () => {
    setLoading(true);
    try {
      await fetcher(`${apiDomain}/friends/requests/${request._id}/reject`, {
        method: "POST",
      });
      await onReject();
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div
      className={`w-[50ch] aspect-video p-8 flex flex-col gap-4 bg-gray-850 rounded-3xl relative border border-gray-100/5 shadow-lg drop-shadow-md ${
        loading && "opacity-50 pointer-events-none"
      }`}
      key={request._id}
    >
      <div className={`flex flex-row gap-4 items-center`}>
        <UserProfile user={user!} className={`w-12 h-12`} />
        <div className={`flex flex-col gap-1`}>
          <span className={`text-base font-bold text-gray-100`}>
            {user?.firstName} {user?.lastName}
          </span>
          <span className={`text-sm font-medium text-gray-100/30`}>
            @{user?.username}
          </span>
        </div>
      </div>
      <div
        className={`flex flex-row gap-4 items-start font-wsans text-gray-100/40 grow border border-gray-100/5  p-4 rounded-2xl`}
      >
        {request.message}
      </div>
      <div className={`flex flex-row justify-between w-full items-baseline`}>
        <div className={`flex flex-row gap-4 items-center`}>
          <button
            className={`flex flex-row gap-2 items-center px-4 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 ease-in-out`}
            onClick={acceptRequest}
          >
            <span
              className={`text-sm font-bold text-gray-100 whitespace-nowrap`}
            >
              Accept
            </span>
          </button>
          <button
            className={`flex flex-row gap-2 items-center px-4 py-2 rounded-2xl bg-red-500 hover:bg-red-600 transition-all duration-200 ease-in-out`}
            onClick={rejectRequest}
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
  );
};
export const OutgoingFriendRequest = (props: {
  request: FriendRequest;
  user: User;
}) => {
  const { request, user } = props;
  const [loading, setLoading] = useState(false);

  return (
    <div
      className={`w-[50ch] aspect-video p-8 flex flex-col gap-4 bg-gray-850 rounded-3xl relative border border-gray-100/5 shadow-lg drop-shadow-md`}
      key={request._id}
    >
      <div className={`flex flex-row gap-4 items-center`}>
        <UserProfile user={user!} className={`w-12 h-12`} />
        <div className={`flex flex-col gap-1`}>
          <span className={`text-base font-bold text-gray-100`}>
            {user?.firstName} {user?.lastName}
          </span>
          <span className={`text-sm font-medium text-gray-100/30`}>
            @{user?.username}
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
  );
};
