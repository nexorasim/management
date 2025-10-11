export declare enum ProfileStatus {
    INACTIVE = "inactive",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    MIGRATING = "migrating"
}
export declare enum CarrierType {
    MPT = "mpt-mm",
    ATOM = "atom-mm",
    OOREDOO = "ooredoo-mm",
    MYTEL = "mytel-mm"
}
export declare class Profile {
    id: string;
    iccid: string;
    eid: string;
    status: ProfileStatus;
    carrier: CarrierType;
    msisdn: string;
    imsi?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastActivatedAt?: Date;
}
