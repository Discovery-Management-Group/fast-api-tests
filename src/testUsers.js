const testUsers = [
  {
    testName: "Unregistered user",
    email: `total_garbage${Math.floor(Math.random() * 10000)}@mailinator.com`,
    password: "Password123!",
    testFunction: (result) => {
      if( result.authenticationResponse.code === "NotAuthorizedException" ){
        return true
      }else{
        return false
      }
    }
  },
  {
    testName: "Unconfirmed user",
    email: "i_am_unconfirmed@mailinator.com",
    password: "Password123!",
    testFunction: (result) => {
      if( result.authenticationResponse.code === "UserNotConfirmedException" ){
        return true
      }else{
        return false
      }
    }
  },
  {
    testName: "Unpaid user",
    email: "registered_and_unpaid@mailinator.com",
    password: "Password123!",
    testFunction: (result) => {
      if( result.subscriptionResponse.data.status === false ){
        return true
      }else{
        return false
      }
    }
  },
  {
    testName: "Premium user",
    email: "has_premium_subscription@mailinator.com",
    password: "Password123!",
    testFunction: (result) => {
      if(result.subscriptionResponse.data.status === true ){
        return true
      }else{
        return false
      }
    }
  }
];

export default testUsers;
