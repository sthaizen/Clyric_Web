import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { ENV } from './src/lib/env.js';
import User from './src/models/User.js';
import Session from './src/models/Session.js';

const run = async () => {
  await mongoose.connect(process.env.DB_URL);
  console.log("Connected");
  
  // Find the most recently active user
  const user = await User.findOne({}).sort({ updatedAt: -1 });
  if (!user) { console.log('no user'); process.exit(0); }
  
  const userId = user._id;
  console.log("User ID:", userId);
  
  const sessions = await Session.find({
    $or: [{ host: userId }, { participant: userId }]
  }).lean();
  
  console.log("Sessions found:", sessions.length);
  
  const peersMap = new Map();
  for (const session of sessions) {
    const isHost = session.host?.toString() === userId.toString();
    const peerId = isHost ? session.participant : session.host;
    if (!peerId) continue;
    
    peersMap.set(peerId.toString(), peerId);
  }
  
  const peerIds = Array.from(peersMap.values());
  console.log("Unique peer IDs:", peerIds.length);
  
  const peers = await User.find({ _id: { $in: peerIds } }).lean();
  console.log("Resolved Peer Users:", peers.map(p => p.nickname || p.name));
  
  process.exit(0);
};

run().catch(console.error);
