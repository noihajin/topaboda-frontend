/**
 * Google Maps `options.restriction` — 대한민국(본토·제주·주요 도서 포함 범위, 대략적)
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.restriction
 */
export const KOREA_MAP_RESTRICTION = {
  latLngBounds: {
    north: 38.65,
    south: 33.0,
    west: 124.5,
    east: 132.0,
  },
  strictBounds: true,
};
