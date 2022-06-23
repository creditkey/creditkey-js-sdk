import { Record } from 'immutable';

export default class CartItem extends Record ({
  name: '',
  price: 0,
  sku: '',
  quantity: 1,
  size: '',
  color: ''
}) {
  get valid() {
    return !!(this.price);
  } 
}
