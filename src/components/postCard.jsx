import React from "react";
import ProfileSection from "./ProfileSection";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect } from "react";
import { useState } from "react";
import { toggleMuted } from "../features/video/muted";
import CommentDialog from "./commentDialog";

const PostCard = ({ post, itemsRef, index, observerRef }) => {
  const [isCommentDialogVisible, setIsCommentDialogVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(post.isLiked)

  console.log("Incomming post",  post)

  const toggleLike = async ()=>{
    let response = await fetch(`http://localhost:3000/v1/post/${post._id}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      postId: post._id
      })
    });

    console.log("toggleLike",response.data)

    if (!response.ok) { 
      console.error("Something went wrong");
      return;
    }

    // alert("Request completed")

    if(post.isLiked){
      post.isLiked = false
      post.likesCount -= 1
    }
    else{
      post.isLiked = true
      post.likesCount += 1
    }
    setIsLiked((state)=>!state)
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-[var(--backGround)] border-[var(--borderLight)] w-full border-t border-b h-auto">
      {isCommentDialogVisible && (
        <CommentDialog
          postId={post._id}
          visible={isCommentDialogVisible}
          onClose={() => {
            setIsCommentDialogVisible(false);
          }}
          comments={comments}
        />
      )}
      <ProfileSection user={post.ownerDetails} isFollowRequestReceived={post.isFollowRequestReceived} isFollowRequestSent={post.isFollowRequestSent} isFollowed={post.isFollowed} />

      <div className="text-white">{post.title}</div>

      <MediaCard
        fileUrl={post.fileUrl}
        itemsRef={itemsRef}
        observerRef={observerRef}
        index={index}
      />

      <hr className="border-t border-[var(--borderLight)]" />

      <div className="flex items-center text-gray-400 text-sm gap-6">
        <div className="flex gap-1">
          <span
            className="material-symbols-outlined cursor-pointer"
            onClick={() => {
              setIsCommentDialogVisible(true);
            }}
          >
            mode_comment
          </span>
          <p>{post.commentsCount}</p>
        </div>
        <div className="flex gap-1">
          <span
            className="material-symbols-outlined cursor-pointer transition-colors"
            style={{
              color: isLiked ? "red" : "grey",
              fontVariationSettings: `${isLiked ?  "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : ""}`,
            }}
            onClick={toggleLike}
          >
            favorite
          </span>
          <p>{post.likesCount}</p>
        </div>
        <span className="material-symbols-outlined cursor-pointer">
          forward
        </span>
      </div>
    </div>
  );
};

function MediaCard({ fileUrl, itemsRef, index, observerRef }) {
  const totalMedia = fileUrl.length - 1;
  const [currentVisibleMedia, setCurrentVisibleMedia] = useState(0);
  console.log("post fileUrl", fileUrl)

  return (
    <div className="relative rounded-lg overflow-hidden flex justify-center items-center bg-black w-full h-[450px]">
      {/* Arrows */}
      {fileUrl.length > 1 && (
        <div className="absolute z-10 flex justify-between w-full px-2 text-white">
          <span
            className="cursor-pointer"
            onClick={() =>
              setCurrentVisibleMedia((curr) => Math.max(0, curr - 1))
            }
          >
            <span className="material-symbols-outlined">arrow_left</span>
          </span>
          <span
            className="cursor-pointer"
            onClick={() =>
              setCurrentVisibleMedia((curr) => Math.min(curr + 1, totalMedia))
            }
          >
            <span className="material-symbols-outlined">arrow_right</span>
          </span>
        </div>
      )}

      {/* Media Display */}
      <Media
        url={fileUrl[currentVisibleMedia].url}
        itemsRef={itemsRef}
        observerRef={observerRef}
        index={index}
      />
    </div>
  );
}

function Media({ url, itemsRef, index, observerRef }) {
  const mediaType = url.includes("video") ? "video" : "image";
  const isMuted = useSelector((state) => state.mute.value);
  const dispatch = useDispatch();

  // So basically when the global state changes, it does not chnage the already existing or rendered components, so we need to force that change
  useEffect(() => {
    if (itemsRef.current[index].id === "VIDEO") {
      itemsRef.current[index].muted = isMuted;
    }
  }, [isMuted]);
  useEffect(() => {
    observerRef.current?.observe(itemsRef.current[index]);
  }, [itemsRef.current[index]]);

  const handleVolumeChange = () => {
    const video = itemsRef.current[index];
    if (!video) return;
    if (video.muted !== isMuted) {
      dispatch(toggleMuted());
    }
  };

  if (mediaType === "image") {
    return (
      <img
        src={url}
        alt="Post Media"
        className="w-full h-full object-contain"
        id="IMAGE"
        ref={(el) => (itemsRef.current[index] = el)}
      />
    );
  }

  if (mediaType === "video") {
    return (
      <video
        ref={(el) => (itemsRef.current[index] = el)}
        controls
        muted={isMuted}
        playsInline
        onVolumeChange={handleVolumeChange}
        className="w-full h-full object-scale-down"
        id="VIDEO"
        loop
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
}

export { PostCard };
