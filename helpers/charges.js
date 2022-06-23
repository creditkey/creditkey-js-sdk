import { Record } from 'immutable';

function is_valid_money_value(value) {
  const num = +value;
  if (isNaN(num)) return false;

  return true;
}

export default class Charges extends Record ({
  total: 0,
  shipping: 0,
  tax: 0,
  discount_amount: 0,
  grand_total: 0
}) {
  constructor(data) {
    let result = {
      total: 0,
      grand_total: 0 
    }

    if (data.length) {
      data.forEach(d => {
        result.total += parseFloat(d.price);
        result.grand_total += parseFloat(d.price);
      })
    }

    super(result);
  }

  get valid() {
    return !!(
      is_valid_money_value(this.shipping) &&
      is_valid_money_value(this.tax) &&
      is_valid_money_value(this.discount_amount) &&
      (
        is_valid_money_value(this.total) ||
        is_valid_money_value(this.grand_total)
      )
    ) 
  }
}
