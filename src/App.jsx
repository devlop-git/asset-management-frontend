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
              <Roles />
            </Layout>
          } />
          <Route path="/stock" element={
            <Layout>
              <SearchPage />
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
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </Router>
    </AuthProvider>
  );
}

export default App;