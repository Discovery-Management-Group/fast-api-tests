const testUsers = [
  {
    testName: "Unregistered user",
    email: `total_garbage${Math.floor(Math.random() * 10000)}@mailinator.com`,
    password: "Password123!",
    testConditions:[
      result => result.authenticationResponse.code === "NotAuthorizedException",
    ],
  },

  {
    testName: "Unconfirmed user",
    email: "i_am_unconfirmed@mailinator.com",
    password: "Password123!",
    testConditions: [
        result => result.authenticationResponse.code === "UserNotConfirmedException",
    ],
  },

  {
    testName: "Unpaid user",
    email: "registered_and_unpaid@mailinator.com",
    password: "Password123!",
    testConditions: [
        result => result.subscriptionResponse.data.status === false,
    ],
  },

  {
    testName: "Premium user",
    email: "has_premium_subscription@mailinator.com",
    password: "Password123!",
    testConditions: [
        result => result.subscriptionResponse.data.status === true,
    ],
  }
];

export default testUsers;
