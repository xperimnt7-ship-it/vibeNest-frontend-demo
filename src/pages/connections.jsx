import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { acceptRequest, rejectRequest, removeFollower, createRequest, removeRequest } from '../api/follow';

const UserCard = ({ data, buttonText, onClick, onReject = null }) => {
  console.log("usercard", data);

  return (
    <div className="w-full max-w-[590px] h-auto px-4 py-2">
      {/* Upper Part: Profile Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={data?.userDetails?.avatar?.url}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-4 border-2 border-white object-cover"
          />
          <div>
            <h2 className="font-semibold text-base text-white">{data.userDetails.userName}</h2>
            <p className="text-sm text-gray-400">@{data.userDetails._id}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {buttonText && (
            <button
              onClick={() => onClick(data)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              {buttonText}
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(data)}
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



// --- Followers Component ---
const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const loggedinUser = useSelector((state)=>(state.auth.user))
  console.log("Followers component called")

  useEffect(() => {
    console.log("Now fetching data")

    fetch(`http://localhost:3000/v1/user/${loggedinUser._id}/followers`, { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(res => setFollowers(res?.data))
      .catch(err => console.error('Error fetching followers:', err));
  }, []);

  return (
    <div className="overflow-y-auto h-[calc(100vh-50px)] p-4 flex flex-col gap-2">
      {followers.map(follower => (
        <UserCard
          key={follower.id}
          data={follower}
          buttonText="Remove"
          onClick={()=>{
            removeFollower(follower._id ,loggedinUser._id).then(
              setFollowers.filter((prev)=>prev._id!=follower._id)
            )
          }}
        />
      ))}
    </div>
  );
};

// --- Requests Sent Component ---
const RequestsSent = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const loggedinUser = useSelector((state)=>(state.auth.user))

  useEffect(() => {
    fetch(`http://localhost:3000/v1/user/${loggedinUser._id}/follow-requests/sent`, { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(res => setSentRequests(res?.data))
      .catch(err => console.error('Error fetching sent requests:', err));
  }, []);

  return (
    <div className="overflow-y-auto h-[calc(100vh-50px)] p-4 flex flex-col gap-2">
      {sentRequests.map(request => (
        <UserCard
          key={request.id}
          data={request}
          buttonText="Cancel"
          onClick={()=>{
            removeRequest(request._id, loggedinUser._id).then(
              setSentRequests.filter((prev)=>prev._id!=request._id)
            )
          }}
        />
      ))}
    </div>
  );
};

// --- Requests Received Component ---
const RequestsReceived = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const loggedinUser = useSelector((state)=>(state.auth.user))

  useEffect(() => {
    fetch(`http://localhost:3000/v1/user/${loggedinUser._id}/follow-requests/received`, { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(res => setReceivedRequests(res?.data))
      .catch(err => console.error('Error fetching received requests:', err));
  }, []);

  return (
    <div className="overflow-y-auto h-[calc(100vh-50px)] p-4 flex flex-col gap-2">
      {receivedRequests.map(request => (
        <UserCard
          key={request.id}
          data={request}
          buttonText="Accept"
          onClick = {()=>{
            acceptRequest(request._id ,loggedinUser._id).then(
              setReceivedRequests.filter((prev)=>prev._id!=request._id)
            )
          }}
          onReject = {()=>{rejectRequest(request._id ,loggedinUser._id)}}
        />
      ))}
    </div>
  );
};

// --- Main Page Component ---
export default function SocialTabsPage() {
  const [activeTab, setActiveTab] = useState('followers');
  const loggedinUser = useSelector((state)=>(state.auth.user))

  console.log("loggedinUser", loggedinUser)

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'followers':
        return <Followers />;
      case 'sent':
        return <RequestsSent />;
      case 'received':
        return <RequestsReceived />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[600px] bg-black h-[100vh] border border-gray-500 p-2 overflow-auto">
      <div className="w-full max-w-[600px] relative h-full">

        {/* Top Bar Tabs */}
        <div className="w-full bg-black  border-b border-gray-700 flex">
          <div className={`bg-black w-[33%] text-white p-2 ${activeTab === 'followers' ? "bg-gray-600" : "bg-black"} flex justify-center items-center cursor-pointer`} onClick={()=>{setActiveTab('followers')}}>
            followers
          </div>
          <div className={`bg-black w-[33%] text-white p-2 ${activeTab === 'sent' ? "bg-gray-600" : "bg-black"} flex justify-center items-center cursor-pointer`} onClick={()=>{setActiveTab('sent')}}>
            sent
          </div>
          <div className={`bg-black w-[33%] text-white p-2 ${activeTab === 'received' ? "bg-gray-600" : "bg-black"} flex justify-center items-center cursor-pointer`} onClick={()=>{setActiveTab('received')}}>
            received
          </div>
        </div>

        {renderActiveComponent()}
      </div>
    </div>
  );
}
