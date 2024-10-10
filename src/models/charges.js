export default class Charges {
  constructor(total, shipping, tax, discount_amount, grand_total) {
    this.data = {
      total: total,
      shipping: shipping,
      tax: tax,
      discount_amount: discount_amount,
      grand_total: grand_total 
    }
  }

  validate_charges() {
    if (this.data.shipping && !this.is_valid_money_value(this.data.shipping)) return false;
    if (this.data.tax && !this.is_valid_money_value(this.data.tax)) return false;
    if (this.data.discount_amount && !this.is_valid_money_value(this.data.discount_amount)) return false;

    if (!this.is_valid_money_value(this.data.total) ||
        !this.is_valid_money_value(this.data.grand_total)) {
      return false;
    }

    return true;
  }

  is_valid_money_value(value) {
    const num = +value;
    if (isNaN(num)) return false;

    return true;
  }
}
