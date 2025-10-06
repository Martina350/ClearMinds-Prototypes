import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('clearminds.db');

export function initDb() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS OTLocal (
      id TEXT PRIMARY KEY NOT NULL,
      estado TEXT NOT NULL,
      edificio TEXT,
      ventana TEXT,
      durEstimadaMin INTEGER,
      plantillaId TEXT,
      tecnicoId TEXT,
      planificada TEXT,
      minutosPendientes INTEGER,
      lat REAL,
      lon REAL,
      updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS EventoLocal (
      id TEXT PRIMARY KEY NOT NULL,
      otId TEXT NOT NULL,
      tipo TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      lat REAL,
      lon REAL,
      accuracy REAL,
      syncStatus TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ChecklistRespLocal (
      id TEXT PRIMARY KEY NOT NULL,
      otId TEXT NOT NULL,
      itemId TEXT NOT NULL,
      valor TEXT,
      observacion TEXT,
      fotoLocalUri TEXT,
      syncStatus TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS FirmaLocal (
      id TEXT PRIMARY KEY NOT NULL,
      otId TEXT NOT NULL,
      pngLocalUri TEXT NOT NULL,
      nombreFirmante TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      syncStatus TEXT NOT NULL
    );
  `);
}

export { db };


