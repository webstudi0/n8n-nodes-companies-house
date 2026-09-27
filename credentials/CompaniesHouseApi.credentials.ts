import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class CompaniesHouseApi implements ICredentialType {
    name = 'companiesHouseApi';
    displayName = 'Companies House API';
    documentationUrl = 'https://developer.company-information.service.gov.uk/';

    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'user',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'Your Companies House API key (used as the Basic Auth username)',
        },
        // Password is intentionally empty for Companies House Basic Auth
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: false,
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            auth: {
                username: '={{$credentials.user}}',
                password: '={{$credentials.password}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.company-information.service.gov.uk',
            url: '/search/companies?q=test&items_per_page=1',
            method: 'GET',
        },
    };
}
