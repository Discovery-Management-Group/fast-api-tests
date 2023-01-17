import {useState, useEffect, useRef} from "react";
import useLogin from "../hooks/useLogin";
import ReactJson from "react-json-view";
import _ from "lodash";
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {Card} from "react-bootstrap";
import {ConditionalRender} from "./ConditionalRender";

export default function TestResult(props) {
    const ranOnce = useRef();
    const [jsonVisible, setJsonVisible] = useState(false);
    const [testResult, setTestResult] = useState([]);
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
            const testResults = props.testConditions.map((condition) => {
                return condition(loginStatus);
            });
            setTestResult(testResults);
        }
    });

    function runTest() {
        console.log("Running test: ", props.testName);
        setTestResult([]);
        setApiResult({
            message: "Test Pending",
            authenticationResponse: {},
            subscriptionResponse: {}
        })
        userLogin.validate()
        ranOnce.current = true;
    }

    useEffect(() => {
        if (ranOnce.current !== true) {
            runTest();
        }
    }, []);

    function getBadgeColor() {
        if (testResult.includes(false)) {
            return "danger";
        } else if (testResult.includes(true)) {
            return "success";
        } else {
            return "secondary";
        }
    }

    function TestConditions() {
        return props.testConditions.map((condition,index) => {
            let badge = "";
            if(testResult.length===0){
                badge = "🕚 "
            }
            else if(testResult[index] === true){
                badge = "✅ ";
            }
            else{
                badge = "❌ ";
            }

            let conditionString = String(condition);
            conditionString = conditionString.replace("function(e)", "");
            conditionString = conditionString.replace("return", "");
            conditionString = conditionString.replace("e.", "hookResponse.");
            conditionString = conditionString.replace("{", "");
            conditionString = conditionString.replace("}", "");
            conditionString = conditionString.replace("===", " === ");
            conditionString = conditionString.replace("!==", " !== ");
            conditionString = conditionString.replace("!1", "false");
            conditionString = conditionString.replace("!0", "true");

            return (
                <p key={conditionString}>
                {badge}
                {conditionString}
                </p>
            )
        })
    }

    return (
        <Card
            style={{marginTop: "1rem", paddingBottom: "-1rem"}}
        >
            <Button
                style={{padding: "1rem", margin: "0.5rem", alignItems: "left", textAlign: "left"}}
                variant={"light"}
                onClick={() => {
                    setJsonVisible(!jsonVisible)
                }}
            >
                <Card.Title>
                    {props.testName}:{" "}
                    <Badge bg={getBadgeColor()}>{apiResult.message}</Badge>
                </Card.Title>
            </Button>

            <ConditionalRender renderCondition={jsonVisible}>
                <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">Test Conditions</Card.Subtitle>
                    <TestConditions/>
                    <Card.Subtitle
                        className="mb-2 text-muted"
                        style={{marginTop: "1rem"}}
                    >
                        Response Object
                    </Card.Subtitle>
                    <ReactJson
                        name={"hookResponse"}
                        collapsed={1}
                        src={apiResult}
                    />
                    <Button
                        style={{marginTop: "1rem", width:"100%"}}
                        variant={testResult === null ? "outline-primary" : "primary"}
                        onClick={runTest}
                        disabled={testResult === null}
                    >
                        {testResult === null ? "Test Pending" : "Run Test Again"}
                    </Button>
                </Card.Body>
            </ConditionalRender>
        </Card>
    );
}
