import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import axios from "axios";
import { useState } from "react";

/*
This hook is used to validate a user.
It takes two functions as props:
    {
        onSuccess:()=>{},
        onFailure:()=>{}
    }

These methods allow the parent calling the hooks to handle the success and failure of the login.

It returns an object with the following methods:
    setEmail(): sets the email of the user for login
    setPassword(): sets the password of the user for login
    validate(): validates the user
*/

export default function useLogin(props) {
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState(props.password);

  async function validateUserSubscription() {
    const poolData = {
      UserPoolId: "us-east-1_jt5NMhoTk",
      ClientId: "7mtgtq8v0drgkg2gg869m2capq"
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
            message: "User paid",
            authenticationResponse: authenticationResponse,
            subscriptionResponse: subscriptionResponse
          });
        } else {
          props.onComplete({
            message: "User unpaid",
            authenticationResponse: authenticationResponse,
            subscriptionResponse: subscriptionResponse
          });
        }
      },
      onFailure: (err) => {
        props.onComplete({
          message: "Authentication error",
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
