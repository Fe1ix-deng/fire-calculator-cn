import { Route, Routes } from "react-router-dom";
import CalculatorsPage from "./src/CalculatorsPage.jsx";
import HomePage from "./src/HomePage.jsx";
import Navbar from "./src/Navbar.jsx";
import QuizPage from "./src/QuizPage.jsx";
import StandardFire from "./src/calculators/StandardFire.jsx";
import FireQuestionnaire from "./src/FireQuestionnaire.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/questionnaire" element={<FireQuestionnaire />} />
        <Route path="/calculator/standard" element={<StandardFire />} />
        <Route path="/standard-fire" element={<StandardFire />} />
      </Routes>
    </>
  );
}
