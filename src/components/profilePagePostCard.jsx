import React from "react";
import { SimpleMediaCard } from "./simpleCard";

function ProfilePagePostCard({post, setMyPosts}) {
  console.log(post);
  const handleDetlete = async()=>{
    alert("Delete Clicked")
    const response = await fetch(`http://localhost:3000/v1/posts/${post._id}`, {
      method: "DELETE",
      credentials: "include"
    })
    if(!response.ok){
      console.log("Unable to delete post")
      alert("Something went wrong")
      return;
    }

    setMyPosts((prev)=>(
      prev.filter((item)=>item._id!=post._id)
    ))
  }
  return (
    <div class="relative group border-2 border-white w-[120px] h-[120px] md:w-[220px] md:h-[220px] mx-7 rounded-lg overflow-hidden mt-4">
      <SimpleMediaCard fileUrls={post.fileUrl}/>
      <div class="absolute inset-0 bg-transparent opacity-0 flex justify-center items-center gap-2 text-white  group-hover:opacity-100 transition-opacity duration-300 font-bold">
        <p>❤️ {post.likesCount} </p>
        <p>🗨️ {post.commentsCount}</p>
      </div>
      {/* Delete Icon */}
      <span
        className="absolute top-2 right-2 z-10 text-white bg-transparent rounded-full p-1 cursor-pointer hover:bg-red-600"
        onClick={handleDetlete} // Define this function
        title="Delete media"
      >
        <span className="material-symbols-outlined">delete</span>
      </span>
    </div>
  );
}

export default ProfilePagePostCard;
