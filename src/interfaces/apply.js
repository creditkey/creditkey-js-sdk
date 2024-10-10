import modal from "../ui/modal";
import redirect from '../ui/redirect';

export default function apply(key, type = 'modal') {
  if (!key) {
    throw new Error('API public key required.');
  }

  const backend = process.env.BACKEND;

  window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

  if (type.toLowerCase() === 'modal') {
    return modal(`${backend}/apply/modal/start/${key}`);
  } else if (type.toLowerCase() === 'redirect') {
    return redirect(`${backend}/apply/start/${key}`);
  }
}
