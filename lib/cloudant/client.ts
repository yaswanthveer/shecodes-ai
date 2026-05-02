import { CloudantV1 } from '@ibm-cloud/cloudant';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

// Use the credentials you provided from the environment variables
const apiKey = process.env.CLOUDANT_APIKEY || '';
const url = process.env.CLOUDANT_URL || '';

let cloudantClient: CloudantV1 | null = null;

/**
 * Get an authenticated IBM Cloudant client instance.
 * @returns CloudantV1 client instance
 */
export function getCloudantClient(): CloudantV1 {
  if (cloudantClient) return cloudantClient;

  if (!apiKey || !url) {
    console.warn("IBM Cloudant credentials are not fully set in the environment variables.");
  }

  const authenticator = new IamAuthenticator({
    apikey: apiKey,
  });

  cloudantClient = CloudantV1.newInstance({
    authenticator: authenticator,
  });
  
  cloudantClient.setServiceUrl(url);

  return cloudantClient;
}
