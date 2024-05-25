import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./components/AuthContext"; // Import useAuth hook
import ProtectedRoute from "./components/ProtectedRoute";
import Bookshelves from "./pages/BookShelves";
import NavigationBar from "./components/Navigation";

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth(); // Get user from useAuth hook

  return (
    <Router>
      {/* Render NavigationBar only if user is authenticated */}
      {user && <NavigationBar />}
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookshelves/:id"
          element={
            <ProtectedRoute>
              <Bookshelves />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
