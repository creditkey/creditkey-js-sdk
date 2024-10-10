import redirect from '../ui/redirect';

export default function postMessage(completionCallback, remove) {
  window.addEventListener('message', function(e) {
    if (!e) return false;
    if (e && !e.data) return false;

    let event;

    try {
      event = JSON.parse(e.data);
    } catch (e) {
      event = false;
    }

    if (!event || !event.action) return false;

    let modal_element = document.getElementById('ck-modal-card');
    let iframe_element = document.getElementById('creditkey-iframe');

    if (!iframe_element || !modal_element) return false;

    // if we're closing the modal from within the CK iframe, trigger the event bound to parent body
    if (event.action === 'cancel' && event.type === 'modal') {
      remove();
    } else if (event.action == 'complete' && event.type == 'modal') {
      if (completionCallback) {
        const params = new URL(event.options);
        completionCallback(params.searchParams.get('id'), remove);
      } else {
        redirect(event.options);
      }
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
  }, false);
}
