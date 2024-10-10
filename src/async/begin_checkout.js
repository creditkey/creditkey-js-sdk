import axios from "axios";

export default function beginCheckout(cartItems, billingAddress, shippingAddress, charges, remoteId, customerId, returnUrl, cancelUrl, orderCompleteUrl, mode, merchant_data) {
  return new Promise((resolve, reject) => {
    if (!cartItems) return reject('Missing cart items');
    if (!billingAddress) return reject('Missing billing address');
    if (!charges) return reject('Missing charges');
    if (!remoteId) return reject('Missing remote id');
    if (!customerId) return reject('Missing customer id');
    if (!returnUrl) return reject('Missing return url');
    if (!cancelUrl) return reject('Missing cnacel url');

    if (!Array.isArray(cartItems)) {
      return reject('cart items must be an array of CartItem objects');
    } else if (cartItems.filter(c => !c.is_valid_item()).length >= 1) {
      return reject('one or more cart items are invalid');
    }

    if (typeof billingAddress !== 'object') {
      return reject('billing address should be an Address object');
    }

    if (typeof charges !== 'object') {
      return reject('charges should be a Charges object');
    } else if (!charges.validate_charges()) {
      return reject('charges value is invalid');
    }

    return axios.post(process.env.BACKEND + '/ecomm/begin_checkout' + this.key_param, {
      cart_items: cartItems.map(item => item.data),
      shipping_address: shippingAddress && shippingAddress.data,
      billing_address: billingAddress.data,
      charges: charges.data,
      remote_id: remoteId,
      remote_customer_id: customerId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      order_complete_url: orderCompleteUrl,
      mode: mode || 'modal',
      merchant_data
    })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
}
