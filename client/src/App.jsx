import { BrowserRouter, Route, Routes } from "react-router-dom";
import { About, Home, Profile, SignIn, SignUp } from "./pages";

function App() {
  return (
    <BrowserRouter>
      {/* Your routes and components go here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="about" element={<About />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
