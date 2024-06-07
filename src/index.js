import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import {Layout, Typography, Button } from 'antd';

import Dashboard from './views/dashboard';
import './index.css';
import styles from './index.module.css';

const { Header, Footer } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout className='h-screen overflow-hidden'>
      <Header className='flex justify-between items-center'>
          <Title level={2} className='m-0 text-white font-extralight'><b>GitHub</b> Jobs</Title>
          <Button type='primary'>Login with Google</Button>
      </Header>
      <div className={styles.container}>
        <BrowserRouter>
          <Routes>
            <Route
                  path="/"
                  element={<Dashboard />}
                />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer style={{ textAlign: 'center' }}>
          GitHub Jobs ©{new Date().getFullYear()}
      </Footer>
  </Layout>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
