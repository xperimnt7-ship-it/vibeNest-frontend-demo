import React, { useRef, useState } from "react";
import DialogForm from "./dialogForm.jsx";

function CreatePostComponent() {  
  const icons = [
    {
      name: "image",
      type: "file",
      accept: "image/*",
    },
    {
      name: "video_file",
      type: "file",
      accept: "video/*",
    },
  ];

  const [selectedMedia, setSelectedMedia] = useState([]);
  const [title, setTitle] = useState("")
  const onTitleChange = (e)=>{
    setTitle(e.target.value)
  }
  const inputRef = useRef([]); // array of refs

  const onChange = (e) => {
    const file = e.target.files?.[0];
    const selectedPreviewUrl = file ? URL.createObjectURL(file) : undefined;
    if (selectedPreviewUrl) {
      setSelectedMedia((prev) => [...prev, selectedPreviewUrl]);
    }
  };

  const onSubmit = ()=>{
    const formData = new FormData();
    selectedMedia.forEach((url)=>{
      formData.append("media", url)
    })
    formData.append("title", title)
  }

  return (
    <div className="flex flex-col gap-3 bg-[var(--backGround)] border border-[var(--borderLight)] w-full px-4 mt-[50px]">
      <div className="flex gap-3">
        <div>
          <img
            src="person1.jpeg"
            alt="Avatar"
            className="h-12 w-12 rounded-full object-cover mt-1"
          />
        </div>
        <textarea
          name = "title"
          onChange={onTitleChange}
          value={title}
          className="flex-1 text-white resize-none w-full mt-1 p-1 outline-none"
          placeholder="Post Your Vibe..."
        ></textarea>
      </div>
      <hr className="border border-[var(--borderLight)]" />
      <div className="w-full px-2 flex justify-between items-center">
        <div className="flex gap-4">
          {icons.map((item, index) => (
            <div key={index}>
              <input
                type={item.type}
                hidden
                accept={item.accept}
                ref={(el) => (inputRef.current[index] = el)}
                onChange={onChange}
              />
              <span
                className="hover:text-blue-500 text-white cursor-pointer material-symbols-outlined"
                onClick={() => {
                  if (inputRef.current[index]) {
                    inputRef.current[index].value = null; // reset input
                    inputRef.current[index].click();
                  }
                }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
        <button className="text-white hover:text-blue-500 cursor-pointer" onClick={onSubmit}>
          Post
        </button>
      </div>

    {/* <SimpleMediaCard fileUrls={selectedMedia}/> */}

    </div>
  );
}

export default CreatePostComponent;