import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserInfoPage from "./pages/UserInfoPage";
import SelectAreaPage from "./pages/SelectAreaPage";
import ReviewSubmitPage from "./pages/ReviewSubmitPage";
import { SubmissionProvider } from "./context/SubmissionContext";

function App() {
  return (
    <SubmissionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/user-info" />} />
          <Route path="/user-info" element={<UserInfoPage />} />
          <Route path="/select-area" element={<SelectAreaPage />} />
          <Route path="/review-submit" element={<ReviewSubmitPage />} />
        </Routes>
      </Router>
    </SubmissionProvider>
  );
}

export default App;
