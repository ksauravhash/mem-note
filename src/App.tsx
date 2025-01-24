import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Auth from "./components/Auth";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ThemeContext from "./components/ThemeContext";
import RegisterPage from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ServerErrorPage from "./pages/ServerError";

function App() {
  return (
    <Auth>
      <ThemeContext>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<RegisterPage />}></Route>
              <Route path="/about" element={<About />}></Route>
              <Route path="/contact" element={<Contact />}></Route>
              <Route path="/serverError" element={<ServerErrorPage />}></Route>
            </Route>
            <Route path="/*" element={<NotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeContext>
    </Auth>
  );
}

export default App;
