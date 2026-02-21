import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Error404 from "./components/Error404";
import Error500 from "./components/Error500";
import MainPage from "./components/MainPage"; // your current App content in separate component

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/500" element={<Error500 />} />
        <Route path="*" element={<Error404 />} /> {/* catch-all */}
      </Routes>
  );
}