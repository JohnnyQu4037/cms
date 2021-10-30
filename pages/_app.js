import '../styles/globals.css'
import 'antd/dist/antd.css';
import ManagerLayout from '../components/layout';
import { Spin } from 'antd';

function MyApp({ Component, pageProps,router }) {
  if (router.pathname.startsWith('/dashboard/manager')) {
    return (
      <ManagerLayout>
        <Component {...pageProps} ><Spin/></Component>
        
      </ManagerLayout>
    )
  }
  
  return <Component {...pageProps} />
}

export default MyApp
