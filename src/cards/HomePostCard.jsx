import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleMuted } from "../features/video/muted";
import { postsAPI } from "../api/posts";
import ProfileSection from "../components/ProfileSection";
import CommentDialog from "../components/commentDialog";

const HomePostCard = ({ post, itemsRef, index, observerRef }) => {
  const [isCommentDialogVisible, setIsCommentDialogVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const toggleLike = async () => {
    try {
      await postsAPI.toggleLike(post._id);
      
      // Optimistic update
      if (isLiked) {
        setLikesCount(prev => prev - 1);
      } else {
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-[var(--backGround)] border-[var(--borderLight)] w-full border-t border-b h-auto">
      {isCommentDialogVisible && (
        <CommentDialog
          postId={post._id}
          visible={isCommentDialogVisible}
          onClose={() => setIsCommentDialogVisible(false)}
          comments={comments}
        />
      )}
      
      <ProfileSection 
        user={post.ownerDetails} 
        isFollowRequestReceived={post.isFollowRequestReceived} 
        isFollowRequestSent={post.isFollowRequestSent} 
        isFollowed={post.isFollowed} 
      />

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
            className="material-symbols-outlined cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() => setIsCommentDialogVisible(true)}
          >
            mode_comment
          </span>
          <p>{post.commentsCount}</p>
        </div>
        
        <div className="flex gap-1">
          <span
            className="material-symbols-outlined cursor-pointer transition-colors hover:scale-110"
            style={{
              color: isLiked ? "red" : "grey",
              fontVariationSettings: `${isLiked ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : ""}`,
            }}
            onClick={toggleLike}
          >
            favorite
          </span>
          <p>{likesCount}</p>
        </div>
        
        <span className="material-symbols-outlined cursor-pointer hover:text-green-500 transition-colors">
          forward
        </span>
      </div>
    </div>
  );
};

const MediaCard = ({ fileUrl, itemsRef, index, observerRef }) => {
  const totalMedia = fileUrl.length - 1;
  const [currentVisibleMedia, setCurrentVisibleMedia] = useState(0);

  return (
    <div className="relative rounded-lg overflow-hidden flex justify-center items-center bg-black w-full h-[450px]">
      {/* Navigation Arrows */}
      {fileUrl.length > 1 && (
        <div className="absolute z-10 flex justify-between w-full px-2 text-white">
          <span
            className="cursor-pointer hover:bg-black/50 rounded-full p-1 transition-colors"
            onClick={() =>
              setCurrentVisibleMedia((curr) => Math.max(0, curr - 1))
            }
          >
            <span className="material-symbols-outlined">arrow_left</span>
          </span>
          <span
            className="cursor-pointer hover:bg-black/50 rounded-full p-1 transition-colors"
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

      {/* Media Indicators */}
      {fileUrl.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {fileUrl.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentVisibleMedia ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Media = ({ url, itemsRef, index, observerRef }) => {
  const mediaType = url.includes("video") ? "video" : "image";
  const isMuted = useSelector((state) => state.mute.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (itemsRef.current[index]?.id === "VIDEO") {
      itemsRef.current[index].muted = isMuted;
    }
  }, [isMuted, index]);

  useEffect(() => {
    if (observerRef.current && itemsRef.current[index]) {
      observerRef.current.observe(itemsRef.current[index]);
    }
  }, [index]);

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
};

export default HomePostCard;