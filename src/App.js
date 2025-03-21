import "./App.css";
// import Grid from "./Grid";
import { BrowserRouter } from "react-router-dom";
import RouteList from "./Routes/index";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={2000} />
        <RouteList />
      </BrowserRouter>
    </div>
  );
}

export default App;
