/**
 * OxaPay Configuration
 * Validates and exports OxaPay environment variables
 */

export const oxapayConfig = {
  apiKey: process.env.OXAPAY_MERCHANT_API_KEY,
  webhookUrl: process.env.OXAPAY_WEBHOOK_URL,
  sandbox: process.env.OXAPAY_SANDBOX === 'true',
  apiUrl: 'https://api.oxapay.com/v1',
};

// Validate required configuration
if (!oxapayConfig.apiKey) {
  throw new Error('OXAPAY_MERCHANT_API_KEY is required in environment variables');
}

if (!oxapayConfig.webhookUrl) {
  console.warn('OXAPAY_WEBHOOK_URL is not set - webhooks will not be received');
}
