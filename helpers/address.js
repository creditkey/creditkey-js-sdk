import { Record } from 'immutable';

export default class Address extends Record ({
  first_name: '',
  last_name: '',
  company_name: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  phone_number: ''
}) {
  get valid() {
    console.log(!!(this.first_name && this.last_name));
    return !!(this.first_name && this.last_name);
  }
}
