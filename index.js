import { actions, urls } from './settings';
import { iframe, iframeCallback } from './modules/iframe';
import { modal, modalCallback } from './modules/modal';

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
    apply,
    checkout,
    promoDisplay
  }
}

/*
 * params
 * - amount Float (100.00)
 * - version String (v1, v2, etc)
 * - action String (modal, redirect)
 *
 * returns a string representing an iframe DOM element
 * that loads a state determined url
*/
const promoDisplay = ( amount, version = 'v1', action = 'modal' ) => {
  state.amount = amount;
  state.action = action;
  const url = `${urls.marketing[state.platform]}/standard_pdp.html?public_key=${state.public_key}&amount=${amount}&version=${version}&action=${action}`;

  return iframe(url);
}

const checkout = (url, action = 'modal') => {
  state.action = action;

  if (action === 'modal') {
    return modal(url);
  } else {
    window.location.href = url;
  }
}

const apply = (action = 'modal') => {
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
