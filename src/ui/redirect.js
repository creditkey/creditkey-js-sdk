export default function redirect(uri) {
  if(navigator.userAgent.match(/Android/i)) {
    document.location = uri;      
  } else {
    window.location.replace(uri);
  }
}
