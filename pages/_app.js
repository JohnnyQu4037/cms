import '../styles/globals.css'
import 'antd/dist/antd.css';
import ManagerLayout from '../components/layout';

function MyApp({ Component, pageProps,router }) {
  if (router.pathname.startsWith('/dashboard/manager')) {
    return (
      <ManagerLayout>
        <Component {...pageProps} />
      </ManagerLayout>
    )
  }
  
  return <Component {...pageProps} />
}

export default MyApp
