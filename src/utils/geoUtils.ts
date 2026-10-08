/**
 * ============================================================================
 * 🌐 GEOFENCING & GEOLOCATION UTILITIES (HAVERSINE FORMULA)
 * ============================================================================
 * Designed for first-year CSE students to understand and explain easily:
 *
 * Question: How do we find the distance between two coordinates on Earth?
 * Answer: Because the Earth is roughly spherical, flat Euclidean geometry (dx^2 + dy^2)
 * is inaccurate over large distances. Instead, we use the HAVERSINE FORMULA:
 *
 * 1. Convert latitude and longitude from degrees to radians:
 *    radians = degrees * (π / 180)
 * 2. Calculate the difference in latitudes (Δlat) and longitudes (Δlon).
 * 3. Calculate 'a', the square of half the chord length between the points:
 *    a = sin²(Δlat / 2) + cos(lat1) * cos(lat2) * sin²(Δlon / 2)
 * 4. Calculate 'c', the angular distance in radians:
 *    c = 2 * atan2(√a, √(1 − a))
 * 5. Multiply by Earth's radius (R ≈ 6,371,000 meters) to get distance 'd':
 *    d = R * c
 * ============================================================================
 */

export const EARTH_RADIUS_METERS = 6371000; // Mean Earth radius in meters

/**
 * Calculates the great-circle distance between two GPS coordinates in meters.
 * @param lat1 Latitude of player
 * @param lon1 Longitude of player
 * @param lat2 Latitude of checkpoint
 * @param lon2 Longitude of checkpoint
 * @returns Distance in meters (rounded to 1 decimal place)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  // Haversine formula core
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceMeters = EARTH_RADIUS_METERS * c;
  return Math.round(distanceMeters * 10) / 10;
}

/**
 * Checks whether a player is inside the designated checkpoint geofence radius.
 */
export function isInsideGeofence(
  playerLat: number,
  playerLon: number,
  checkpointLat: number,
  checkpointLon: number,
  radiusMeters: number
): boolean {
  const distance = calculateHaversineDistance(playerLat, playerLon, checkpointLat, checkpointLon);
  return distance <= radiusMeters;
}

/**
 * Calculates compass bearing from player to target (in degrees: 0° to 360°)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  const y = Math.sin(toRadians(lon2 - lon1)) * Math.cos(toRadians(lat2));
  const x =
    Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
    Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(toRadians(lon2 - lon1));

  const brng = toDegrees(Math.atan2(y, x));
  return (brng + 360) % 360;
}

/**
 * Converts compass degrees to human readable direction (e.g., 'NE', 'South')
 */
export function getCompassDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  const index = Math.round((degrees % 360) / 45);
  return directions[index];
}

/**
 * Formats distance cleanly for UI presentation.
 */
export function formatDistance(meters: number): string {
  if (meters < 1) {
    return 'Right here!';
  }
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}
