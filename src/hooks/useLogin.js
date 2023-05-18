/*
This hook is used to validate a user.
It accepts a default email, password, and callback function as props:
    {
      email: props.email,
      password: props.password,
      onComplete: (loginStatus) => {},
    }

These methods allow the parent calling the hooks to handle the success and failure of the login.

It returns an object with the following methods:
    setEmail(): sets the email of the user for login
    setPassword(): sets the password of the user for login
    validate(): validates the user
*/
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import axios from "axios";
import { useState } from "react";

export default function useLogin(props) {
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState(props.password);

  async function validateUserSubscription() {
    const poolData = {
      UserPoolId: "us-east-1_jt5NMhoTk",
      ClientId: "7mtgtq8v0drgkg2gg869m2capq",
    };

    const cognitoPool = new CognitoUserPool(poolData);

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: cognitoPool
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: async (res) => {
        const authenticationResponse = res?.idToken?.payload;
        const cognitoUsername = res?.idToken?.payload["cognito:username"];

        const subscriptionEndpoint = `https://1gjpy63ru4.execute-api.us-east-1.amazonaws.com/test/customers/${cognitoUsername}/subscription`;
        const subscriptionResponse = await axios.get(subscriptionEndpoint);
        if (subscriptionResponse.data.status === true) {
          props.onComplete({
            message: "paid",
            authenticationResponse: authenticationResponse,
            subscriptionResponse: subscriptionResponse
          });
        } else {
          props.onComplete({
            message: "unpaid",
            authenticationResponse: authenticationResponse,
            subscriptionResponse: subscriptionResponse
          });
        }
      },
      onFailure: (err) => {
        let message = "";
        if(err.code === "UserNotConfirmedException"){
          message = "unconfirmed";
        }else if(err.code === "NotAuthorizedException"){
          message = "unauthorized";
        }else{
          message = err.code;
        }
        props.onComplete({
          message: message,
          authenticationResponse: err,
          subscriptionResponse: {}
        });
      }
    });
  }

  return {
    validate: validateUserSubscription,
    setEmail: setEmail,
    setPassword: setPassword
  };
}

export const testUsers = [
  {
    testName: "Unregistered user",
    email: `total_garbage${Math.floor(Math.random() * 10000)}@mailinator.com`,
    password: "Password123!",
    testConditions:[
      result => result.authenticationResponse.code === "NotAuthorizedException",
        result => result.message === "unauthorized"
    ],
  },

  {
    testName: "Unconfirmed user",
    email: "i_am_unconfirmed@mailinator.com",
    password: "Password123!",
    testConditions: [
      result => result.authenticationResponse.code === "UserNotConfirmedException",
      result => result.message === "unconfirmed",
    ],
  },

  {
    testName: "Unpaid user",
    email: "registered_and_unpaid@mailinator.com",
    password: "Password123!",
    testConditions: [
      result => result.subscriptionResponse.data.status === false,
      result => result.authenticationResponse["email"] === "registered_and_unpaid@mailinator.com",
      result => result.authenticationResponse["given_name"] === "Free",
      result => result.authenticationResponse["family_name"] === "Loader",
      result => result.message === "unpaid",
      result => result.subscriptionResponse.data.expiration === "" || result.subscriptionResponse.data.expiration === 0
    ],
  },

  {
    testName: "Premium user",
        email: "curious_george@mailinator.com",
        password: "Password123!",
        testConditions: [
            result => result.subscriptionResponse.data.status === true,
            result => result.authenticationResponse["email"] === "curious_george@mailinator.com",
            result => result.authenticationResponse["given_name"] === "Curious",
            result => result.authenticationResponse["family_name"] === "George",
            result => result.message === "paid",
        ],
  }
];

