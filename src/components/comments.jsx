import React, { useState } from 'react'

function comments() {
    const [myComment, setMyComment] = useState("")
    const onCommentChange = (e)=>{
        setMyComment(e.target.value)
    }
}

export default comments
