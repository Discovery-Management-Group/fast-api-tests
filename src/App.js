import DisplayLoginTest from "./components/DisplayLoginTest";
import DisplaySubscriptionTest from "./components/DisplaySubscriptionTest";
import {testUsers, testSubscriptions, validateEmail} from "./hooks/useLogin";
import {Row, Col} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";

export default function App() {
    function RenderUserTests() {
        return testUsers.map((user) => {
            return (
                <DisplayLoginTest
                    key={user.testName}
                    isDev={user.isDev}
                    email={user.email}
                    password={user.password}
                    testName={user.testName}
                    testConditions={user.testConditions}
                />
            );
        });
    }

    function RenderSubscriptionTests() {
        return testSubscriptions.map((user) => {
            return (
                <DisplaySubscriptionTest
                    key={user.testName}
                    testName={user.testName}
                    testFunction = {async ()=>{
                        return validateEmail(user.email, user.isDev);
                    }}
                    testConditions={user.testConditions}
                />
            );
        });
    }

    return (
        <Row className="App" style={{margin: "1rem"}}>
            <Col>
                <h1>Login API Status</h1>
                <RenderUserTests/>
                <br/>
                <h1>Subscription API Status</h1>
                <RenderSubscriptionTests/>
            </Col>
        </Row>
    );
}
