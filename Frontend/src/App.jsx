import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Test from "./pages/Test"; 
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Footer from "./components/Footer";
import EditNote from "./pages/EditNote";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Profile from "./pages/Profile";
import Register from "./pages/Register"; 
import Paste from "./components/Paste";
import ViewPaste from "./components/ViewPaste";
import About from "./components/About";
import Help from "./components/Help";
import Login from "./pages/Login"; 

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const Layout = ({ children }) => (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition">
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      {children}
      <Footer />
    </div>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
    },

    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/edit/:id",
      element: (
        <ProtectedRoute>
          <Layout>
            <EditNote />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <Layout>
          <Register />
        </Layout>
      ),
    },

    {
      path: "/login",
      element: (
        <Layout>
          <Login />
        </Layout>
      ),
    },
    {
      path: "/pastes",
      element: (
        <ProtectedRoute>
          <Layout>
            <Paste />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/pastes/:id",
      element: (
        <ProtectedRoute>
          <Layout>
            <ViewPaste />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/about",
      element: (
        <Layout>
          <About />
        </Layout>
      ),
    },
    {
      path: "/help",
      element: (
        <Layout>
          <Help />
        </Layout>
      ),
    },
    {
      path: "/test",
      element: (
        <Layout>
          <Test />
        </Layout>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
