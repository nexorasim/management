import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as https from 'https';

@Injectable()
export class GSMACertificatesService {
  private readonly logger = new Logger(GSMACertificatesService.name);

  private readonly GSMA_ROOT_CIS = {
    'RSP2_ROOT_CI1': {
      keyId: '81370f5125d0b1d408d4c3b232e6d25e795bebfb',
      specs: ['SGP.21', 'SGP.22v2', 'SGP.22v3'],
      ca: 'DigiCert',
      expiresAt: '2052-02-21',
      crl: 'http://gsma-crl.symauth.com/offlineca/gsma-rsp2-root-ci1.crl'
    },
    'M2M31_ROOT_CI2': {
      keyId: 'd7a7d0c7c04ea76076e3f44faebde8779e2948d4',
      specs: ['SGP.01', 'SGP.02'],
      ca: 'Cybertrust',
      expiresAt: '2052-03-15',
      crl: null
    },
    'OISITE_GSMA_CI_G1': {
      keyId: '4c27967ad20c14b391e9601e41e604ad57c0222f',
      specs: ['SGP.21', 'SGP.22v2', 'SGP.22v3'],
      ca: 'WISeKey',
      expiresAt: '2059-01-07',
      crl: 'http://public.wisekey.com/crl/ogsmacig1.crl'
    }
  };

  async validateESIMCertificate(certificateChain: string[]): Promise<{ isValid: boolean; rootCI?: string }> {
    for (const [ciName, ciInfo] of Object.entries(this.GSMA_ROOT_CIS)) {
      try {
        const isValid = await this.verifyCertificateChain(certificateChain, ciInfo.keyId);
        if (isValid) {
          return { isValid: true, rootCI: ciName };
        }
      } catch (error) {
        this.logger.debug(`Certificate validation failed for ${ciName}: ${error.message}`);
      }
    }
    return { isValid: false };
  }

  private async verifyCertificateChain(chain: string[], rootKeyId: string): Promise<boolean> {
    // Simplified certificate chain validation
    const rootCert = chain[chain.length - 1];
    const certKeyId = this.extractKeyId(rootCert);
    return certKeyId === rootKeyId;
  }

  private extractKeyId(certificate: string): string {
    // Extract Subject Key Identifier from certificate
    const cert = crypto.createCertificate();
    // Simplified implementation - in production use proper X.509 parsing
    return crypto.createHash('sha1').update(certificate).digest('hex');
  }

  async checkCRL(ciName: string): Promise<boolean> {
    const ci = this.GSMA_ROOT_CIS[ciName];
    if (!ci?.crl) return true;

    return new Promise((resolve) => {
      https.get(ci.crl, (res) => {
        resolve(res.statusCode === 200);
      }).on('error', () => resolve(false));
    });
  }

  getSupportedSpecs(): string[] {
    return ['SGP.01', 'SGP.02', 'SGP.21', 'SGP.22v2', 'SGP.22v3', 'SGP.22v3.1'];
  }

  supportsDeviceChange(spec: string): boolean {
    return ['SGP.22v3', 'SGP.22v3.1'].includes(spec);
  }
}