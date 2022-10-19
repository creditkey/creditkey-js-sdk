import { actions, urls } from '../settings';

const allowedActions = ['pdp', 'apply'];

export const iframe = url => {
  return `<div id="creditkey-wrapper">
            <iframe allowtransparency="true" scrolling="no" id="creditkey-iframe" frameBorder="0" src="${url}" width="100%"></iframe>
          </div>`;
}

export const iframeCallback = (data, state) => {
  if (allowedActions.includes(data.action)) actions[state.action]({ ...data, ...state});
}
