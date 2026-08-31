/**
 * Centralized test data. Keeping fixtures here (rather than hardcoded in specs)
 * makes the suite easier to maintain as it scales and keeps env-specific
 * values in one place.
 */
const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performanceGlitch: { username: 'performance_glitch_user', password: 'secret_sauce' },
  invalid: { username: 'not_a_real_user', password: 'wrong_password' },
};

const checkoutInfo = {
  valid: { firstName: 'Ada', lastName: 'Lovelace', postalCode: '94107' },
  missingFirstName: { firstName: '', lastName: 'Lovelace', postalCode: '94107' },
  missingLastName: { firstName: 'Ada', lastName: '', postalCode: '94107' },
  missingPostalCode: { firstName: 'Ada', lastName: 'Lovelace', postalCode: '' },
};

const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
};

module.exports = { users, checkoutInfo, products };
