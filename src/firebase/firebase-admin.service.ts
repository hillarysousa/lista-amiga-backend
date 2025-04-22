import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

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
