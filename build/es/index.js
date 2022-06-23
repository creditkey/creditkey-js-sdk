'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var immutable = require('immutable');
require('axios');

var iframe = function iframe(url) {
  return "<div id=\"creditkey-wrapper\">\n            <iframe allowtransparency=\"true\" scrolling=\"no\" id=\"creditkey-iframe\" frameBorder=\"0\" src=\"".concat(url, "\"></iframe>\n          </div>");
};
var iframeCallback = function iframeCallback(data, state) {
  if (data.action === 'pdp') actions[state.action](state);
};

var styles = {
  modal: {
    background: "display: block; /* Hidden by default */\n                 position: fixed; /* Stay in place */\n                 z-index: 1; /* Sit on top */\n                 left: 0;\n                 top: 0;\n                 width: 100%; /* Full width */\n                 height: 100%; /* Full height */\n                 overflow: auto; /* Enable scroll if needed */\n                 background-color: rgb(0,0,0); /* Fallback color */\n                 background-color: rgba(0,0,0,0.4); /* Black w/ opacity */",
    content: "background-color: #fefefe;\n              margin: 5% auto; /* 5% from the top and centered */\n              padding: 10px;\n              border: 1px solid #888;\n              width: 45%; /* Could be more or less, depending on screen size */\n              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);\n              animation-name: animatetop;\n              animation-duration: 0.4s"
  }
};

function remove() {
  // Hide the modal so we can potentially redisplay it, leaving the user at the same place in the
  // checkout flow, if they accidentially click off.
  var el = document.getElementById('creditkey-modal');

  if (el !== null) {
    el.style.display = 'none';
  }
}

function redirect(uri) {
  if (navigator.userAgent.match(/Android/i)) {
    document.location = uri;
  } else {
    window.location.replace(uri);
  }
}

var modal = function modal(source) {
  // Check to see if we've already created the modal - but hidden it when the user clicked off.
  // If so, simply redisplay the modal.
  var existingModal = document.getElementById('ck-modal');

  if (existingModal !== null) {
    var _iframe = document.getElementById('ck-modal-iframe');

    var url = _iframe.src;

    if (url !== source + '?modal=true') {
      existingModal.remove();
      return modal(source);
    }

    existingModal.style.display = 'flex';
  } else {
    // Otherwise, create the modal.
    var body = document.body; // default height set for UX during load, will be changed via updateParent() from inside iframe content later

    return body.insertAdjacentHTML('beforeend', "<div style=\"".concat(styles.modal.background, "\"><div id=\"creditkey-modal\" style=\"").concat(styles.modal.content, "\">").concat(iframe(source + '?modal=true'), "</div></div>"));
  }
};
var modalCallback = function modalCallback(data) {
  var modal_element = document.getElementById('creditkey-modal');
  var iframe_element = document.getElementById('creditkey-iframe');
  if (!iframe_element || !modal_element) return false; // if we're closing the modal from within the CK iframe, trigger the event bound to parent body

  if (event.action === 'cancel' && event.type === 'modal') {
    remove();
  } else if (event.action == 'complete' && event.type == 'modal') {
    redirect(event.options);
  } else if (event.action == 'height' && event.type == 'modal') {
    var total_height = event.options + 14; // 14 allows padding underneath content (usually legal footer)
    // set the iframe, the parent div, and that div's parent height to something that adjusts to content height

    iframe_element.style.height = total_height.toString() + 'px'; // Pad parent div height because issues where Chrome's calc'd <body> height is different than other browsers
    //  which cuts of the bottom rounded corners

    if (total_height + 60 > window.innerHeight) {
      modal_element.parentNode.style.height = (total_height + 60).toString() + 'px';
    } // force scroll to top because modal starts at top of page.


    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
};

var urls = {
  marketing: {
    development: 'http://localhost:3002',
    staging: 'https://staging-marketing.creditkey.com',
    production: 'https://marketing.creditkey.com'
  },
  apply: {
    development: 'http://apply.localhost:3001',
    staging: 'https://staging-apply.creditkey.com',
    production: 'https://apply.creditkey.com'
  },
  checkout: {
    development: 'http://localhost:3001',
    staging: 'https://staging-checkout.creditkey.com',
    production: 'https://checkout.creditkey.com'
  }
};
var actions = {
  modal: function modal$1(state) {
    return modal(urls.apply[state.platform]);
  },
  redirect: function redirect(state) {
    return window.location.href = urls.apply[state.platform];
  }
};

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = babelHelpers.getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = babelHelpers.getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return babelHelpers.possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function is_valid_money_value(value) {
  var num = +value;
  if (isNaN(num)) return false;
  return true;
}

/*#__PURE__*/(function (_Record) {
  babelHelpers.inherits(Charges, _Record);

  var _super = _createSuper$2(Charges);

  function Charges() {
    babelHelpers.classCallCheck(this, Charges);
    return _super.apply(this, arguments);
  }

  babelHelpers.createClass(Charges, [{
    key: "valid",
    get: function get() {
      return !!(is_valid_money_value(this.shipping) && is_valid_money_value(this.tax) && is_valid_money_value(this.discount_amount) && (is_valid_money_value(this.total) || is_valid_money_value(this.grand_total)));
    }
  }, {
    key: "calcFromItems",
    value: function calcFromItems(cartItems) {
      var _this = this;

      if (cartItems.length < 1) return false;
      cartItems.forEach(function (c) {
        _this.total += c.price;
        _this.grand_total += c.price;
      });
    }
  }]);
  return Charges;
})(immutable.Record({
  total: 0,
  shipping: 0,
  tax: 0,
  discount_amount: 0,
  grand_total: 0
}));

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = babelHelpers.getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = babelHelpers.getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return babelHelpers.possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/*#__PURE__*/(function (_Record) {
  babelHelpers.inherits(Address, _Record);

  var _super = _createSuper$1(Address);

  function Address() {
    babelHelpers.classCallCheck(this, Address);
    return _super.apply(this, arguments);
  }

  babelHelpers.createClass(Address, [{
    key: "valid",
    get: function get() {
      return !!(this.first_name && this.last_name);
    }
  }]);
  return Address;
})(immutable.Record({
  first_name: '',
  last_name: '',
  company_name: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  phone_number: ''
}));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = babelHelpers.getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = babelHelpers.getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return babelHelpers.possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/*#__PURE__*/(function (_Record) {
  babelHelpers.inherits(CartItem, _Record);

  var _super = _createSuper(CartItem);

  function CartItem() {
    babelHelpers.classCallCheck(this, CartItem);
    return _super.apply(this, arguments);
  }

  babelHelpers.createClass(CartItem, [{
    key: "valid",
    get: function get() {
      return !!(this.merchant_id && this.name);
    }
  }]);
  return CartItem;
})(immutable.Record({
  merchant_id: '',
  name: '',
  price: 0,
  sku: '',
  quantity: 1,
  size: '',
  color: ''
}));

var state = {
  public_key: '',
  platform: 'production',
  action: 'modal',
  amount: 0
};
/*
 * params
 * - public_key String
 * - platform String
 *
 *   primary initializer to the SDK
 *   exposes interface of available public methods
 *   and sets up SDK state
  * */

var ckSDK = function ckSDK(public_key, platform) {
  registerPostMessageCallbacks();
  state.public_key = public_key;
  state.platform = platform;
  return {
    action: {
      apply: apply,
      checkout: checkout
    },
    display: {
      apply: promoDisplay,
      checkout: checkoutDisplay
    }
  };
  /*return {*/

  /*action: {*/

  /*apply: apply,*/

  /*checkout: checkout*/

  /*},*/

  /*display: {*/

  /*apply: promoDisplay,*/

  /*checkout: checkoutDisplay*/

  /*},*/

  /*async: {*/

  /*apply: apply,*/

  /*checkout: beginCheckout*/

  /*},*/

  /*helper: {*/

  /*charges: Charges*/

  /*}*/

  /*};*/
};
/*
 * params
 * - amount Float (100.00)
 * - version String (v1, v2, etc)
 * - action String (modal, redirect)
 *
 * returns a string representing an iframe DOM element
 * that loads a state determined url
*/


var promoDisplay = function promoDisplay(amount) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'v1';
  var action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'modal';
  var url = "".concat(urls.marketing[state.platform], "/standard_pdp.html?public_key=").concat(state.public_key, "&amount=").concat(amount, "&version=").concat(version, "&action=").concat(action);
  return iframe(url);
};

var checkoutDisplay = function checkoutDisplay(amount) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'v1';
  var url = "".concat(urls.marketing[state.platform], "/checkout.html?public_key=").concat(state.public_key, "&amount=").concat(amount, "&version=").concat(version);
  return iframe(url);
};

var checkout = function checkout(url) {
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'modal';
  state.action = action;

  if (action === 'modal') {
    return modal(url);
  } else {
    window.location.href = url;
  }
};

var apply = function apply() {
  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'modal';
  state.action = action;
  return actions[state.action](state);
};
/*
 * adds post message callback event listener
 * registers all callbacks for defined modules
 * expects a `data` attribute with the following properties:
 * - action String
 * - options Object
  * */


function registerPostMessageCallbacks() {
  window.addEventListener('message', function (e) {
    var data;
    if (!e || !e.data) return false;

    try {
      data = JSON.parse(e.data);
    } catch (e) {
      return false;
    }

    modalCallback();
    iframeCallback(data, state);
  });
}

exports["default"] = ckSDK;
