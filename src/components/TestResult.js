import {useState, useEffect, useRef} from "react";
import useLogin from "../hooks/useLogin";
import ReactJson from "react-json-view";
import _ from "lodash";
import Badge from 'react-bootstrap/Badge';

export default function TestResult(props) {
    const ranOnce = useRef();
    const [testResult, setTestResult] = useState(null);
    const [apiResult, setApiResult] = useState({
        message: "Test Pending",
        authenticationResponse: {},
        subscriptionResponse: {}
    });

    const userLogin = useLogin({
        email: props.email,
        password: props.password,
        onComplete: (loginStatus) => {
            setApiResult(loginStatus);
            setTestResult(props.testCallback(loginStatus));
        }
    });

    useEffect( () => {
        if (ranOnce.current !== true) {
            console.log("Running test: ", props.testName);
            userLogin.validate()
            ranOnce.current = true;
        }
    }, []);

    function getBadgeColor(){
    if (testResult === true) {
            return "success";
        } else if (testResult === false) {
            return "danger";
        } else {
            return "secondary";
        }
    }

    return (
        <h5>
            {props.testName}:
            <Badge bg={getBadgeColor()}>{apiResult.message}</Badge>
            <ReactJson
                src={_.omit(apiResult, "message")}
                name={null}
                collapsed={true}
            />
        </h5>
    );
}
