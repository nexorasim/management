export declare class EUICCAppletsService {
    private readonly logger;
    private readonly APPLET_IDS;
    validateAppletId(aid: string, type: 'ECASD' | 'ISD_R' | 'ISD_P'): boolean;
    getAppletInfo(aid: string): {
        type: string;
        description: string;
        spec: string;
    };
}
