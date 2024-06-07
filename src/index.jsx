import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import {Button, Layout, Typography, message } from 'antd';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import authStorage from './utils/auth-storage';
import { jwtDecode } from "jwt-decode";

import Dashboard from './views/dashboard';
import Detail from './views/detail';
import './index.css';
import styles from './index.module.css';

const { Header, Footer } = Layout;
const { Title } = Typography;
const clientId = '87033689068-lg1s1dtiugu1vlldie9phimeq7of66t0.apps.googleusercontent.com';

const App = () => {
  const user = authStorage?.value ? jwtDecode(authStorage?.value) : {};

  useEffect(() => {
    const startGoogleAuth = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      });
    };

    gapi.load('client:auth2', startGoogleAuth);
  }, []);

  const onSuccessLogin = (res) => {
    authStorage.value = res?.tokenId;
    window.location.reload();
  };

  const onFailureLogin = () => {
    message.open({
      type: 'error',
      content: 'Login Failed!',
    });
  };

  const onSuccessLogout = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    
    if (auth2 != null) {
        auth2.signOut().then(
            auth2.disconnect().then(authStorage.destroy())
        );
        window.location.reload();
    } else {
      message.open({
        type: 'error',
        content: 'Logout Failed!',
      });
    };
  };

  return (
    <Layout className='h-screen overflow-hidden'>
      <Header className='flex justify-between items-center'>
        <Title level={2} className='m-0 text-white font-extralight'><b>GitHub</b> Jobs</Title>
        <div className='flex'>
          {
            !authStorage?.value &&
            <GoogleLogin
              className={styles.login} 
              clientId={clientId}
              buttonText='Login with Google'
              cookiePolicy={'single_host_origin'}
              onSuccess={onSuccessLogin}
              onFailure={onFailureLogin}
              isSignedIn={true}
            />
          }
          {
            authStorage?.value && 
            <div className='flex items-center'>
              <Title className='m-0 text-white' level={4}>Hallo, {user?.name}</Title>
              <GoogleLogout
                className='hidden'
                clientId={clientId}
                buttonText='Logout'
                onLogoutSuccess={onSuccessLogout}
              />
              <Button className='ml-4' onClick={onSuccessLogout}>Logout</Button>
            </div>
          }
        </div>
      </Header>
      <div className={styles.container}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/:id" element={<Detail />} />
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
