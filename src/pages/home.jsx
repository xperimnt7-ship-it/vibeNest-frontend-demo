import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { postsAPI } from "../api/posts";
import HomePostCard from "../cards/HomePostCard";
import CreatePost from "../components/CreatePost";
import { useAuth } from "../hooks/useAuth";


const demoPost = {
                "_id": "686bc9f69c60fc6ce1aa703d",
                "title": "Checking pAgination",
                "description": "This is my first Post",
                "fileUrl": [
                    {
                        "url": "https://res.cloudinary.com/realbeast/video/upload/v1751893177/olmyigw6uddsc2wxna5j.mp4",
                        "public_id": "olmyigw6uddsc2wxna5j"
                    },
                    {
                        "url": "https://res.cloudinary.com/realbeast/image/upload/v1751893179/x0gbhhyppji2lysvcn6d.jpg",
                        "public_id": "x0gbhhyppji2lysvcn6d"
                    }
                ],
                "ownerId": "68696ee0247c334996c44968",
                "views": 0,
                "likesCount": 0,
                "commentsCount": 0,
                "createdAt": "2025-07-07T13:21:58.580Z",
                "ownerDetails": {
                    "_id": "68696ee0247c334996c44968",
                    "userName": "realbeast",
                    "avatar": "https://res.cloudinary.com/realbeast/image/upload/v1751740127/ukjwoom1va1iv1tjrs8s.jpg"
                },
                "isLiked": false
            };

function Home() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const itemsRef = useRef([]);
  const observerRef = useRef(null);
  const [prevLen, setPrevLen] = useState(0);

  // Infinite scroll hook for posts
  const {
    data: allPosts,
    isLoading: postsLoading,
    hasMore,
    error: postsError,
    loadingRef
  } = useInfiniteScroll(
    async (page, pageSize) => {
      return await postsAPI.getPosts(page, pageSize);
    },
    {
      enabled: isLoggedIn,
      pageSize: 5
    }
  );

  // Handle post creation
  const handlePostCreated = (newPost) => {
    // Refresh the posts list
    window.location.reload();
  };

  // Set up video intersection observer
  useEffect(() => {
    const options = {
      rootMargin: "0px",
      scrollMargin: "0px",
      threshold: 0.6,
    };
    
    const callback = (entries) => {
      entries.forEach((entry) => {
        const videoElement = entry.target;

        if (entry.isIntersecting) {
          if (videoElement && videoElement.id === "VIDEO") {
            videoElement.play().catch((err) => {
              console.error("Autoplay failed:", err);
            });
          }
        } else {
          if (videoElement && videoElement.tagName === "VIDEO") {
            videoElement.pause();
          }
        }
      });
    };
    
    observerRef.current = new IntersectionObserver(callback, options);
  }, []);

  // Update refs when posts change
  useEffect(() => {
    for (let i = prevLen; i < allPosts.length; i++) {
      itemsRef.current[i] = null;
    }
    setPrevLen(allPosts.length);
  }, [allPosts, prevLen]);




  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="w-full max-w-[600px] h-[100vh] bg-[var(--backGround)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] h-[100vh] bg-[var(--backGround)] overflow-y-auto border-x border-[var(--borderLight)] your-container">
      {isLoggedIn && <CreatePost onPostCreated={handlePostCreated} />}
      
      {postsError && (
        <div className="p-4 text-red-400 text-center">
          Error loading posts: {postsError}
        </div>
      )}
      
      {allPosts.map((post, index) => (
        <HomePostCard 
          post={post} 
          key={post._id || index} 
          itemsRef={itemsRef} 
          index={index} 
          observerRef={observerRef}
        />
      ))}
      
      {/* Loading indicator for infinite scroll */}
      {postsLoading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Intersection observer target for infinite scroll */}
      <div ref={loadingRef} className="h-4" />
    </div>
  );
}

export default Home;
