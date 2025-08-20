import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  async function load(p = 1) {
    const res = await axios.get(`${API_BASE}/users/history?page=${p}&limit=${limit}`);
    setHistory(res.data.items);
    setTotal(res.data.total);
    setPage(res.data.page);
  }

  useEffect(()=> { load(1); },[]);

  const pages = Math.ceil(total/limit) || 1;

  return (
    <div>
      <h2 style={{ margin:'0 0 .5rem', fontSize:18 }}>Claim History</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {history.map(item => (
          <div key={item._id} style={row}>
            <span style={{ fontWeight:500 }}>{item.user?.name || 'Unknown'}</span>
            <span style={{ fontWeight:600, color:'#ff7300' }}>+{item.points}</span>
            <span style={{ fontSize:12, color:'#666' }}>{new Date(item.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
        {history.length === 0 && <div style={{ color:'#777', fontSize:13 }}>No history yet</div>}
      </div>
      <div style={{ display:'flex', gap:8, marginTop:12 }}>
        <button disabled={page<=1} onClick={()=>load(page-1)} style={pagerBtn}>Prev</button>
        <div style={{ fontSize:13, alignSelf:'center' }}>Page {page}/{pages}</div>
        <button disabled={page>=pages} onClick={()=>load(page+1)} style={pagerBtn}>Next</button>
      </div>
    </div>
  );
}

const row = { display:'grid', gridTemplateColumns:'1fr auto auto', alignItems:'center', background:'#f7f9fc', padding:'8px 10px', borderRadius:8 };
const pagerBtn = { padding:'6px 12px', border:'1px solid #d0d7e2', background:'#fff', borderRadius:6, cursor:'pointer' };
