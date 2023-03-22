import { BrowserRouter,Route, Routes } from "react-router-dom";
import Homepage from "./pages/Home";
import MintPage from "./pages/Mint";
import "./App.css";

function App() {
  return (
        <BrowserRouter>    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/mint" element={<MintPage />} />
    </Routes></BrowserRouter>

  );
}

export default App;
