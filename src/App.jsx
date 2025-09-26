import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SearchPage from './pages/SearchPage';
// import FormPage from './pages/FormPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import DetailPage from './pages/DetailPage';
import Register from './pages/Register';
import ErrorPage from './pages/ErrorPage';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import RolesAndPermissions from './pages/RolesAndPermission';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/error-400" element={<ErrorPage />} />
          <Route path="/roles" element={
            <Layout>
              <ProtectedRoute roles={["admin", "superadmin"]}>
                <Roles />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/permissions" element={
            <Layout>
              <ProtectedRoute roles={["admin", "superadmin"]}>
                <Permissions />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/roles-permissions" element={
            <Layout>
              <ProtectedRoute roles={["admin", "superadmin"]}>
                <RolesAndPermissions />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/stock" element={
            <Layout>
              <ProtectedRoute roles={["user", "admin", "superadmin"]}>
                <SearchPage />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/detail/:id" element={
            <Layout>
              <DetailPage />
            </Layout>
          } />
          <Route path="/admin" element={
            <Layout>
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            </Layout>
          } />
          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </Router>
    </AuthProvider>
  );
}

export default App;