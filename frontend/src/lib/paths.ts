export const paths = {
  home: '/',
  events: '/',
  event: (id: string) => `/events/${id}`,
  restaurants: '/restaurants',
  restaurant: (id: string) => `${paths.restaurants}/${id}`,
};
