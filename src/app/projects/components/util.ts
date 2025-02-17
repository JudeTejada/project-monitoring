export const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
export const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    // Return domain name + first part of path, truncated if too long
    const path = urlObj.pathname.split('/')[1] || '';
    return `${urlObj.hostname}/${path}...`;
  } catch {
    // If URL parsing fails, truncate the original string
    return url.length > 30 ? url.substring(0, 40) + '...' : url;
  }
};