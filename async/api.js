export default function api(platform) {
  switch (platform) {
    case 'staging':
      return 'https://staging.creditkey.com/app/ecomm';
      break;

    case 'production':
      return 'https://www.creditkey.com/app/ecomm';
      break;

    default:
      return process.env.CK_WEB || 'http://localhost:9100/ecomm';
  }
}
