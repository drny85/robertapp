import { db } from '../firebase';
import {
	getAllProducts,
	Product,
} from '../redux/productsReducer/productsSlide';
import { useAppDispatch, useAppSelector } from '../redux/store';

export const useAllProducts = () => {
	const dispatch = useAppDispatch();
	const { stores } = useAppSelector((state) => state.stores);
	const ids = stores.map((s) => s.id);
	const all: Product[] = [];
	ids.forEach(async (i) => {
		const res = await db.collection('items').doc(i).collection('items').get();
		res.docs.map((doc) => {
			if (doc.exists) {
				all.push({ id: doc.id, ...doc.data() } as Product);
			}
		});
	});
	dispatch(getAllProducts(all));
};
