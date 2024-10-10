import axios from "axios";

export default healthCheck(cartItems) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(cartItems)) {
      return reject('cart items must be an array of CartItem objects');
    } else if (cartItems.filter(c => !c.is_valid_item()).length >= 1) {
      return reject('one or more cart items are invalid');
    }

    return axios.post(process.env.BACKEND + '/ecomm/is_displayed_in_checkout' + this.key_param, {
      cart_items: cartItems.map(item => item.data)
    })
      .then(res => res['is_displayed_in_checkout'] ? resolve(true) : reject(false))
      .catch(err => reject(err));
  });
}
