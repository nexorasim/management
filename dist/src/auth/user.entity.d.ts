export declare enum UserRole {
    ADMIN = "admin",
    OPERATOR = "operator",
    AUDITOR = "auditor"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    carrier?: string;
    isActive: boolean;
    createdAt: Date;
}
