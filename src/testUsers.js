const testUsers = [
  {
    testName: "Unregistered user",
    email: "i_am_unregistered@mailinator.com",
    password: "Password123!",
    testFunction: (result) => {}
  },
  {
    testName: "Unconfirmed user",
    email: "i_am_unconfirmed@mailinator.com",
    password: "Password123!",
    testFunction: (result) => {}
  },
  {
    testName: "Unpaid user",
    email: "registered_and_unpaid@mailinator.com",
    password: "Password123!",
    testFunction: (result) => {}
  },
  {
    testName: "Premium user",
    email: "has_premium_subscription@mailinator.com",
    password: "Password123!",
    testFunction: (result) => {}
  }
];

export default testUsers;
