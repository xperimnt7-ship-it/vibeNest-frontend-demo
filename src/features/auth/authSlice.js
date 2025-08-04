import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user : {
    // "_id": "68696ee0247c334996c44968",
    // "userName": "realbeast",
    // "email": "test@gmail.com",
    // "fullName": "shubh goel",
    // "followersCount": 0,
    // "createdAt": "2025-07-05T18:28:48.269Z",
    // "updatedAt": "2025-07-23T14:25:47.382Z",
    // "__v": 0
  },
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODY5NmVlMDI0N2MzMzQ5OTZjNDQ5NjgiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwidXNlck5hbWUiOiJyZWFsYmVhc3QiLCJpYXQiOjE3NTMyODA3NDcsImV4cCI6MTc1MzM2NzE0N30.bejObwv0PZ_9d7blnNYKOCiVz3AbUnt6pVUrnh6IzZM",
  isLoggedin: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, payload) => {
            state.isLoggedin = true
        },
        logout: (state) => {
            state.isLoggedin = false
            state.user = null
            state.token = null
        },
        setUser: (state, action) => {
            state.user = action.payload
            state.accessToken = action.payload
        },
    }
})

export const { login, logout, setUser } = authSlice.actions
export const authReducer = authSlice.reducer