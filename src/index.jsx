import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, Routes, Route, Link
} from 'react-router-dom';
import {Layout, Menu } from 'antd';

import List from './views/list';
import Input from './views/input';
import Analisis from './views/analisis';
import './index.css';
import styles from './index.module.css';

const { Header } = Layout;

const App = () => {

  const menu = [
    {
      key: 1,
      label: <Link to='/'>List</Link>,
    },
    {
      key: 2,
      label: <Link to='/input'>Input</Link>,
    },
    {
      key: 3,
      label: <Link to='/analisis'>Analisis</Link>,
    }
  ];

  return (
    <Layout className='h-screen overflow-hidden'>
      <div className={styles.container}>
        <BrowserRouter>
          <Header className='flex justify-between items-center'>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              items={menu}
              style={{ flex: 1, minWidth: 0 }}
            />
          </Header>
          <Routes>
            <Route path="/" element={<List />} />
            <Route path="/input" element={<Input />} />
            <Route path="/analisis" element={<Analisis />} />
          </Routes>
        </BrowserRouter>
      </div>
  </Layout>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
