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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<SearchPage />} />
                {/* <Route path="/detail" element={<FormPage />} /> */}
                <Route path="/detail/:id" element={<DetailPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </Router>
    </AuthProvider>
  );
}

export default App;