import React, { useState, useEffect } from "react";
import CommentCard from "./commentCard";
import { useSelector } from 'react-redux'

const CommentDialog = ({
  postId,
  visible,
  onClose,
  dialogTitle = "Comments",
}) => {
  if (!visible) return null;


  const [commentMessage, setCommentMessage] = useState("");
  const [comments, setComments] = useState([])
  const user = useSelector((state)=>state?.auth?.user)


  const onCommentChange = (e) => {
    setCommentMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (commentMessage.trim()) {
      let response = await fetch(`http://localhost:3000/v1/post/${postId}/comment`, 
        {
          method:"POST", credentials: "include",
          body: JSON.stringify({content: commentMessage}),
          headers: {
            "Content-Type": "application/json"
          }
        }
      )

      if(!response.ok){
        alert("Something Went wrong")
        return;
      }

      response=(await response.json()).data
      console.log(response.data)
      response.ownerDetails = {
        _id: user?._id,
        userName: user?.userName,
        avatar: user?.avatar
      }
      console.log("now final response", response)
      setComments([response, ...comments])
      setCommentMessage("");
    }
  };

  useEffect(()=>{
    const fetchComments = async()=>{
      let response = await fetch(`http://localhost:3000/v1/post/${postId}/comments`, {method: "GET", credentials :"include"})
      
      if (!response.ok) {
        console.error("Failed to fetch comments");
        return;
      }
      response = await response.json()
      setComments(response.data)
    }
    fetchComments()
  }, [])

  return (
    <div
      className="backdrop-blur-xs fixed top-0 left-0 w-[100vw] h-[100vh] justify-center items-center z-20 bg-gray-700/40 flex flex-col gap-3"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-[90%] md:w-[50%]">
        <input
          type="text"
          value={commentMessage}
          onChange={onCommentChange}
          placeholder="Add Your Comment"
          className="w-full p-2 rounded-md border border-gray-400 bg-black text-white placeholder-gray-400"
        />
      </div>

      <div
        className="w-[90%] md:w-[50%] h-[60%] md:h-[70%] bg-black text-white rounded-lg p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-2">{dialogTitle}</h2>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto border border-gray-600 rounded-md p-2 mb-4 your-container">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No comments yet.</p>
          ) : (
            comments.map((comment, index) => (
              <CommentCard key={index} comment={comment} />
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3">
          <button
            className="w-full p-2 border border-white rounded-full hover:bg-white hover:text-black transition"
            onClick={handleSubmit}
          >
            Post
          </button>
          <button
            className="w-full p-2 border border-white rounded-full hover:bg-white hover:text-black transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;