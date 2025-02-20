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
import Note from "./pages/Note";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Review from "./pages/Review";
import AlertSystem from "./components/AlertSystem";
import SessionExpired from "./pages/SessionExpired";
import RegisterVerification from "./pages/RegisterVerification";
import VerifyAccount from "./pages/VerifyAccount";

function App() {
  return (
    <Auth>
      <ThemeContext>
        <AlertSystem>
          <BrowserRouter>
            <Routes>
              <Route path="/sessionExpired" element={<SessionExpired />}></Route>
              <Route path="/" element={<Home />}>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<RegisterPage />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/contact" element={<Contact />}></Route>
                <Route path="/serverError" element={<ServerErrorPage />}></Route>
                <Route path="/note/:noteId" element={<ProtectedRoute><Note /></ProtectedRoute>}></Route>
                <Route path="/review/:notebookID" element={<ProtectedRoute><Review /></ProtectedRoute>}></Route>
                <Route path="/registerVerification" element={<RegisterVerification />}></Route>
                <Route path="/verify/:uniqueToken" element={<VerifyAccount/>}></Route>
              </Route>
              <Route path="/*" element={<NotFound />}></Route>
            </Routes>
          </BrowserRouter>
        </AlertSystem>
      </ThemeContext>
    </Auth>
  );
}

export default App;
