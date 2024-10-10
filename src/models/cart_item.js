export default class CartItem {
  constructor(merchantProductId, name, price, sku, quantity, size, color) {
    this.data = {
      merchant_id: merchantProductId,
      name: name,
      price: price,
      sku: sku,
      quantity: quantity,
      size: size,
      color: color
    };
  }

  is_valid_item() {
    return !!(this.data.merchant_id && this.data.name);
  }
}
