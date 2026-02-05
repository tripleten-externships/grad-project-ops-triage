import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RequestModel from '../models/Request';
import UserModel from '../models/User';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Database Seeding Script
 * Loads mock data from contracts/mock-data/ into MongoDB
 */

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grad-project';

async function loadMockData() {
  const contractsPath = path.join(__dirname, '../../../../contracts/mock-data');
  
  // Load requests
  const requestsPath = path.join(contractsPath, 'requests.json');
  const requestsData = JSON.parse(fs.readFileSync(requestsPath, 'utf-8'));
  
  // Load users
  const usersPath = path.join(contractsPath, 'users.json');
  const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  
  return { requests: requestsData, users: usersData };
}

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await RequestModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log('✓ Cleared existing data');
    
    // Load mock data
    console.log('Loading mock data from contracts...');
    const { requests, users } = await loadMockData();
    
    // Insert requests
    console.log(`Inserting ${requests.length} requests...`);
    await RequestModel.insertMany(requests);
    console.log(`✓ Inserted ${requests.length} requests`);
    
    // Insert users
    console.log(`Inserting ${users.length} users...`);
    await UserModel.insertMany(users);
    console.log(`✓ Inserted ${users.length} users`);
    
    console.log('\n✅ Database seeded successfully!');
    
    // Display summary
    const stats = {
      totalRequests: await RequestModel.countDocuments(),
      byStatus: await RequestModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      byPriority: await RequestModel.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    };
    
    console.log('\nDatabase Summary:');
    console.log(`Total Requests: ${stats.totalRequests}`);
    console.log('\nBy Status:');
    stats.byStatus.forEach((s: any) => console.log(`  ${s._id}: ${s.count}`));
    console.log('\nBy Priority:');
    stats.byPriority.forEach((p: any) => console.log(`  ${p._id}: ${p.count}`));
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Connection closed');
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
