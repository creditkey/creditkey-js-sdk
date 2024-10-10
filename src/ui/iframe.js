import postMessage from "../callbacks/iframe";

export default function iframe(url, pointer = true) {
  postMessage();

  let style = '';
  if (!pointer) style = 'pointer-events: none;';
  let iframe = `<div className="iframe-container"><iframe allowtransparency="true" scrolling="no" id="creditkey-pdp-iframe" frameBorder="0" style="${style}" src="${url}"></iframe></div>`;
  return iframe;
}
