import postMessage from '../callbacks/modal';

const css = `
  .ck-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow-y: auto;
  }

  .ck-modal-content {
    background-color: white;
    max-width: 650px;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  
  @media (min-width: 768px) {
    .ck-modal-overlay {
      padding: 20px;
    }

    .ck-modal-content {
      border-radius: 15px;
    }
  }
`;

function remove() {
  // Hide the modal so we can potentially redisplay it, leaving the user at the same place in the
  // checkout flow, if they accidentially click off.
  const el = document.getElementById('creditkey-modal');
  if (el !== null) {
    el.style.display = 'none';
  }
}

// ensure that we're requesting a valid creditkey domain
function validate_url(url) {
  if (!url) return false;

  const address = url.split('/');
  const tld = address[2].split('.')[1];

  return tld === 'creditkey';
}

export default function modal(source, completionCallback) {
  postMessage(completionCallback, remove);

  const style = document.createElement('style');
  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.head.appendChild(style);

  // Check to see if we've already created the modal - but hidden it when the user clicked off.
  // If so, simply redisplay the modal.
  const existingModal = document.getElementById('creditkey-modal');

  const sourceUrl = new URL(source);
  sourceUrl.searchParams.append('modal', true);

  if (existingModal !== null) {
    let iframe = document.getElementById('creditkey-iframe');
    let url = iframe.src;
    if (url !== `${sourceUrl.href}`) {
      remove();
      return modal(source);
    }
    existingModal.style.display = 'flex';
  } else {
    // Otherwise, create the modal.
    
    const body = document.body;
    // default height set for UX during load, will be changed via updateParent() from inside iframe content later
    let iframe = `<iframe scrolling="no" id="creditkey-iframe" src="${sourceUrl.href}" style="height: 100vh; width: 100%;"></iframe>`;

    if (!validate_url(source)) {
      iframe = `An invalid resource was requested`;
    }

    return body.insertAdjacentHTML('beforeend', `<div id="credtkey-modal" class="ck-modal-overlay"><div class="ck-modal-content">${iframe}</div></div>`);
  }
}
