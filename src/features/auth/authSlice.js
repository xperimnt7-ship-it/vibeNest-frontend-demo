import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  accessToken: null,
  isLoggedin: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedin = true
            if (action.payload?.user) {
                state.user = action.payload.user
            }
            if (action.payload?.accessToken) {
                state.accessToken = action.payload.accessToken
            }
        },
        logout: (state) => {
            state.isLoggedin = false
            state.user = null
            state.accessToken = null
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setToken: (state, action) => {
            state.accessToken = action.payload
        },
    }
})

export const { login, logout, setUser, setToken } = authSlice.actions
export const authReducer = authSlice.reducer