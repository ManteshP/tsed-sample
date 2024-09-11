export interface TenantDetailsData {
    data: TenantDetails;
}
export interface TenantDetails {
    tenantId: string;
    nyrDate: string;
    version: string;
    mtEnabled: boolean;
    timeZone?: string;
}
