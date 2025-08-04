import React, { useEffect, useRef, useState } from 'react'
import { TrendCard } from './trendCard';
import DialogForm from './dialogForm.jsx';

function Trending() {
  const [trending, setTrending] = useState([])
  const [search, setSearch] = useState("")
  const [searchedTrend, setSearchedTrend] = useState(null)
  const [activeTab, setActiveTab] = useState("trending") // 'trending' or 'searched'
  const [createNewTrendTag, setCreateNewTrendTag] = useState(null)

  const handleOnChange = (e) => {
    setSearch(e.target.value)
  }

  const onSearchClick = async (e) => {
    e.preventDefault()
    if (!search || search[0] !== "#") {
      alert("Enter Valid Tag")
      return;
    }

    const tagWithoutHash = search.slice(1);

    try {
      setCreateNewTrendTag(null)
      const response = await fetch(`http://localhost:3000/v1/trending/${tagWithoutHash}`);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Search Operation could not be completed")
        return;
      }

      setSearchedTrend(data?.data);
      setActiveTab("searched");

      if(!searchedTrend)
        setCreateNewTrendTag(search)
      console.log("create new trend",createNewTrendTag)

      setSearch("")

    } catch (err) {
      console.error("Search error:", err);
      alert("Network error");
    }
  }

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("http://localhost:3000/v1/trending");
        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Something went wrong");
          return;
        }

        setTrending(data?.data);
      } catch (error) {
        console.error("Error fetching trends:", error);
        alert("Network error");
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="hidden md:flex w-[350px] flex-col gap-4 p-4 bg-black text-white h-[100vh]">
      <form onSubmit={onSearchClick}>
        <input
          type="text"
          name='search'
          className="w-full border h-[30px] rounded-full p-2 text-white"
          value={search}
          onChange={handleOnChange}
          placeholder="Search or create new trend..."
        />
      </form>

      {/* Tabs */}
      <div className="flex justify-between mt-2">
        <button
          className={`text-sm font-medium ${activeTab === "trending" ? "underline" : "opacity-50"}`}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </button>
        <button
          className={`text-sm font-medium ${activeTab === "searched" ? "underline" : "opacity-50"}`}
          onClick={() => setActiveTab("searched")}
        >
          Searched
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 h-full">
        {activeTab === "trending" && <TrendingTab trending={trending} />}
        {activeTab === "searched" && <SearchedTab searchedTrend={searchedTrend} createNewTrendTag = {createNewTrendTag} setCreateNewTrendTag={setCreateNewTrendTag} setTrending={setTrending} trending={trending}/>}
      </div>
    </div>
  )
}

export default Trending

function TrendingTab({ trending }) {
  return (
    <div className="h-full w-full flex flex-col">
      <h2 className="text-lg font-bold mb-2">What's Trending</h2>
      
      {/* Scrollable List Container */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-2 your-container">
        {
          trending.length === 0
            ? <p>Create a New Trend</p>
            : trending.map((item, index) => (
              <div key={index} className="w-full">
                <TrendCard trend={item} />
              </div>
            ))
        }
      </div>
    </div>
  );
}

function SearchedTab({ searchedTrend, createNewTrendTag, setCreateNewTrendTag , setTrending, trending}) {
  const [isDialogFormVisible, setIsDialogFormVisible] = useState(false)
  const fields = [{
    label: "trend name",
    type: "text",
    name: "trend",
    value: createNewTrendTag,
    disabled: "true"
  }]
  const onNext = async ()=>{
    const tag = createNewTrendTag.slice(1)
    let response = await fetch("http://localhost:3000/v1/trending", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tag: tag
      }),
      credentials : "include"
    })

    if(!response.ok){
      alert("Request cannot be completed")
      return;
    }

    response = await response.json()

    alert("New trend created")

    console.log("respons.data", response.data)
    setTrending([...trending, response?.data])
    setCreateNewTrendTag(null)
    setIsDialogFormVisible(false)
  }

  return (
    <>
      {isDialogFormVisible && <DialogForm tag={"Create a new trend"} visible={isDialogFormVisible} onClose={()=>{setIsDialogFormVisible(false)}} fields={fields} onConfirm={onNext}/>}
      <h2 className="text-lg font-bold">Search Results</h2>
      {
        searchedTrend ? (
          <div className="flex flex-col w-full h-full your-container">
            <TrendCard trend={searchedTrend} />
          </div>
        ) : (
          <p>Search or create a new trend</p>
        )
      }
      {
        !createNewTrendTag? "" :  (
          <p className='text-red-500 cursor-pointer' onClick={()=>{setIsDialogFormVisible(true)}}>
            create a new trending named {createNewTrendTag}
          </p>
        )
      }
    </>
  );
}
