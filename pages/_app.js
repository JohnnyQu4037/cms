import '../styles/globals.css'
import 'antd/dist/antd.css';
import AppLayout from '../components/layout';
import { Spin } from 'antd';

function MyApp({ Component, pageProps,router }) {
  if (router.pathname.startsWith('/dashboard/manager')) {
    return (
      <AppLayout>
        <Component {...pageProps} ><Spin/></Component>
        
      </AppLayout>
    )
  }
  
  return <Component {...pageProps} />
}

export default MyApp
