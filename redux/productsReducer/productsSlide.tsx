import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
	id?: string;
	name: string;
	price:
		| number
		| [{ small: number; medium: number; large: number; xlarge: number }]
		| null
		| any;
	imageUrl: string;
	isAvailable: boolean;
	description?: string;
	storeId: string;
	unitSold: number;
	sizes: ['small', 'medium', 'large', 'xlarge'] | null;
	category: string;
}
interface ProductState {
	products: Product[];
	product: Product | null;
	allProducts: Product[];
	mostPopular: Product[];
	loading: boolean;
	isInCart: boolean;
}
const initialState: ProductState = {
	products: [],
	product: null,
	mostPopular: [],
	allProducts: [],
	loading: false,

	isInCart: false,
};

const productsSlide = createSlice({
	name: 'products',
	initialState,
	reducers: {
		getProductsByRestaurantId: (state, { payload }) => {
			state.loading = false;
			state.products = payload;
		},
		getAllProducts: (state, { payload }) => {
			state.loading = false;
			state.allProducts = payload;
		},
		getMorePopular: (state, { payload }: PayloadAction<Product[]>) => {
			state.loading = false;
			state.mostPopular = payload
				.sort((a, b) => (a.unitSold < b.unitSold ? 1 : 0))
				.slice(0, 7)
				.filter((p) => p.unitSold > 0);
		},
		setProduct: (state, { payload }: PayloadAction<string>) => {
			state.product = state.products.find((p) => p.id === payload)!;
		},
	},
	extraReducers: (builder) => {},
});

export const {
	getProductsByRestaurantId,
	getMorePopular,
	getAllProducts,
	setProduct,
} = productsSlide.actions;

export default productsSlide.reducer;
