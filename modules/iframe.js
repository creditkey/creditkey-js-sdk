import { actions, urls } from '../settings';

export const iframe = url => {
  return `<div id="creditkey-wrapper">
            <iframe allowtransparency="true" scrolling="no" id="creditkey-iframe" frameBorder="0" src="${url}" width="100%"></iframe>
          </div>`;
}

export const iframeCallback = (data, state) => {
  if (data.action === 'pdp') actions[state.action](state);
}
