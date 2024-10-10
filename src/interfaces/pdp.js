/*
 * key = merchant public_key
 * charges = object with data attribute that includes total, shipping, tax, discount_amount and grand_total
 * orientation = right vs. left
*/
export default function pdp(key, charges, orientation = 'right') {
  const url = process.env.MARKETING + '/pdp.html?public_key=' + key + '&orientation=' + orientation + '&charges=' + [charges.data.total, charges.data.shipping, charges.data.tax, charges.data.discount_amount, charges.data.grand_total].join(',');
  return frame(url);
}
