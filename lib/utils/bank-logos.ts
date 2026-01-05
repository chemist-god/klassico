/**
 * Bank logo mapping
 * Maps bank names to their logo file paths in the public/logos folder
 */

export const BANK_LOGOS: Record<string, string> = {
  "Chase Bank": "/logos/chase.png",
  "Bank of America": "/logos/bank-of-america.png",
  "Wells Fargo": "/logos/wells-fargo.jpg",
  "Citibank": "/logos/citibank.jpg",
  "US Bank": "/logos/us-bank.jpg",
  "PNC Bank": "/logos/pnc.jpg",
  "Capital One": "/logos/capital-one.png",
  "TD Bank": "/logos/td-bank.jpg",
  "HSBC": "/logos/hsbc.jpg",
  "Barclays": "/logos/barclays.jpg",
  "HSBC UK": "/logos/hsbc-uk.png",
  "Lloyds Bank": "/logos/lloyds-bank.jpg",
  "NatWest": "/logos/natwest.png",
  "Santander UK": "/logos/santander-uk.png",
  "TD Canada Trust": "/logos/td-canada-trust.jpg",
  "RBC Royal Bank": "/logos/rbc.png",
  "Scotiabank": "/logos/scotiabank.png",
  "BMO Bank of Montreal": "/logos/bmo.png",
  "CIBC": "/logos/cibc.png",
};

/**
 * Get the logo path for a bank
 * Returns the logo path if exists, otherwise returns null
 */
export const getBankLogo = (bankName: string): string | null => {
  return BANK_LOGOS[bankName] || null;
};
