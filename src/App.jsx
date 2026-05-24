import { Route, Routes } from "react-router-dom";
import { DashBoard } from "./DashboardRoot";
import { DatewisePage } from "./DatewisePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route
        path="/datewise-summary"
        element={<DatewisePage />}
      />
    </Routes>
  );
}

export default App;