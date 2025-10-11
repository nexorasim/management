import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { apolloClient } from './utils/apollo';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profiles from './pages/Profiles';
import Analytics from './pages/Analytics';
import AuditLogs from './pages/AuditLogs';
import Login from './pages/Login';
import './i18n';

function App() {
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="profiles" element={<Profiles />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="audit" element={<AuditLogs />} />
                </Route>
              </Routes>
              <Toaster position="top-right" />
            </div>
          </Router>
        </AuthProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default App;