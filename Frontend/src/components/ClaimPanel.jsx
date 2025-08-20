import React, { useState, useMemo } from 'react';
import Dropdown from './Dropdown.jsx';

export default function ClaimPanel({ users, selectedUser, setSelectedUser, onClaim, awarded, loading, onAddUser }) {
  const [newUser, setNewUser] = useState('');
  return (
    <div className="claim-root">
      <h2 className="panel-title">Claim Points</h2>
      <label className="field-label">Select User</label>
      <Dropdown
        value={selectedUser}
        onChange={setSelectedUser}
        placeholder="Choose user…"
        options={useMemo(()=> users.map(u => ({ value:u._id, label:u.name, meta:u.totalPoints })), [users])}
        labelExtractor={(o)=> `${o.label} (${o.meta})`}
      />
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
