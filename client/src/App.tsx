import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePages from "./pages/HomePages";
import LoginPages from "./pages/LoginPages";
import RegisterPages from "./pages/RegisterPages";
import BookListPages from "./pages/BookListPages";
import ProtectedRoutes from "./utils/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/pages/login/Oauth" element={<LoginPages />} />
        <Route path="/pages/Register/Oauth" element={<RegisterPages />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/pages/Book/List" element={<BookListPages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
