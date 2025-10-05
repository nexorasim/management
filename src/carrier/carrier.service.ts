import { Injectable } from '@nestjs/common';

export interface CarrierConfig {
  id: string;
  name: string;
  pmsEndpoint: string;
  entitlementEndpoint?: string;
  apiKey: string;
  isActive: boolean;
}

@Injectable()
export class CarrierService {
  private carriers: CarrierConfig[] = [
    {
      id: 'mpt-mm',
      name: 'MPT Myanmar',
      pmsEndpoint: 'https://pms.mpt.com.mm/api',
      entitlementEndpoint: 'https://entitlement.mpt.com.mm/api',
      apiKey: process.env.MPT_API_KEY || 'mpt-key',
      isActive: true,
    },
    {
      id: 'atom-mm',
      name: 'ATOM Myanmar',
      pmsEndpoint: 'https://pms.atom.com.mm/api',
      entitlementEndpoint: 'https://entitlement.atom.com.mm/api',
      apiKey: process.env.ATOM_API_KEY || 'atom-key',
      isActive: true,
    },
    {
      id: 'ooredoo-mm',
      name: 'Ooredoo Myanmar',
      pmsEndpoint: 'https://pms.ooredoo.com.mm/api',
      entitlementEndpoint: 'https://entitlement.ooredoo.com.mm/api',
      apiKey: process.env.OOREDOO_API_KEY || 'ooredoo-key',
      isActive: true,
    },
    {
      id: 'mytel-mm',
      name: 'Mytel Myanmar',
      pmsEndpoint: 'https://pms.mytel.com.mm/api',
      entitlementEndpoint: 'https://entitlement.mytel.com.mm/api',
      apiKey: process.env.MYTEL_API_KEY || 'mytel-key',
      isActive: true,
    },
  ];

  getAll(): CarrierConfig[] {
    return this.carriers.filter(c => c.isActive);
  }

  getById(id: string): CarrierConfig | undefined {
    return this.carriers.find(c => c.id === id && c.isActive);
  }

  async syncWithPMS(carrierId: string, profileData: any) {
    const carrier = this.getById(carrierId);
    if (!carrier) throw new Error('Carrier not found');

    // PMS integration logic would be implemented here
    console.log(`Syncing with ${carrier.name} PMS:`, profileData);
    return { success: true, carrier: carrier.name };
  }
}