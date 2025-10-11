import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EUICCAppletsService {
  private readonly logger = new Logger(EUICCAppletsService.name);

  private readonly APPLET_IDS = {
    ECASD: 'A0000005591010FFFFFFFF8900000200',
    ISD_R: 'A0000005591010FFFFFFFF8900000100',
    ISD_P: 'A0000005591010FFFFFFFF89000001XX' // XX varies per profile
  };

  validateAppletId(aid: string, type: 'ECASD' | 'ISD_R' | 'ISD_P'): boolean {
    if (type === 'ISD_P') {
      return aid.startsWith('A0000005591010FFFFFFFF890000010');
    }
    return aid === this.APPLET_IDS[type];
  }

  getAppletInfo(aid: string) {
    if (aid === this.APPLET_IDS.ECASD) {
      return { type: 'ECASD', description: 'Secure credential storage', spec: 'SGP.22 v2.3 (2.4.2)' };
    }
    if (aid === this.APPLET_IDS.ISD_R) {
      return { type: 'ISD-R', description: 'Profile lifecycle management', spec: 'SGP.22 v2.3 (2.4.3)' };
    }
    if (aid.startsWith('A0000005591010FFFFFFFF890000010')) {
      return { type: 'ISD-P', description: 'Profile container', spec: 'SGP.22 v2.3 (2.4.4)' };
    }
    return null;
  }
}