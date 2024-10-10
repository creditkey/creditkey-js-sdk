import apply from "./interfaces/apply";
import beginCheckout from "./async/begin_checkout";
import borrower from "./async/borrower";
import checkout from './interfaces/checkout';
import healthCheck from "./async/health_check";
import pdp from './interfaces/pdp';

import Address from "./models/address";
import CartItem from "./models/cart_item";
import Charges from "./models/charges";

const api = {
  async: {
    borrower: borrower,
    checkout: beginCheckout,
    health_check: healthCheck
  },
  display: {
    apply: apply,
    checkout: checkout,
    pdp: pdp
  },
  models: {
    address: Address,
    cart_item: CartItem,
    charges: Charges
  }
}

export default api;
