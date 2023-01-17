import DisplayLoginTest from "./components/DisplayLoginTest";
import {testUsers} from "./hooks/useLogin";
import {Row, Col} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
    function RenderUserTests() {
        return testUsers.map((user) => {
            return (
                <DisplayLoginTest
                    key={user.testName}
                    email={user.email}
                    password={user.password}
                    testName={user.testName}
                    testCallback={user.testFunction}
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
            </Col>
        </Row>
    );
}
