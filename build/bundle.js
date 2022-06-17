(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ck = factory());
})(this, (function () { 'use strict';

  const iframe = url => {
    return `<div id="creditkey-wrapper">
            <iframe allowtransparency="true" scrolling="no" id="creditkey-iframe" frameBorder="0" src="${url}"></iframe>
          </div>`;
  };

  const iframeCallback = (data, state) => {
    if (data.action === 'pdp') actions[state.action](state);
  };

  const styles = {
    modal: {
      background: `display: block; /* Hidden by default */
                 position: fixed; /* Stay in place */
                 z-index: 1; /* Sit on top */
                 left: 0;
                 top: 0;
                 width: 100%; /* Full width */
                 height: 100%; /* Full height */
                 overflow: auto; /* Enable scroll if needed */
                 background-color: rgb(0,0,0); /* Fallback color */
                 background-color: rgba(0,0,0,0.4); /* Black w/ opacity */`,
      content: `background-color: #fefefe;
              margin: 5% auto; /* 5% from the top and centered */
              padding: 10px;
              border: 1px solid #888;
              width: 45%; /* Could be more or less, depending on screen size */
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
              animation-name: animatetop;
              animation-duration: 0.4s`
    }
  };

  function remove() {
    // Hide the modal so we can potentially redisplay it, leaving the user at the same place in the
    // checkout flow, if they accidentially click off.
    const el = document.getElementById('creditkey-modal');
    if (el !== null) {
      el.style.display = 'none';
    }
  }

  function redirect(uri) {
    if(navigator.userAgent.match(/Android/i)) {
      document.location = uri;      
    } else {
      window.location.replace(uri);
    }
  }

  const modal = source => {
    // Check to see if we've already created the modal - but hidden it when the user clicked off.
    // If so, simply redisplay the modal.
    const existingModal = document.getElementById('ck-modal');

    if (existingModal !== null) {
      let iframe = document.getElementById('ck-modal-iframe');
      let url = iframe.src;
      if (url !== source + '?modal=true') {
        existingModal.remove();
        return modal(source);
      }
      existingModal.style.display = 'flex';
    } else {
      // Otherwise, create the modal.
      
      const body = document.body;
      // default height set for UX during load, will be changed via updateParent() from inside iframe content later
      return body.insertAdjacentHTML('beforeend', `<div style="${styles.modal.background}"><div id="creditkey-modal" style="${styles.modal.content}">${iframe(source + '?modal=true')}</div></div>`);
    }
  };

  const modalCallback = data => {
    let modal_element = document.getElementById('creditkey-modal');
    let iframe_element = document.getElementById('creditkey-iframe');

    if (!iframe_element || !modal_element) return false;

    // if we're closing the modal from within the CK iframe, trigger the event bound to parent body
    if (event.action === 'cancel' && event.type === 'modal') {
      remove();
    } else if (event.action == 'complete' && event.type == 'modal') {
      redirect(event.options);
    } else if (event.action == 'height' && event.type == 'modal') {
      const total_height = event.options + 14; // 14 allows padding underneath content (usually legal footer)

      // set the iframe, the parent div, and that div's parent height to something that adjusts to content height
      iframe_element.style.height = total_height.toString() + 'px';

      // Pad parent div height because issues where Chrome's calc'd <body> height is different than other browsers
      //  which cuts of the bottom rounded corners
      if ((total_height + 60) > window.innerHeight) {
        modal_element.parentNode.style.height = (total_height + 60).toString() + 'px';
      }

      // force scroll to top because modal starts at top of page.
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const urls = {
    marketing: {
      development: 'http://localhost:3002',
      staging: 'https://staging-marketing.creditkey.com',
      production: 'https://marketing.creditkey.com'
    }, 
    apply: {
      development: 'http://apply.localhost:3001',
      staging: 'https://staging-apply.creditkey.com',
      production: 'https://apply.creditkey.com'
    }
  };

  const actions = {
    modal: state =>  modal(urls.apply[state.platform]),
    redirect: state => window.location.href = urls.apply[state.platform]
  };

  const state = {
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
  const ckSDK = (public_key, platform) => {
    registerPostMessageCallbacks();

    state.public_key = public_key;
    state.platform = platform;

    return {
      apply,
      checkout,
      promoDisplay
    }
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
  const promoDisplay = ( amount, version = 'v1', action = 'modal' ) => {
    state.amount = amount;
    state.action = action;
    const url = `${urls.marketing[state.platform]}/standard_pdp.html?public_key=${state.public_key}&amount=${amount}&version=${version}&action=${action}`;

    return iframe(url);
  };

  const checkout = (url, action = 'modal') => {
    state.action = action;

    if (action === 'modal') {
      return modal(url);
    } else {
      window.location.href = url;
    }
  };

  const apply = (action = 'modal') => {
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
      let data;

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

  return ckSDK;

}));
