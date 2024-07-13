import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Room from "./components/Room";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
