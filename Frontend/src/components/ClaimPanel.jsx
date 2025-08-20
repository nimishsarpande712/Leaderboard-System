import React, { useState } from 'react';

export default function ClaimPanel({ users, selectedUser, setSelectedUser, onClaim, awarded, loading, onAddUser }) {
  const [newUser, setNewUser] = useState('');
  return (
    <div className="claim-root">
      <h2 className="panel-title">Claim Points</h2>
      <label className="field-label">Select User</label>
      <div className="select-wrapper">
        <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)} className="ui-select">
          <option value="">Choose user…</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.totalPoints})</option>)}
        </select>
        <span className="select-caret" aria-hidden>▾</span>
      </div>
      <button disabled={!selectedUser || loading} onClick={onClaim} className="btn-claim">
        {loading? 'Claiming…' : 'Claim Random Points'}
      </button>
      {awarded != null && <div className="award-banner">Awarded <strong>+{awarded}</strong> 🔥</div>}
      <div className="divider" />
      <label className="field-label">Add New User</label>
      <div className="add-user-row">
        <input className="ui-input" placeholder="New user name" value={newUser} onChange={e=>setNewUser(e.target.value)} />
        <button className="btn-secondary" onClick={()=>{ if(newUser.trim()){ onAddUser(newUser.trim()); setNewUser(''); } }}>Add</button>
      </div>
    </div>
  );
}
