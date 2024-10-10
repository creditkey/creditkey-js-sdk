import axios from "axios";

export default function borrower(key, email, customer_id) {
  if (!key) Promise.reject('Missing merchant key');
  if (!email || !customer_id) return Promise.reject('Missing borrower identifier');

  if (!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/.test(email)) {
    return Promise.reject('Invalid email address');
  }

  return axios.post(process.env.BACKEND + '/ecomm/customer' + key, { email: email, customer_id: customer_id });
}
