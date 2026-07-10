import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ResetPassword(){
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(password.length < 6){ setStatus('Password must be at least 6 characters'); return; }
    if(password !== confirm){ setStatus('Passwords do not match'); return; }
    setLoading(true); setStatus(null);
    try{
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if(res.ok){
        setStatus('Password reset successful — redirecting to login...');
        setTimeout(()=> navigate('/login'), 1800);
      } else {
        setStatus(data.message || 'Reset failed');
      }
    }catch(err){
      setStatus('Server error');
    }finally{ setLoading(false); }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 260, minHeight: '100vh', backgroundColor: '#1e1e2f', color:'#fff', padding:20, position:'fixed' }}>
        <h2 style={{ marginBottom: 30, fontSize:22 }}>📘 E-Learning Portal</h2>
      </div>

      <div style={{ marginLeft: 260, width: '100%' }}>
        <div className="container mt-5" style={{ maxWidth: 450 }}>
          <h2 className="text-center fw-bold mb-4">Set New Password</h2>
          <form className="shadow p-4 rounded" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>New password</label>
              <input type="password" className="form-control" required value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label>Confirm password</label>
              <input type="password" className="form-control" required value={confirm} onChange={e=>setConfirm(e.target.value)} />
            </div>
            <button className="btn btn-primary w-100" disabled={loading}>{loading? 'Saving...' : 'Save Password'}</button>
            {status && <div className="mt-3 alert alert-info">{status}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
