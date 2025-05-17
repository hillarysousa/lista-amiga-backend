import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const configPath = process.env.FIREBASE_CONFIG_PATH;

if (!configPath) {
  throw new Error('FIREBASE_CONFIG_PATH is not defined in .env');
}

const serviceAccountPath = path.resolve(process.cwd(), configPath);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  getAuth() {
    return admin.auth(this.firebaseApp);
  }
}
