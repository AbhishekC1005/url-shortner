import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import ShortenUrlPage from "./components/ShortenUrlPage";
import { Toaster } from "react-hot-toast";
import LandingPage from "./components/LandingPage";
import AboutPage from "./components/AboutPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "./components/ErrorPage";

// <PrivateRoute publicPage={true}>
//      <RegisterPage />
// </PrivateRoute>

const AppRouter = () => {
  const { pathname } = useLocation();
  const hideHeaderFooter = pathname.startsWith("/s");

  return (
    <div className="relative min-h-screen w-full bg-[#FFFFFF] text-[#111827] overflow-x-hidden flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {!hideHeaderFooter && <Navbar />}
        <main className="flex-grow w-full flex flex-col justify-center">
          <Toaster position="bottom-center" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/s/:url" element={<ShortenUrlPage />} />

            <Route path="/register" element={<PrivateRoute publicPage={true}><RegisterPage /></PrivateRoute>} />
            <Route path="/login" element={<PrivateRoute publicPage={true}><LoginPage /></PrivateRoute>} />
            
            <Route path="/dashboard" element={ <PrivateRoute publicPage={false}><DashboardLayout /></PrivateRoute>} />
            <Route path="/error" element={ <ErrorPage />} />
            <Route path="*" element={ <ErrorPage message="We can't seem to find the page you're looking for"/>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}


export default AppRouter;

export const SubDomainRouter = () => {
    return (
        <Routes>
          <Route path="/:url" element={<ShortenUrlPage />} />
        </Routes>
    )
}