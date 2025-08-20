import React from 'react';
import { TrophyIcon, FlameIcon } from './Icons.jsx';

export default function Leaderboard({ data, currentUserId }) {
  const top3 = data.slice(0,3);
  const rest = data.slice(3);
  const current = data.find(u => u._id === currentUserId);
  return (
    <div className="leaderboard-root">
      <h2 className="panel-title">Leaderboard</h2>
      <div className="leaderboard-podium" aria-label="top three players">
        <PodiumSlot place={2} user={top3[1]} variant="second" />
        <PodiumSlot place={1} user={top3[0]} variant="first" />
        <PodiumSlot place={3} user={top3[2]} variant="third" />
      </div>
      <div className="rank-list" aria-label="ranked players">
        {data.length === 0 && <div className="empty">No data</div>}
        {rest.map((r) => (
          <div key={r._id} className={`rank-row rank-${r.rank}`}>
            <div className="place-badge" data-rank={r.rank}>{r.rank}</div>
            <div className="avatar-col"><GeneratedAvatar name={r.name} /></div>
            <div className="username" title={r.name}>{r.name}</div>
            <div className="points"><FlameIcon size={14}/> {r.totalPoints}</div>
          </div>
        ))}
      </div>
      <div className="current-user-bar" aria-label="current user position">
        <div className="current-rank">{current? current.rank : '—'}</div>
        <div className="current-avatar-wrapper">
          {current ? <GeneratedAvatar name={current.name} /> : <div className="avatar generated" style={{ width:32,height:32,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center' }}>?</div>}
        </div>
        <div className="current-name" title={current?.name}>{current ? current.name : 'You'}</div>
        <div className="current-points"><FlameIcon size={14}/> {current? current.totalPoints : 0}</div>
      </div>
    </div>
  );
}

function PodiumCard({ place, user, variant }) {
  return (
    <div className={`podium-card ${variant}`}>
      <div className="podium-rank" data-rank={place}>{place === 1 && <span className="crown" aria-hidden>👑</span>}<span className="rank-number">{place}</span></div>
      <GeneratedAvatar name={user.name} />
      <div className="podium-name" title={user.name}>{user.name}</div>
      <div className="podium-points">{user.totalPoints}</div>
    </div>
  );
}

function PodiumPlaceholder({ place, variant }) {
  return (
  <div className={`podium-card ${variant} placeholder`}>
      <div className="podium-rank">{place}</div>
      <div className="avatar generated" aria-label="placeholder">?</div>
      <div className="podium-name">Waiting</div>
      <div className="podium-points">0</div>
    </div>
  );
}

function PodiumSlot({ place, user, variant }) {
  if (!user) return <PodiumPlaceholder place={place} variant={variant} />;
  return <PodiumCard place={place} user={user} variant={variant} />;
}

function GeneratedAvatar({ name }) {
  const letter = name?.charAt(0)?.toUpperCase() || '?';
  const hue = (letter.charCodeAt(0) * 37) % 360;
  const bg = `hsl(${hue} 80% 85%)`;
  const fg = `hsl(${hue} 45% 30%)`;
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect rx='32' ry='32' width='64' height='64' fill='${bg}'/><text x='50%' y='54%' font-family='Arial,Helvetica,sans-serif' font-size='32' font-weight='700' fill='${fg}' dominant-baseline='middle' text-anchor='middle'>${letter}</text></svg>`);
  const url = `data:image/svg+xml,${svg}`;
  return <img className="avatar" src={url} alt={name} />;
}
