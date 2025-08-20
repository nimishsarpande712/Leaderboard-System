import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  async function load(p = 1) {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users/history?page=${p}&limit=${limit}`);
      setHistory(res.data.items);
      setTotal(res.data.total);
      setPage(res.data.page);
    } finally { setLoading(false); }
  }

  useEffect(()=> { load(1); },[]);

  const pages = Math.ceil(total/limit) || 1;

  return (
    <div className="history-root">
      <h2 className="panel-title">Claim History</h2>
      <div className="history-scroll" data-loading={loading || undefined}>
        {history.map((item, idx) => (
          <div key={item._id} className="history-row" style={{ '--i': idx }}>
            <span className="h-user" title={item.user?.name}>{item.user?.name || 'Unknown'}</span>
            <span className="h-points positive">+{item.points}</span>
            <span className="h-time">{new Date(item.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
        {history.length === 0 && !loading && <div className="history-empty">No history yet</div>}
      </div>
      <div className="pager">
        <button disabled={page<=1 || loading} onClick={()=>load(page-1)} className="pager-btn">Prev</button>
        <div className="pager-status">Page {page}/{pages}</div>
        <button disabled={page>=pages || loading} onClick={()=>load(page+1)} className="pager-btn">Next</button>
      </div>
    </div>
  );
}
