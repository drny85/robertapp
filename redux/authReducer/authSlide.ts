import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, logout, signup, SuccessResponse } from './authActions';

export interface AppUser {
    id?: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    imageUrl: string | null;
    favoriteStores: string[];
    signedDate: string;
    role: 'admin' | 'user' | 'developer' | undefined;
}

interface IState {
    user: AppUser | null;
    loading: boolean;
    role: 'admin' | 'user' | 'developer' | undefined;
    error: string | null;
}
const initialState: IState = {
    user: null,
    loading: false,
    role: undefined,
    error: null
};
const authSlide = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, { payload }: PayloadAction<AppUser>) => {
            state.error = null;
            state.loading = false;
            state.user = payload;
        },
        setUserRole: (state, { payload }: PayloadAction<AppUser['role']>) => {
            state.role = payload;
        },
        resetAuthState: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
                console.log('E', payload);
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(signup.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(signup.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            })
            .addCase(signup.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.error = null;
                console.log('Payload', payload);
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            })
            .addCase(logout.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.error = null;
                console.log('Payload at Logout fulfilled');
            });
    }
});

export const { setUserData, setUserRole, resetAuthState } = authSlide.actions;

export default authSlide.reducer;
