const styles = {
  modal: {
    height:    `height: inherit;`,

    background: `display: block; /* Hidden by default */
                 position: fixed; /* Stay in place */
                 z-index: 1; /* Sit on top */
                 left: 0;
                 top: 0;
                 width: 100%; /* Full width */
                 height: inherit; /* Full height */
                 overflow: auto; /* Enable scroll if needed */
                 background-color: rgb(0,0,0); /* Fallback color */
                 background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
                 z-index:5;`,
    content: `background-color: #fefefe;
              margin: 5% auto; /* 5% from the top and centered */
              padding: 10px;
              border: 1px solid #888;
              max-width: 600px; /* Could be more or less, depending on screen size */
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
              animation-name: animatetop;
              animation-duration: 0.4s;
              border-radius:5px;
              inherit:5px;
              height: inherit;`
            
  }
}

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

export const modal = source => {
  // Check to see if we've already created the modal - but hidden it when the user clicked off.
  // If so, simply redisplay the modal.
  const existingModal = document.getElementById('creditkey-modal');

  if (existingModal !== null) {
    let iframe = document.getElementById('creditkey-iframe');
    let url = iframe.src;
    if (url !== source + '?modal=true') {
      existingModal.remove();
      return modal(source);
    }
    existingModal.style.display = 'flex';
  } else {
    // Otherwise, create the modal.
        
     //<div style="${styles.modal.background}">
         //<div id="creditkey-modal" style="${styles.modal.content}">${iframe(source + '?modal=true')}</div>
       //</div>


    const body = document.body;
    // default height set for UX during load, will be changed via updateParent() from inside iframe content later
    return body.insertAdjacentHTML('beforeend', `<div class="creditkey" id="creditkey-modal">
        <div class="ck-modal is-active">
          <div class="ck-modal-background" style="${styles.modal.background}"></div>
          <div class="ck-modal-content" id="ck-modal-card" style="${styles.modal.content}">
            <iframe allowtransparency="true" scrolling="no" id="creditkey-iframe" frameBorder="0" src="${source}?modal=true" width="100%"></iframe>
          </div>
        </div>
      </div>`);
  }
}

export const modalCallback = data => {
  let outer_element = document.getElementById('creditkey-modal');
  let iframe_element = document.getElementById('creditkey-iframe');

  if (!iframe_element || !outer_element) return false;

  // if we're closing the modal from within the CK iframe, trigger the event bound to parent body
  if (data.action === 'cancel' && data.type === 'modal') {
    remove();
  } else if (data.action == 'complete' && data.type == 'modal') {
    redirect(event.options);
  } else if (data.action == 'height' && data.type == 'modal') {
    const total_height = data.options + 14; // 14 allows padding underneath content (usually legal footer)

    // set the iframe, the parent div, and that div's parent height to something that adjusts to content height
    iframe_element.style.height = total_height.toString() + 'px';

    // Pad parent div height because issues where Chrome's calc'd <body> height is different than other browsers
    //  which cuts of the bottom rounded corners
    if ((total_height + 60) > window.innerHeight) {
      outer_element.style.height = (total_height + 60).toString() + 'px';
      console.log(outer_element.style.height);
    }

    // force scroll to top because modal starts at top of page.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}

export default modal;
