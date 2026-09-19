export function searchRestaurants(restaurants, query) {
  const list = restaurants || [];
  const term = (query || '').trim().toLowerCase();

  if (term.length === 0) {
    return list;
  }

  const results = [];

  list.forEach((restaurant) => {
    const nameMatches = restaurant.name.toLowerCase().includes(term);
    const cuisineMatches = restaurant.cuisines.some((cuisine) =>
      cuisine.toLowerCase().includes(term)
    );

    if (nameMatches || cuisineMatches) {
      results.push(restaurant);
      return;
    }

    const matchedItem = restaurant.menu.find((item) => item.name.toLowerCase().includes(term));

    if (matchedItem) {
      results.push({ ...restaurant, matchedDish: matchedItem.name });
    }
  });

  return results;
}
