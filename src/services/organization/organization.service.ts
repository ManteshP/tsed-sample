import { DataSource } from "@tsed/apollo";
import { Inject } from '@tsed/di';
import { Logger } from '@tsed/logger';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { COMMA, ORGANIZATION_SERVICE, THREE_SIXTY_ID } from '../../model/common/const';
import { ORGANIZATION_DETAILS_ROUTE } from '../../model/common/routes';
import { Identifiers, Organization, ThreeSixtyId } from '../../model/organization/organization';
import { ErrorUtils } from '../../utils/error';
import { LOGGER } from '../../utils/logger';
import { CONFIG } from '../config/config.provider';
import { BasicRestDataSource } from '../datasource/basic-rest-datasource';

@DataSource()
export class OrganizationService extends BasicRestDataSource {
    readonly logger: Logger;
    private username = '';
    private password = '';

    private readonly errorUtils: ErrorUtils;

    constructor(@Inject(CONFIG) config: any, @Inject(LOGGER) logger: Logger, @Inject() errorUtils: ErrorUtils) {
        const {
            baseUrl,
            auth: { user, pass },
            timeout
        } = config.get(ORGANIZATION_SERVICE);

        super(user, pass, timeout);
        this.username = user;
        this.password = pass;
        this.baseURL = baseUrl;
        this.logger = logger;
        this.errorUtils = errorUtils;
    }

    public async getOrganizationDetails(organizationID: string): Promise<Organization & ThreeSixtyId> {
        try {
            const url = this.baseURL + ORGANIZATION_DETAILS_ROUTE + organizationID;
            const { data }: { data: Organization & Identifiers } = await axios.get(url, {
                auth: {
                    username: this.username,
                    password: this.password
                }
            });
            return this.introduceThreeSixtyIdentifier(data);
        } catch (error) {
            this.logger.error(error);
            if (error.response.status == StatusCodes.NOT_FOUND) this.errorUtils.throwInvalidValueError('Organization');
            else throw error;
        }
    }

    async getThreeSixtyId(organizationID: string): Promise<string> {
        /* START LOCAL DOCKER OVERRIDE */
        if (process.env.RUNTIME_ENV === 'local') {
            if (!process.env.RUNTIME_ORGANIZATION_ID_OVERRIDE) {
                throw new Error('RUNTIME_ORGANIZATION_ID_OVERRIDE is not set');
            }

            if (!process.env.RUNTIME_ORGANIZATION_THREE_SIXTY_ID_OVERRIDE) {
                throw new Error('RUNTIME_ORGANIZATION_THREE_SIXTY_ID_OVERRIDE is not set');
            }

            if (organizationID == process.env.RUNTIME_ORGANIZATION_ID_OVERRIDE) {
                return Promise.resolve(process.env.RUNTIME_ORGANIZATION_THREE_SIXTY_ID_OVERRIDE);
            }
        }
        /* END LOCAL DOCKER OVERRIDE ***/

        /* Admins might have access to multiple schools under the same district, 
            any one of the org should provide the URL details*/
        if (organizationID.indexOf(COMMA) != -1) {
            organizationID = organizationID.slice(0, organizationID.indexOf(COMMA));
        }
        const organizationDetails = await this.getOrganizationDetails(organizationID);
        return organizationDetails.threeSixtyId || '';
    }

    introduceThreeSixtyIdentifier(organizationDetails: Organization & Identifiers): Organization & ThreeSixtyId {
        const { identifiers } = organizationDetails;
        const threeSixtyId = identifiers?.find((value) => value.identifierType === THREE_SIXTY_ID)?.identifierValue;
        delete organizationDetails.identifiers;
        const processedOrganizationDetails: Organization & ThreeSixtyId = {
            ...organizationDetails,
            threeSixtyId
        };
        return processedOrganizationDetails;
    }
}
