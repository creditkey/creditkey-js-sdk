import { actions, urls } from './settings';
import { iframe, iframeCallback } from './modules/iframe';
import { modal, modalCallback } from './modules/modal';
import Charges from './helpers/charges';
import Address from './helpers/address';
import CartItem from './helpers/cart-item';
import beginCheckout from './async/begin_checkout';

const state = {
  public_key: '',
  platform: 'production',
  action: 'modal',
  amount: 0
}

/*
 * params
 * - public_key String
 * - platform String
 *
 *   primary initializer to the SDK
 *   exposes interface of available public methods
 *   and sets up SDK state
  * */
const ckSDK = (public_key, platform) => {
  registerPostMessageCallbacks();

  state.public_key = public_key;
  state.platform = platform;

  return {
    action: {
      apply: applyAction,
      checkout: checkoutAction
    },
    display: {
      apply: applyDisplay,
      checkout: checkoutDisplay
    },
    async: {
      apply: applyAction,
      checkout: beginCheckout.bind(null, public_key, platform)
    },
    helper: {
      address: Address,
      cart_item: CartItem,
      charges: Charges
    }
  }
}

const applyUrl = template => `${urls.marketing[state.platform]}/${template}.html?public_key=${state.public_key}`;

/*
 * params
 * - amount Float (100.00)
 * - action String (modal, redirect)
 * - template String (layout to use at marketing site)
 *
 * returns a string representing an iframe DOM element
 * that loads a state determined url
*/
const applyDisplay = (amount, action = 'redirect', template = 'standard_pdp') => {
  return iframe(`${applyUrl(template)}&amount=${amount}&action=${action}`);
}

const checkoutDisplay = () => {
  return '<img style="height:24px;" className="logo" src="https://creditkey-assets.s3-us-west-2.amazonaws.com/ck-checkout%402x.png" alt="CreditKey Logo" />';
}

const checkoutAction = (url, action = 'modal') => {
  state.action = action;

  if (action === 'modal') {
    return modal(url);
  } else {
    window.location.href = url;
  }
}

const applyAction = (action = 'modal') => {
  state.action = action;
  return actions[state.action](state);
}

/*
 * adds post message callback event listener
 * registers all callbacks for defined modules
 * expects a `data` attribute with the following properties:
 * - action String
 * - options Object
  * */
function registerPostMessageCallbacks() {
  window.addEventListener('message', function (e) {
    let data;

    if (!e || !e.data) return false;

    try {
      data = JSON.parse(e.data);
    } catch (e) {
      return false;
    }

    modalCallback(data);
    iframeCallback(data, state);
  });
}

export default ckSDK;
