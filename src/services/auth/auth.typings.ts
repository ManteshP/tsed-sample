export interface AuthContext {
    authScope: AuthScope;
}

export interface AuthScope {
    userScope?: UserScope;
    error?: any;
    headers?: AuthHeaders;
    isAuthenticated?: any;
}

export interface UserScope {
    userId: string;
    scope: string;
    accessInfo: AccessInfo;
    token: string;
    stateCode: string;
    classes?: any;
}

export interface AccessInfo {
    username: string;
    role: string[];
    organizations: string[];
}

export interface AuthHeaders {
    authorization?: string;
    userid?: string;
}
