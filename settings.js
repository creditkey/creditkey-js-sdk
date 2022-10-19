import { modal } from './modules/modal';

// this should be moved to a .env setup
// need to figure out how to get it into rollup
export const marketingSite = {
  development: 'http://localhost:3002',
  staging: 'https://staging-marketing.creditkey.com',
  production: 'https://marketing.creditkey.com'
}

export const actions = {
  modal: state => {
    if (!state.options || !state.options.url) return false;
    return modal(state.options.url)
  },
  redirect: state => {
    if (!state.options || !state.options.url) return false;
    window.location.href = state.options.url;
  }
};
