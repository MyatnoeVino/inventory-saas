import { useState } from 'react';
import { pb } from '../lib/pocketbase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      window.location.href = '/devices';
    } catch (e) {
      alert('Ошибка логина');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}