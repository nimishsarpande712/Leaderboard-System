import React, { useState } from 'react';

export default function ClaimPanel({ users, selectedUser, setSelectedUser, onClaim, awarded, loading, onAddUser }) {
  const [newUser, setNewUser] = useState('');
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
      <h2 style={{ margin:'0 0 .25rem', fontSize:18 }}>Claim Points</h2>
      <label style={{ fontSize:13, fontWeight:500 }}>Select User</label>
      <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)} style={inputStyle}>
        <option value="">-- choose user --</option>
        {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.totalPoints})</option>)}
      </select>
      <button disabled={!selectedUser || loading} onClick={onClaim} style={btnPrimary}>{loading? 'Claiming...' : 'Claim Random Points'}</button>
      {awarded != null && <div style={{ fontSize:14 }}>Awarded: <strong>{awarded}</strong> points</div>}
      <div style={{ marginTop:'1rem', borderTop:'1px solid #eee', paddingTop:'1rem', display:'flex', flexDirection:'column', gap:'.5rem' }}>
        <label style={{ fontSize:13, fontWeight:500 }}>Add New User</label>
        <div style={{ display:'flex', gap:8 }}>
          <input style={{ ...inputStyle, flex:1 }} placeholder="New user name" value={newUser} onChange={e=>setNewUser(e.target.value)} />
          <button style={btnSecondary} onClick={()=>{ onAddUser(newUser.trim()); setNewUser(''); }}>Add</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding:'10px 12px', border:'1px solid #d0d7e2', borderRadius:8, fontSize:14 };
const btnPrimary = { padding:'10px 14px', background:'#ffb400', color:'#222', fontWeight:600, border:'none', borderRadius:8, cursor:'pointer' };
const btnSecondary = { padding:'10px 14px', background:'#e0e7ef', color:'#222', fontWeight:600, border:'none', borderRadius:8, cursor:'pointer' };
