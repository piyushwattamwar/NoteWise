import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Paste from "./components/Paste";
import ViewPaste from "./components/ViewPaste";
import EditNote from "./pages/EditNote";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Help from "./components/Help";
import About from "./components/About";
import Test from "./pages/Test";

// 🔐 Auth Protection
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// 🧩 Common Layout
const Layout = ({ children, isDark, setIsDark }) => (
  <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition">
    <Navbar isDark={isDark} setIsDark={setIsDark} />
    {children}
    <Footer />
  </div>
);

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout isDark={isDark} setIsDark={setIsDark}><Home /></Layout>,
    },
    {
      path: "/register",
      element: <Layout isDark={isDark} setIsDark={setIsDark}><Register /></Layout>,
    },
    {
      path: "/login",
      element: <Layout isDark={isDark} setIsDark={setIsDark}><Login /></Layout>,
    },
    {
      path: "/about",
      element: <Layout isDark={isDark} setIsDark={setIsDark}><About /></Layout>,
    },
    {
      path: "/help",
      element: <Layout isDark={isDark} setIsDark={setIsDark}><Help /></Layout>,
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Layout isDark={isDark} setIsDark={setIsDark}><Profile /></Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/pastes",
      element: (
        <ProtectedRoute>
          <Layout isDark={isDark} setIsDark={setIsDark}><Paste /></Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/pastes/:id",
      element: (
        <ProtectedRoute>
          <Layout isDark={isDark} setIsDark={setIsDark}><ViewPaste /></Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/edit/:id",
      element: (
        <ProtectedRoute>
          <Layout isDark={isDark} setIsDark={setIsDark}><EditNote /></Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/test",
      element: (
        <ProtectedRoute>
          <Layout isDark={isDark} setIsDark={setIsDark}><Test /></Layout>
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

