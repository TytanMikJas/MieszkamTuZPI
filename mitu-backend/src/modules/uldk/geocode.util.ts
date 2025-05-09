import fetch from 'node-fetch';

/**
 * Fetch geocode data from the geocode api
 * @param {string} endpoint
 * @returns {Promise<any>}
 */
async function fetchGeocode(endpoint: string) {
  return await fetch(
    `https://geocode.maps.co/${endpoint}&api_key=${process.env.GEOCODING_API_KEY}`,
  ).then(async (response) => {
    if (response.ok) {
      const parsed = await response.json();
      return parsed;
    } else {
      throw new Error(`geocode invalid request ${response.status}`);
    }
  });
}

/**
 * Get coords by address
 * @param {string} address
 * @returns {Promise<{ x: string; y: string }>}
 */
export async function getCoordsByAddresss(
  address: string,
): Promise<{ x: string; y: string }> {
  const result = await fetchGeocode(`search?q=${address}`);
  if (result.length == 0) return { x: '-1', y: '-1' };
  const x = result[0].lat;
  const y = result[0].lon;
  return { x, y };
}
