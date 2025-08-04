import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, login, setUser } from "../features/auth/authSlice";
import { PostCard } from "../components/postCard";
import CreatePostComponent from "../components/createPostComponent.jsx";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


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
  let isLoggedIn = useSelector((state) => state.auth.isLoggedin);
  const dispatch = useDispatch();
  const [allPosts, setAllPosts] = useState([])
  const itemsRef = useRef([])
  const [prevLen, setPrevLen] = useState(0)
  const observerRef = useRef(null); 
  const [fetchNextPage, setFetchNextPage] = useState(true)
  const [metaData, setMetaData] = useState({
    pageLimit: 3,
    lastCreatedAt: null,
    lastPostId: null
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) return;

    const refreshToken = async () => {
      try {
        let response = await fetch("http://localhost:3000/v1/auth/refresh", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          alert(response.message)
          navigate("/login")
          return null;
        }

        console.log("Token refreshed");

        const userData = await response.json();
        console.log("UserData in redux",userData?.data?.user);  // this is an array of objects, so we need to deStructure
        dispatch(setUser(...(userData?.data?.user)));
        dispatch(login());
      } catch (error) {
        console.error("Failed to refresh token", error);
      }
    };

    refreshToken();
  }, []);

  useEffect(()=>{
    if(!fetchNextPage)
      return;

    const fetchPostsNextPage = async ()=>{
      console.log("fetchPostsNextPage called")
      let response = await fetch(`http://localhost:3000/v1/posts`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("fetch posts",response)
      if(!response.ok){
        alert("Something went wrong")
        return
      }
      response = await response.json()

      setMetaData(response?.data?.metaData)
      setAllPosts([...allPosts,...response.data.result])
    }

    fetchPostsNextPage()

  },[fetchNextPage])

  useEffect(()=>{
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
  },[])

  useEffect(()=>{
    for(let i=prevLen;i<allPosts.length;i++){
      itemsRef.current[i] = null
      // observerRef.current.observe(itemsRef.current[i])
    }
    setPrevLen(allPosts.length)
  }, [allPosts])


  return (
    <div className="w-full max-w-[600px] h-[100vh] bg-[var(--backGround)] overflow-y-auto border-x border-[var(--borderLight)] your-container">
      <CreatePostComponent />
      {
        allPosts.map((post, index)=>{
          return <PostCard post={post} key={index} itemsRef = {itemsRef} index = {index} observerRef = {observerRef}/>
        })
      }
    </div>
  );
}

export default Home;
