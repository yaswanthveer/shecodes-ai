import CloudDatabasesV5 from 'ibm-cloud-databases/cloud-databases/v5';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

// This uses the IAM API Key from your IBM Cloud account
const apiKey = process.env.CLOUDANT_APIKEY || '';

let cdClient: CloudDatabasesV5 | null = null;

/**
 * Get an authenticated IBM Cloud Databases v5 API client.
 * This client allows you to manage your IBM Cloud Database deployments 
 * programmatically (e.g. creating/deleting databases, scaling resources, getting usage).
 */
export function getCloudDatabasesClient(): CloudDatabasesV5 {
  if (cdClient) return cdClient;

  if (!apiKey) {
    console.warn("IBM Cloud API Key is not set in the environment variables.");
  }

  const authenticator = new IamAuthenticator({
    apikey: apiKey,
  });

  cdClient = CloudDatabasesV5.newInstance({
    authenticator: authenticator,
  });

  return cdClient;
}
