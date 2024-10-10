import modal from '../ui/modal';
import redirect from '../ui/redirect';

export default function checkout(source, type = 'modal', completionCallback) {
  if (type !== 'modal') {
    return redirect(source);
  }
  return modal(source, completionCallback);
}
