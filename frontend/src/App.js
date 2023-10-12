import { BrowserRouter } from "react-router-dom";
import Dashboard from "scenes/Dashboard";
// import LoginPage from "scenes/loginPage/Index";
function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </div>
  );
}

export default App;
