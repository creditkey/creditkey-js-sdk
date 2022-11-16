import { actions, urls } from '../settings';

export const iframe = url => {
  return ` src="${url}" `;
}

export const iframeCallback = (data, state) => {
  if (data.action === 'pdp') actions[state.action](state);
}
