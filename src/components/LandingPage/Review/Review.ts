interface Review {
  image: string;
  name: string;
  country: string;
  review: string;
  stars: number;
}

export const reviews: Review[] = [
  {
    image: '/Review/Person1.svg',
    name: 'Edward',
    country: 'USA',
    review: 'I have used other platforms in the past, but Get around stood out the most because they charge hourly.',
    stars: 5,
  },
  {
    image: '/Review/Person2.svg',
    name: 'Alice',
    country: 'Canada',
    review: 'I have used other platforms in the past, but Get around stood out the most because they charge hourly. ',
    stars: 4,
  },
  {
    image: '/Review/Person3.svg',
    name: 'David',
    country: 'USA',
    review: 'I have used other platforms in the past, but Get around stood out the most because they charge hourly.',
    stars: 5,
  },
  {
    image: '/Review/Person4.svg',
    name: 'Scarlet',
    country: 'Canada',
    review: 'I have used other platforms in the past, but Get around stood out the most because they charge hourly.',
    stars: 4,
  },
];
