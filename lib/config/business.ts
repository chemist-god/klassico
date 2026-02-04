import { genVariable } from "./genVariable";

export const businessConfig = {
  name: genVariable.app.name,
  email: genVariable.contact.email,
  website: genVariable.contact.website,
  phone: genVariable.contact.phone,
  address: genVariable.address.street,
  city: genVariable.address.city,
  state: genVariable.address.state,
  zipCode: genVariable.address.zipCode,
  country: genVariable.address.country,
  
  // Logos
  logoUrl: genVariable.assets.logoUrl,
  logoPrintUrl: genVariable.assets.logoPrintUrl,
  
  // Tax settings
  defaultTaxRate: genVariable.financial.defaultTaxRate,
  
  // Receipt settings
  receiptPrefix: genVariable.financial.receiptPrefix,
  invoicePrefix: genVariable.financial.invoicePrefix,
};

// Order protection limits - exported separately for easy access
export const orderLimits = genVariable.orderLimits;
