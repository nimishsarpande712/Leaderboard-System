import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Leaderboard from './components/Leaderboard.jsx';
import ClaimPanel from './components/ClaimPanel.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const socket = io(API_BASE.replace('/api',''));

export default function App() {
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [awarded, setAwarded] = useState(null);
  const [loadingClaim, setLoadingClaim] = useState(false);

  const fetchUsers = useCallback(async () => {
    const res = await axios.get(`${API_BASE}/users`);
    setUsers(res.data);
    if (!selectedUser && res.data.length) setSelectedUser(res.data[0]._id);
  }, [selectedUser]);

  const fetchLeaderboard = useCallback(async () => {
    const res = await axios.get(`${API_BASE}/users/leaderboard/list`);
    setLeaderboard(res.data);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
  }, [fetchUsers, fetchLeaderboard]);

  useEffect(() => {
    socket.on('leaderboard', (data) => {
      setLeaderboard(data);
    });
    return () => { socket.off('leaderboard'); };
  }, []);

  async function handleClaim() {
    if(!selectedUser) return;
    setLoadingClaim(true);
    setAwarded(null);
    try {
      const res = await axios.post(`${API_BASE}/users/${selectedUser}/claim`);
      setAwarded(res.data.awarded);
      fetchUsers(); // update totals maybe
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    } finally { setLoadingClaim(false); }
  }

  async function handleAddUser(name) {
    if(!name) return;
    try {
      await axios.post(`${API_BASE}/users`, { name });
      fetchUsers();
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
      <header style={{ padding:'1rem 1.5rem', background:'#fff', boxShadow:'0 2px 4px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'1rem' }}>
        <h1 style={{ fontSize:20, margin:0 }}>Live Ranking</h1>
      </header>
      <main style={{ display:'grid', gap:'1.5rem', padding:'1.5rem', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', flex:1 }}>
        <section style={{ background:'#fff', borderRadius:16, padding:'1rem 1.25rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
          <ClaimPanel users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} onClaim={handleClaim} awarded={awarded} loading={loadingClaim} onAddUser={handleAddUser} />
        </section>
        <section style={{ background:'#fff', borderRadius:16, padding:'1rem 1.25rem', display:'flex', flexDirection:'column', gap:'1rem', maxHeight:'70vh', overflow:'auto' }}>
          <Leaderboard data={leaderboard} />
        </section>
        <section style={{ background:'#fff', borderRadius:16, padding:'1rem 1.25rem', display:'flex', flexDirection:'column', gap:'1rem', maxHeight:'70vh', overflow:'auto' }}>
          <HistoryPanel />
        </section>
      </main>
      <footer style={{ textAlign:'center', padding:'0.75rem', fontSize:12, color:'#666' }}>Leaderboard System Demo</footer>
    </div>
  );
}
