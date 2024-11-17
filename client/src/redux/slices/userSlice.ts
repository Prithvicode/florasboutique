import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the user
interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    user: null,
  } as UserState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
