import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddSubject from "./pages/AddSubject";
import Leaderboard from "./pages/Leaderboard";
import { useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          user ? (
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/add-subject"
        element={user ? <AddSubject /> : <Navigate to="/login" />}
      />
      <Route
        path="/leaderboard"
        element={user ? <Leaderboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
