import {useState, useEffect, useRef} from "react";
import useLogin from "../hooks/useLogin";
import ReactJson from "react-json-view";
import _ from "lodash";
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {Card} from "react-bootstrap";
import {ConditionalRender} from "./ConditionalRender";

export default function DisplayLoginTest(props) {
    const [jsonVisible, setJsonVisible] = useState(false);
    const [testResult, setTestResult] = useState([]);
    const [apiResult, setApiResult] = useState({
        message: "Idle",
    });

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
            conditionString = conditionString.replace("&&", " && ");
            conditionString = conditionString.replace("||", " || ");
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
                        name={"Response Object"}
                        collapsed={1}
                        src={apiResult}
                    />
                    <Button
                        style={{marginTop: "1rem", width:"100%"}}
                        variant={apiResult.message === "Test Pending" ? "outline-primary" : "primary"}
                        onClick={async ()=>{
                            const response = await props.testFunction();
                            setApiResult(response);
                            const testResults = props.testConditions.map((condition,index)=>{
                                return(condition(response));
                            });
                            setTestResult(testResults);
                        }}
                        disabled={apiResult.message === "Test Pending"}
                    >
                        {apiResult.message === "Test Pending" ? "Test Pending" : "Run Test"}
                    </Button>
                </Card.Body>
            </ConditionalRender>
        </Card>
    );
}
