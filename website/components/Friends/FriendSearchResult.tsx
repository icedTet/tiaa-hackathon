import { useState } from "react";
import { apiDomain } from "../../constants";
import { User } from "../../utils/types";
import { UserProfile } from "../UserProfile";
import { fetcher } from "../../utils/Fetcher";

export const FriendSearchResult = (props: {
  user: User;
    onAdd: () => void;
}) => {
  const { user,onAdd } = props;
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const addFriend = async () => {
    setLoading(true);
    try {
      const resp = await fetcher(`${apiDomain}/friends/requests/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user._id,
        }),
      });
      if (!resp.ok) {
        setAdded(true);
        await onAdd();
      }
      //   props.onAdd();
    } catch (e) {
    //   setError(e);
    }
    setLoading(false);
  };
  return (
    <div className={`flex flex-row gap-4 items-center justify-between w-full`}>
      <div className={`flex flex-row gap-4 items-center`}>
        <UserProfile user={user} className={`w-12 h-12`} />
        <div className={`flex flex-col gap-1`}>
          <span className={`text-base font-bold text-gray-100`}>
            {user.firstName} {user.lastName}
          </span>
          <span className={`text-sm font-medium text-gray-100/30`}>
            @{user.username}
          </span>
        </div>
      </div>
      <button
        className={`flex flex-row gap-2 items-center px-4 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50`}
        disabled={added || loading}
        onClick={addFriend}
      >
        <span className={`text-sm font-bold text-gray-100`}>{added ?`Request Sent` :`Add Friend`}</span>
      </button>
    </div>
  );
};
