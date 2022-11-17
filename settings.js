import { modal } from './modules/modal';

export const urls = {
  marketing: {
    development: process.env.REACT_APP_MARKETING_UI || 'http://localhost:3002',
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
}

export const actions = {
  modal: state =>  modal(urls.apply[state.platform]),
  redirect: state => window.location.href = urls.apply[state.platform]
};
