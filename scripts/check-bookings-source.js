/**
 * Script to check booking sources in Firebase
 * Run with: node scripts/check-bookings-source.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkBookingSources() {
  try {
    console.log('🔍 Checking booking sources in Firebase...\n');
    
    const bookingsSnapshot = await db.collection('bookings').get();
    
    console.log(`📊 Total bookings: ${bookingsSnapshot.size}\n`);
    
    const sources = {};
    const noSource = [];
    
    bookingsSnapshot.forEach(doc => {
      const data = doc.data();
      const source = data.source || 'no-source';
      
      if (!sources[source]) {
        sources[source] = [];
      }
      
      sources[source].push({
        id: doc.id,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        firstName: data.firstName,
        lastName: data.lastName,
        externalId: data.externalId || 'none'
      });
      
      if (!data.source) {
        noSource.push(doc.id);
      }
    });
    
    console.log('📈 Bookings by source:');
    Object.keys(sources).forEach(source => {
      console.log(`  ${source}: ${sources[source].length} bookings`);
    });
    
    console.log('\n📋 Detailed breakdown:\n');
    
    Object.keys(sources).forEach(source => {
      console.log(`\n${source.toUpperCase()} (${sources[source].length} bookings):`);
      sources[source].forEach((booking, index) => {
        if (index < 3) { // Show first 3 of each source
          console.log(`  - ${booking.checkIn} to ${booking.checkOut}: ${booking.firstName} ${booking.lastName}`);
          console.log(`    ID: ${booking.id}, External ID: ${booking.externalId}`);
        }
      });
      if (sources[source].length > 3) {
        console.log(`  ... and ${sources[source].length - 3} more`);
      }
    });
    
    if (noSource.length > 0) {
      console.log('\n⚠️  Bookings without source field:');
      console.log(`   ${noSource.length} bookings need to be updated`);
      console.log(`   These will be treated as "web" bookings by default`);
    }
    
    console.log('\n✅ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkBookingSources();

