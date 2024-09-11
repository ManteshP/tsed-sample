export interface ThreeSixtyId {
    threeSixtyId?: string | undefined;
}

export interface Attributes {
    attributeValue: string;
    attributeKey: string;
}

export interface Identifier {
    identifierType: string;
    identifierValue: string;
}

export interface OrganizationInfo {
    description: string;
    displayName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    name: string;
    organizationId: string;
}

export interface Organization extends OrganizationInfo {
    status: string;
    organizationType: string;
    sourceSystem: string;
    lastUpdatedDate: string;
    createdDate: string;
    lastUpdatedBy: string;
    createdBy: string;
    displayGroup: string[];
    attributes: Attributes[];
}

export interface Identifiers {
    identifiers?: Identifier[];
}

export interface FocusLicenseCheck {
    areAllLicensesFocus: boolean;
}

export interface ContentUrlData {
    contentUrl: string;
}
