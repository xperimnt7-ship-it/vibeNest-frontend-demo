import React from 'react'

function NavBar() {
  return (
    <div id="navbar" class="flex py-3 px-4 w-full max-w-[590px] fixed bg-[var(--backGround)]/40 backdrop-blur-md top-0 z-10">
        <button class="w-full h-auto  hover:bg-sky-700 text-sm font-light cursor-pointer">For You</button>
        <button class="w-full h-auto  hover:bg-sky-700 text-sm font-light cursor-pointer">Following</button>
    </div>
  )
}

export default NavBar
