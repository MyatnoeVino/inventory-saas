import { useState } from 'react';
import { pb } from '../lib/pocketbase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await pb.collection('users').authWithPassword(email, password);
      window.location.href = '/devices';
    } catch (e) {
      setError('Неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-12 flex flex-col md:flex-row items-center">
        {/* Левая часть с изображением или логотипом */}
        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <div className="h-24 w-24 md:h-32 md:w-32 bg-gradient-to-tr from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105">
            {/* Можно вставить иконку или логотип сюда */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="#3b82f6" fill="none" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
            </svg>
          </div>
        </div>

        {/* Правая часть с формой */}
        <div className="md:w-1/2 w-full px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Добро пожаловать</h2>
          <p className="text-gray-600 mb-8 text-center">Введите свои данные для входа</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-gray-900 sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-gray-900 sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold rounded-2xl transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Войти'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
