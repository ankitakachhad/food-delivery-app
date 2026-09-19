import restaurants from './restaurants.json';

const RESPONSE_DELAY_MS = 800;
const FAILURE_RATE = 0.15;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRestaurants() {
  await wait(RESPONSE_DELAY_MS);

  // The random failure is deliberate: with no real backend this is what makes the loading and error states reachable.
  if (Math.random() < FAILURE_RATE) {
    throw new Error('Could not reach our kitchens right now. Please try again.');
  }

  return restaurants;
}

export async function getRestaurantById(id) {
  await wait(RESPONSE_DELAY_MS);

  const restaurant = restaurants.find((item) => item.id === id);

  if (!restaurant) {
    throw new Error('This restaurant is no longer available.');
  }

  return restaurant;
}
