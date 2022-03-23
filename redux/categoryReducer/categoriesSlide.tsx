import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliderBase } from 'react-native';

export interface Category {
	id: string;
	name: string;
	storeId: string;
}

interface CategoryState {
	categories: Category[];
	loading: boolean;
}
const initialState: CategoryState = {
	categories: [],
	loading: false,
};
const categoriesSlide = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		getCategoriesByStore: (state, { payload }: PayloadAction<Category[]>) => {
			state.categories = payload.sort((a, b) => (a.name < b.name ? -1 : 1));
		},
	},
	extraReducers: (builder) => {},
});

export const { getCategoriesByStore } = categoriesSlide.actions;

export default categoriesSlide.reducer;
