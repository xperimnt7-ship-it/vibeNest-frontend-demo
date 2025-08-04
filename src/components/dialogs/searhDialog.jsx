import React, { useState } from "react";
import { useSelector } from 'react-redux'
import { getUser } from "../../api/user";
import { acceptRequest, rejectRequest, createRequest, removeFollower, removeRequest } from "../../api/follow";

const UserCard = ({ data, buttonText, onClick, onReject = null }) => {

  return (
    <div className="w-full max-w-[590px] h-auto px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={data?.avatar?.url}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-4 border-2 border-white object-cover"
          />
          <div>
            <h2 className="font-semibold text-base text-white">{data?.userName}</h2>
            <p className="text-sm text-gray-400">@{data?.fullName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {buttonText && (
            <button
              onClick={onClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              {buttonText}
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchDialog = ({ visible, onClose, dialogTitle = "Search User" }) => {
  if (!visible) return null;

  const [searchUserDetail, setSearchUserDetail] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const loggedinUser = useSelector((state) => state?.auth?.user);

  const handleOnChange = (e) => {
    setSearchUserDetail(e.target.value);
  };

  const handleSubmit = async () => {
    if(!searchUserDetail.trim())
        return

    const data = await getUser(searchUserDetail)
    if(!data)
        return

    setSearchedUser(data)
  };

  const handleRemoveFollower = async () => {
    const result = await removeFollower( searchedUser?.followerId, loggedinUser._id)
    if(!result)
        return

    //Update Searched User
  };

  const handleSendFollowRequest = async () => {
    const result = await createRequest(searchedUser?._id)
    if(!result)
        return

    //Update Searched User
  };

  const handleAcceptRequest = async () => {
    const result = await acceptRequest( searchedUser?.requestReceivedId, loggedinUser._id)
    if(!result)
        return

    //Update Searched User
  };

  const handleRejectRequest = async () => {
    const result = await rejectRequest( searchedUser?.requestReceivedId, loggedinUser._id)
    if(!result)
        return

    //Update Searched User
  };

  const handleRemoveRequest = async () => {
    const result = await removeRequest(searchedUser?.requestSentId, loggedinUser._id)
    if(!result)
        return
  }

  const renderUserCard = () => {
    if (!searchedUser) return null;

    if (searchedUser.followerId) {
      return <UserCard data={searchedUser} buttonText={"Unfollow"} onClick={handleRemoveFollower} />;
    }

    if (searchedUser.requestSentId) {
      return <UserCard data={searchedUser} buttonText={"Cancel Request"} onClick={handleRemoveRequest} />;
    }

    if (searchedUser.requestReceivedId) {
      return <UserCard data={searchedUser} buttonText={"Accept"} onClick={handleAcceptRequest} onReject={handleRejectRequest} />;
    }

    return <UserCard data={searchedUser} buttonText={"Follow"} onClick={handleSendFollowRequest} />;
  };

  return (
    <div
      className="backdrop-blur-xs fixed top-0 left-0 w-[100vw] h-[100vh] justify-center items-center z-20 bg-gray-700/40 flex flex-col gap-3"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-[90%] md:w-[50%]">
        <input
          type="text"
          value={searchUserDetail}
          onChange={handleOnChange}
          placeholder="Enter userName or userId"
          className="w-full p-2 rounded-md border border-gray-400 bg-black text-white placeholder-gray-400"
        />
      </div>

      <div
        className="w-[90%] md:w-[50%] h-[60%] md:h-[70%] bg-black text-white rounded-lg p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-2">{dialogTitle}</h2>

        {/* Searched User */}
        {renderUserCard()}

        {/* Footer Actions */}
        <div className="flex gap-3 mt-auto">
          <button
            className="w-full p-2 border border-white rounded-full hover:bg-white hover:text-black transition"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="w-full p-2 border border-blue-500 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;