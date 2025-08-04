import React from "react";

const ProfileSection = ({ user, isFollowRequestReceived, isFollowRequestSent, isFollowed}) => {

  let tag = null
  if(isFollowRequestReceived)
    tag = "Accept"
  else if(isFollowRequestSent)
    tag = "Requested"
  else if(isFollowed)
    tag = "Following"
  else tag = "Follow"

  return (
    <div className="flex justify-between w-full md:w-1/2">
      <div className="profile flex gap-3">
        <img
          src={user.avatar.url}
          alt="Avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="text-white font-semibold">{user.userName}</h3>
        </div>
      </div>
      <button
        className="h-auto w-auto p-2 border border-[var(--borderLight)] rounded-full text-white cursor-pointer
                  hover:bg-[var(--buttonBg)] hover:text-black 
                  transition duration-300 ease-in-out"
      >
        {tag}
      </button>
    </div>
  );
};

export default ProfileSection;

