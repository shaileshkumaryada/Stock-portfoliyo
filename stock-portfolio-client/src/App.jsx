import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState({ symbol: '', shares: '', purchasePrice: '', purchaseDate: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [loadingStocks, setLoadingStocks] = useState(false);

  useEffect(() => {
    if (isLoggedIn) loadStocks();
  }, [isLoggedIn]);

  const loadStocks = async () => {
    setLoadingStocks(true);
    try {
      const res = await axios.get(`${API_URL}/stocks`, { headers: { Authorization: `Bearer ${token}` } });
      setStocks(res.data);
    } catch (err) {
      alert('Error fetching stocks');
    }
    setLoadingStocks(false);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, loginForm);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      alert('Login Failed');
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API_URL}/register`, registerForm);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      alert('Registration Failed');
    }
  };

  const handleAddStock = async () => {
  try {
    await axios.post(`${API_URL}/stocks`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({ symbol: '', shares: '', purchasePrice: '', purchaseDate: '' });
    loadStocks();
  } catch (err) {
    alert('Failed to add stock');
  }
};

  const handleDeleteStock = async (id) => {
    try {
      await axios.delete(`${API_URL}/stocks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      loadStocks();
    } catch (err) {
      alert('Failed to delete stock');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2"
          value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-2"
          value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-6">Login</button>

        <h1 className="text-2xl font-bold mb-4">Or Register</h1>
        <input type="text" placeholder="Username" className="border p-2 w-full mb-2"
          value={registerForm.username} onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })} />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2"
          value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-2"
          value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
        <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded w-full">Register</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Stock Portfolio</h1>

      <div className="mb-6">
        <input type="text" placeholder="Symbol" className="border p-2 mr-2"
          value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value.toUpperCase() })} />
        <input type="number" placeholder="Shares" className="border p-2 mr-2"
          value={form.shares} onChange={e => setForm({ ...form, shares: e.target.value })} />
        <input type="number" step="0.01" placeholder="Purchase Price" className="border p-2 mr-2"
          value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: e.target.value })} />
        <input type="date" className="border p-2 mr-2"
          value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} />
        <button onClick={handleAddStock} className="bg-blue-600 text-white px-4 py-2 rounded">Add Stock</button>
      </div>

      {loadingStocks ? <p>Loading stocks...</p> :
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Symbol</th>
              <th className="border border-gray-300 p-2">Shares</th>
              <th className="border border-gray-300 p-2">Purchase Price</th>
              <th className="border border-gray-300 p-2">Purchase Date</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock._id} className="text-center">
                <td className="border border-gray-300 p-2">{stock.symbol}</td>
                <td className="border border-gray-300 p-2">{stock.shares}</td>
                <td className="border border-gray-300 p-2">${stock.purchasePrice.toFixed(2)}</td>
                <td className="border border-gray-300 p-2">{new Date(stock.purchaseDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => handleDeleteStock(stock._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
            {stocks.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4">No stocks in portfolio.</td>
              </tr>
            )}
          </tbody>
        </table>
      }
      <button onClick={() => { setToken(''); localStorage.removeItem('token'); setIsLoggedIn(false); }}
        className="mt-6 bg-gray-600 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
}

export default App;
