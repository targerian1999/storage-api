import { getConfig } from '../config'
import { getFileSizeLimit as getFileSizeLimitForTenant } from '../database/tenant'
import { StorageBackendError } from './errors'

const { isMultitenant } = getConfig()

/**
 * Get the maximum file size for a specific project
 * @param tenantId
 */
export async function getFileSizeLimit(tenantId: string): Promise<number> {
  let { fileSizeLimit } = getConfig()
  if (isMultitenant) {
    fileSizeLimit = await getFileSizeLimitForTenant(tenantId)
  }
  return fileSizeLimit
}

/**
 * Validates if a given object key or bucket key is valid
 * @param key
 */
export function isValidKey(key: string): boolean {
  // only allow s3 safe characters and characters which require special handling for now
  // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
  return key.length > 0 && /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(key)
}

/**
 * Validates if a given object key or bucket key is valid
 * throws if invalid
 * @param key
 * @param message
 */
export function mustBeValidKey(key: string, message: string) {
  if (!isValidKey(key)) {
    throw new StorageBackendError('Invalid Input', 400, message)
  }
}
