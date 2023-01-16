import { useState, useEffect } from "react";
import useLogin from "../hooks/useLogin";
import ReactJson from "react-json-view";
import _ from "lodash";

export default function TestResult(props) {
  const [testResult, setTestResult] = useState({
    message: "Test Pending",
    authenticationResponse: {},
    subscriptionResponse: {}
  });

  const userLogin = useLogin({
    email: props.email,
    password: props.password,
    onComplete: (loginStatus) => setTestResult(loginStatus)
  });

  useEffect(() => {
    userLogin.validate();
  });

  return (
    <h5>
      {props.testName}: {testResult.message}
      <ReactJson
        src={_.omit(testResult, "message")}
        name={null}
        collapsed={true}
      />
    </h5>
  );
}
