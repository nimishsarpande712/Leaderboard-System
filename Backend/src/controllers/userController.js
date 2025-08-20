import { User } from '../models/User.js';
import { ClaimHistory } from '../models/ClaimHistory.js';

export async function seedUsers(req, res) {
  try {
    const existing = await User.countDocuments();
    if (existing >= 10) return res.json({ message: 'Already seeded', count: existing });
    const names = ['Rahul','Kamal','Sanak','Pooja','Rita','Ali','John','Meera','Vikas','Sara'];
    const docs = await User.insertMany(names.map(name => ({ name })));
    res.json({ message: 'Seeded', users: docs });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function addUser(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const user = await User.create({ name });
    res.status(201).json(user);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: 'Name already exists' });
    res.status(500).json({ error: e.message });
  }
}

export async function listUsers(req, res) {
  const users = await User.find().sort({ name: 1 });
  res.json(users);
}

export async function claimPoints(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const points = Math.floor(Math.random() * 10) + 1; // 1-10
    user.totalPoints += points;
    await user.save();
    const hist = await ClaimHistory.create({ user: user._id, points });

    res.json({ user, awarded: points, historyId: hist._id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function leaderboard(req, res) {
  const users = await User.find().sort({ totalPoints: -1, updatedAt: 1 });
  const data = users.map((u, idx) => ({
    _id: u._id,
    name: u.name,
    totalPoints: u.totalPoints,
    rank: idx + 1
  }));
  res.json(data);
}

export async function claimHistory(req, res) {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    ClaimHistory.find().sort({ createdAt: -1 }).skip(Number(skip)).limit(Number(limit)).populate('user','name'),
    ClaimHistory.countDocuments()
  ]);
  res.json({ page: Number(page), limit: Number(limit), total, items });
}
