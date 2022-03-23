import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { Store } from './storesSlide';

export const getStore = createAsyncThunk(
	'restaurants/getStore',
	async (storeId: string, { rejectWithValue }) => {
		try {
			const res = await db.collection('stores').doc(storeId).get();
			return { id: res.id, ...res.data() } as Store;
		} catch (error) {}
	}
);
