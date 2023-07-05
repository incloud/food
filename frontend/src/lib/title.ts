const titles = [
  'q.food',
  'beyond.pizza',
  'beyond.burger',
  'beyond.sushi',
  'Expect the snack!',
  'Expect the food!',
  'New Snack Solutions',
  'Food as a Service',
];

export const title =
  titles[Math.round(Math.random() * (titles.length - 1))] ?? 'Food';

document.title = title;
