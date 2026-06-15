const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Jelena',
    email: 'jelena@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Guest User',
    email: 'guest@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

module.exports = users;
