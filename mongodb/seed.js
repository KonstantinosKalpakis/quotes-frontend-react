qb = db.getSiblingDB("quotes-db");

// Seed.
qb.quotes.insertOne({
  __v: 0,
  _id: '27383733-1c5a-4344-84a0-1b2e905d1c02',
  author: 'Socrates',
  text: 'The unexamined life is not worth living.',
});

qb.quotes.insertOne({
  __v: 0,
  _id: '696913e0-2f90-4c5b-b9e1-2df7d1bbfe0a',
  author: 'Heraclitus',
  text: 'One cannot step twice in the same river.',
});

qb.quotes.insertOne({
  __v: 0,
  _id: '8ee1115c-517c-4ce3-babc-826ff5a3bfdb',
  author: 'Anaxagoras',
  text: 'In everything, there is a share of everything.',
});

qb.quotes.insertOne({
  __v: 0,
  _id: 'c277e936-cf79-49c1-8150-ec240e6d579e',
  author: 'St. Augustine',
  text: 'We are too weak to discover the truth by reason alone.',
});

qb.quotes.insertOne({
  __v: 0,
  _id: '836ecb44-e6d5-47a2-a254-28d939a4b530',
  author: 'Bishop George Berkeley',
  text: 'To be is to be perceived.',
});
