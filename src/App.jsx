import Login from './pages/Login';
import Devices from './pages/Devices';

export default function App() {
  const path = window.location.pathname;

  if (path === '/devices') return <Devices />;
  return <Login />;
}