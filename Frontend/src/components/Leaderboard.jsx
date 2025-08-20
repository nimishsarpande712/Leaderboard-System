import React from 'react';

export default function Leaderboard({ data }) {
  return (
    <div>
      <h2 style={{ margin:'0 0 .5rem', fontSize:18 }}>Leaderboard</h2>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ textAlign:'left', background:'#f2f4f8' }}>
            <th style={th}>Rank</th>
            <th style={th}>User</th>
            <th style={th}>Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row._id} style={{ borderBottom:'1px solid #eee' }}>
              <td style={td}>{row.rank}</td>
              <td style={td}>{row.name}</td>
              <td style={{ ...td, fontWeight:600 }}>{row.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div style={{ padding:'0.5rem', color:'#777' }}>No data</div>}
    </div>
  );
}

const th = { padding:'8px 10px', fontSize:13, fontWeight:600 };
const td = { padding:'6px 10px', fontSize:14 };
