import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';

@Injectable()
export class SMDSDiscoveryService {
  private readonly logger = new Logger(SMDSDiscoveryService.name);

  private readonly SMDS_SERVERS = {
    'GSMA': {
      address: 'lpa.ds.gsma.com',
      keyId: '81370f5125d0b1d408d4c3b232e6d25e795bebfb',
      provider: 'Thales'
    },
    'ESIM_DISCOVERY_PROD': {
      address: 'lpa.live.esimdiscovery.com',
      keyId: '81370f5125d0b1d408d4c3b232e6d25e795bebfb',
      provider: 'Thales'
    },
    'ESIM_DISCOVERY_STAGING': {
      address: 'lpa.live.esimdiscovery.dev',
      keyId: '81370f5125d0b1d408d4c3b232e6d25e795bebfb',
      provider: 'Thales'
    }
  };

  async discoverProfiles(eid: string): Promise<any[]> {
    const discoveries = await Promise.allSettled(
      Object.values(this.SMDS_SERVERS).map(server => 
        this.querySMDS(server.address, eid)
      )
    );

    return discoveries
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value)
      .flat();
  }

  private async querySMDS(address: string, eid: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: address,
        port: 443,
        path: `/gsma/rsp2/es9plus/discovery/${eid}`,
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      };

      https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve([]);
          }
        });
      }).on('error', reject).end();
    });
  }
}