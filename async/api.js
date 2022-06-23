export default function api(platform) {
  switch (platform) {
    case 'staging':
      return 'https://staging.creditkey.com/app/ecomm';
      break;

    case 'production':
      return 'https://www.creditkey.com/app/ecomm';
      break;

    default:
      return process.env.REACT_APP_API + '/ecomm' || 'http://localhost:9100/ecomm';
  }
}
