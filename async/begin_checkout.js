import axios from 'axios';
import api from './api';
import Address from '../helpers/address';
import CartItems from '../helpers/cart-item';
import Charges from '../helpers/charges';

const errors = [];

const validations = (items, billing, charges, remoteId, customerId, returnUrl, cancelUrl) => {
  if (!items) errors.push('Invalid Cart Items');
  if (!billing || !billing.valid) errors.push('Billing Address Required');
  if (!charges || !charges.valid) errors.push('Charges Required');
  if (!remoteId) errors.push('Remote ID Required');
  if (!customerId) errors.push('Customer ID Required');
  if (!returnUrl) errors.push('Return URL Required');
  if (!cancelUrl) errors.push('Cancel URL Required');

  return errors.length < 1;
}

/************************************
 * params
 * publicKey:        String, (merchat API key)
 * platform:         'development', 'staging' or 'production'
 * items:            array of CartItem instances
 * billing:          Address intance
 * shipping:         Address instance
 * charges:          Charges instance
 * remoteId:         String
 * customerId:       String
 * returnUrl:        String
 * cancelUrl:        String
 * orderCompleteUrl: String
 * mode:             String 'redirect' or 'modal'
 * merchantData      Object { key: val }
 * **********************************/
export default function beginCheckout(
  publicKey,
  platform, 
  items, 
  billing, 
  shipping, 
  charges, 
  remoteId, 
  customerId, 
  returnUrl, 
  cancelUrl, 
  orderCompleteUrl, 
  mode = 'redirect', 
  merchantData = {}
) {
  if (!publicKey) return Promise.reject('API Pubilc Key Required');
  if (!validations(items, billing, charges, remoteId, customerId, returnUrl, cancelUrl)) return Promise.reject(...errors);

  return axios.post(api(platform) + '/begin_checkout?public_key=' + publicKey, {
    cart_items: items,
    shipping_address: shipping,
    billing_address: billing,
    charges: charges,
    remote_id: remoteId,
    remote_customer_id: customerId,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    order_complete_url: orderCompleteUrl,
    mode: mode || 'modal',
    merchant_data: merchantData
  });
}
