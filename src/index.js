import pool from './db.js';

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Verbindung erfolgreich:', res.rows[0]);
  } catch (err) {
    console.error('Fehler bei der Verbindung:', err);
  }
}

testConnection();