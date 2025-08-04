import React from 'react'
import { useSelector } from 'react-redux'

const acceptRequest = async(id, userId)=>{
    const response = await fetch(`http://localhost:3000/v1/user/${userId}/follow-request/${id}/accept`, {method: "POST", credentials:"include"})
    if(!response.ok){
        console.log("accept request cannot be completed")
        alert("Something went wrong")
        return null
    }

    alert("erquest Accepted")
    return (response.json()).data
}

const rejectRequest = async(id, userId)=>{
    const response = await fetch(`http://localhost:3000/v1/user/${userId}/follow-request/${id}/reject`, {method: "DELETE", credentials:"include"})
    if(!response.ok){
        console.log("reject request cannot be completed")
        alert("Something went wrong")
        return null
    }

    alert("Request Rejected")
    return (response.json()).data
}

const createRequest = async(id) => {
    console.log("createRequest", id)
    const response = await fetch(`http://localhost:3000/v1/user/${id}/followRequest`, {method: "POST", credentials:"include"})
    if(!response.ok){
        console.log("reject request cannot be completed")
        alert("Something went wrong")
        return null
    }

    alert("Request Sent")
    return (response.json()).data
}

const removeFollower = async(id, userId)=>{
    const response = await fetch(`http://localhost:3000/v1/user/${userId}/follow/${id}`, {method: "DELETE", credentials:"include"})
    if(!response.ok){
        console.log("reject request cannot be completed")
        alert("Something went wrong")
        return null
    }

    alert("Follower Removed")
    return (response.json()).data
}

const removeRequest = async(id, userId)=>{
    console.log("remove follow request", id)
    console.log("remove follow request", userId)
    const response = await fetch(`http://localhost:3000/v1/user/${userId}/follow-requests/${id}`, {method: "DELETE", credentials:"include"})
    if(!response.ok){
        console.log("remove follow request cannot be completed")
        alert("Something went wrong")
        return null
    }

    alert("Follow Request Removed")
    return (response.json()).data
}
export {acceptRequest, rejectRequest, createRequest, removeFollower, removeRequest}
