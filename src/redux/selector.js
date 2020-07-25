import { createSelector } from 'reselect';

const salesSelector = state => state.sales;
const cartSelector = createSelector([salesSelector], sales => sales.get('cart'));


export {
	cartSelector,
}
