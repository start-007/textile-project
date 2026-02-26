import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Homepage from "./components/Homepage";
import Store from "./components/Store";
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/men" element={<Store />} />
          <Route path="/women" element={<Store />} />
          <Route path="/store" element={<Store />} />


        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;