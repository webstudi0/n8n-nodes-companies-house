import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestOptions,
  NodeApiError,
} from 'n8n-workflow';

export class CompaniesHouse implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Companies House',
    name: 'companiesHouse',
    icon: 'file:CompaniesHouse.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with the UK Companies House API to retrieve company information',
    subtitle: '={{$parameter["operation"]}}',
    defaults: {
      name: 'Companies House',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'companiesHouseApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'search',
        options: [
          {
            name: 'Get Company Profile',
            value: 'getProfile',
            action: 'Retrieve detailed profile information for a specific company',
            description: 'Retrieve detailed profile information for a specific company',
          },
          {
            name: 'Get Filing History',
            value: 'getFilingHistory',
            action: 'Fetch the company filing history including accounts and returns',
            description: 'Fetch the company filing history including accounts and returns',
          },
          {
            name: 'Get Officers',
            value: 'getOfficers',
            action: 'List the company directors and secretaries',
            description: 'List the company directors and secretaries',
          },
          {
            name: 'Get Persons with Significant Control',
            value: 'getPsc',
            action: 'List individuals or entities with significant control over the company',
            description: 'List individuals or entities with significant control over the company',
          },
          {
            name: 'Get Registered Office Address',
            value: 'getAddress',
            action: 'Retrieve the official registered office address of the company',
            description: 'Retrieve the official registered office address of the company',
          },
          {
            name: 'Search Companies',
            value: 'search',
            action: 'Search for companies by name',
            description: 'Search for companies by name',
          },
        ],
      },
      {
        displayName: 'Company Name or Number',
        name: 'companyInput',
        type: 'string',
        default: '',
        required: true,
        description: 'Company name (for search) or registration number (for other operations)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      const companyInput = this.getNodeParameter('companyInput', i) as string;

      let url = '';
      switch (operation) {
        case 'search':
          url = `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(companyInput)}`;
          break;
        case 'getProfile':
          url = `https://api.company-information.service.gov.uk/company/${companyInput}`;
          break;
        case 'getOfficers':
          url = `https://api.company-information.service.gov.uk/company/${companyInput}/officers`;
          break;
        case 'getFilingHistory':
          url = `https://api.company-information.service.gov.uk/company/${companyInput}/filing-history`;
          break;
        case 'getAddress':
          url = `https://api.company-information.service.gov.uk/company/${companyInput}/registered-office-address`;
          break;
        case 'getPsc':
          url = `https://api.company-information.service.gov.uk/company/${companyInput}/persons-with-significant-control`;
          break;
        default:
          throw new NodeApiError(this.getNode(), { message: `Unknown operation: ${operation}` });
      }

      const options: IHttpRequestOptions = {
        method: 'GET',
        url,
        json: true,
      };

      const response = await this.helpers.httpRequestWithAuthentication.call(
        this,
        'companiesHouseApi',
        options,
      );

      returnData.push({ json: response as object });
    }

    return [returnData];
  }
}
