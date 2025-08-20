import React, { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { api, SOCKET_ORIGIN } from './lib/api.js';
import Leaderboard from './components/Leaderboard.jsx';
import ClaimPanel from './components/ClaimPanel.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import './styles.css';

// Base API paths now derive from api.base and expect explicit /api prefix in calls
const socket = io(SOCKET_ORIGIN);

export default function App() {
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [awarded, setAwarded] = useState(null);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const initialPrimary = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || localStorage.getItem('primaryTab') || 'live';
  };
  const initialSub = () => localStorage.getItem('subTab') || 'contribution';
  const [primaryTab, setPrimaryTab] = useState(initialPrimary); // live | party | hourly | family | wealth
  const [subTab, setSubTab] = useState(initialSub); // contribution | tasks
  const [settlementText, setSettlementText] = useState('');

  const fetchUsers = useCallback(async () => {
  const data = await api.get('/api/users');
  setUsers(data);
  if (!selectedUser && data.length) setSelectedUser(data[0]._id);
  }, [selectedUser]);

  const fetchLeaderboard = useCallback(async () => {
  const data = await api.get('/api/users/leaderboard/list');
  setLeaderboard(data);
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
  const res = await api.post(`/api/users/${selectedUser}/claim`);
  setAwarded(res.awarded);
      fetchUsers(); // update totals maybe
    } catch (e) {
  alert(e.message);
    } finally { setLoadingClaim(false); }
  }

  async function handleAddUser(name) {
    if(!name) return;
    try {
  await api.post(`/api/users`, { name });
      fetchUsers();
    } catch (e) {
  alert(e.message);
    }
  }

  // compute settlement timers (mock): live -> 2 days, party weekly -> 2 days, etc.
  function getSettlementText() {
    const now = Date.now();
    let end; // pick 2 days from now for demo
    end = now + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 1 + 1000 * 60 * 45; // 2d 1h45m
    const diff = end - now;
    const d = Math.floor(diff / (24*3600*1000));
    const h = Math.floor((diff % (24*3600*1000)) / (3600*1000));
    const m = Math.floor((diff % (3600*1000)) / (60*1000));
    const s = Math.floor((diff % (60*1000)) / 1000);
    return `${d} days ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  useEffect(() => {
    const update = () => setSettlementText(getSettlementText());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // persist tab state
  useEffect(() => {
    localStorage.setItem('primaryTab', primaryTab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', primaryTab);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', url);
  }, [primaryTab]);
  useEffect(() => { localStorage.setItem('subTab', subTab); }, [subTab]);

  const themeClass = `app-shell theme-${primaryTab}`;

  return (
    <div className={themeClass}>
      {/* Sticky Header / Timer Bar */}
      <header className="top-header">
        <div className="brand-area">
          <span className="brand-accent">⚡</span>
          <span className="brand-title">Hourly Ranking</span>
        </div>
        <div className="header-spacer" />
        <div className="timer-pill" aria-label="settlement timer">
          <span className="timer-label">Settlement</span>
          <span className="timer-value">{settlementText}</span>
        </div>
      </header>

      {/* Primary Tabs (optional ranking types) */}
      <nav className="primary-tabs">
        {['party','live','hourly','family','wealth'].map(tab => (
          <button key={tab} className={"primary-tab" + (primaryTab===tab? ' active':'')} onClick={()=>setPrimaryTab(tab)}>
            {tab.charAt(0).toUpperCase()+tab.slice(1)}
          </button>
        ))}
      </nav>

      <div className="subtab-bar">
        <div className="subtabs">
          <button className={subTab==='contribution'? 'subtab active':'subtab'} onClick={()=>setSubTab('contribution')}>Contribution</button>
          <button className={subTab==='tasks'? 'subtab active':'subtab'} onClick={()=>setSubTab('tasks')}>Tasks</button>
        </div>
        <div className="rewards-btn" role="button">Rewards</div>
      </div>

      <main className="grid-layout">
        <section className="panel leaderboard-panel" data-section="leaderboard">
          <Leaderboard data={leaderboard} currentUserId={selectedUser} />
        </section>
        <section className="panel claim-panel" data-section="claim">
          <ClaimPanel users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} onClaim={handleClaim} awarded={awarded} loading={loadingClaim} onAddUser={handleAddUser} />
        </section>
        <section className="panel history-panel" data-section="history">
          <HistoryPanel />
        </section>
      </main>
      <footer className="app-footer">Leaderboard System Demo</footer>
    </div>
  );
}
