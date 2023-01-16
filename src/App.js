import TestResult from "./components/TestResult";
import testUsers from "./testUsers";

export default function App() {
  function RenderUserTests() {
    return testUsers.map((user) => {
      return (
        <TestResult
          key={user.testName}
          email={user.email}
          password={user.password}
          testName={user.testName}
        />
      );
    });
  }

  return (
    <div className="App">
      <h1>Login API Status</h1>
      <RenderUserTests />
    </div>
  );
}
