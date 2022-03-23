import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase';
import { UserSignUpData } from '../../screens/auth/SignupScreen';
import { AppUser, resetAuthState, setUserData } from './authSlide';

export interface SuccessResponse {
    errorMessage: string;
}

interface UserData {
    email: string;
    password: string;
}
export const login = createAsyncThunk<
    string,
    UserData,
    { rejectValue: string }
>(
    'auth/login',
    //@ts-ignore
    async (
        loginData: { email: string; password: string },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const { user } = await auth.signInWithEmailAndPassword(
                loginData.email,
                loginData.password
            );
            const roleClaims = await user?.getIdTokenResult();
            if (roleClaims?.claims && roleClaims.claims.role) {
                if (roleClaims.claims.role === 'admin') return;
            }

            if (!user) return;
            return await dispatch(autoLogin(user.uid));
            // console.log(user);
            // if (!user) return;
            // if (!roleClaims?.claims) {
            //     dispatch(autoLogin(user.uid));
            // } else if (roleClaims.claims) {
            //     if (user?.uid) {
            //         if (user.emailVerified) {
            //             const userData = await setUser(user.uid);

            //             if (userData) {
            //                 console.log('HERE', userData);
            //                 dispatch(setUserData(userData));
            //                 return userData;
            //             }
            //         } else {
            //             return rejectWithValue('Email has not been verified');
            //         }
            //     } else {
            //         return rejectWithValue('no user found');
            //     }
            // } else {
            //     console.log('Deal with this user');
            // }
        } catch (error) {
            //@ts-ignore
            // console.log('EE', error);
            return rejectWithValue(error.message);
        }
    }
);

export const autoLogin = createAsyncThunk(
    'auth/autoLogin',
    async (userId: string, { rejectWithValue, dispatch }) => {
        try {
            const user = await db.collection('users').doc(userId).get();

            if (user.exists) {
                const userData = { id: user.id, ...user.data() } as AppUser;

                dispatch(setUserData(userData));
            }
        } catch (error) {
            let err = error as { message: string };

            return rejectWithValue(err.message);
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (
        userData: UserSignUpData,
        { rejectWithValue, dispatch }
    ): Promise<{ success: boolean; message: string } | string> => {
        try {
            const { user } = await auth.createUserWithEmailAndPassword(
                userData.email,
                userData.password!
            );
            if (!user) {
                return { success: false, message: 'no user found' };
            }
            if (userData.password) {
                delete userData.password;
            }
            if (user) {
                await db
                    .collection('users')
                    .doc(user.uid)
                    .set({ ...userData });
            }

            if (userData.role === 'admin') {
                user?.sendEmailVerification();
            }
            if (userData.role === 'user') {
                dispatch(autoLogin(user.uid));
            }

            return { success: true, message: 'user registered' };
        } catch (error) {
            //@ts-ignore

            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            await auth.signOut();
            dispatch(resetAuthState());
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const setUser = async (userId: string): Promise<AppUser | null> => {
    try {
        const u = await db.collection('users').doc(userId).get();
        const user = { id: u.id, ...u.data() } as AppUser;
        if (!user.role) {
            user.role = 'user';
        }

        return user;
    } catch (error) {
        return null;
    }
};
