import * as dotenv from 'dotenv';

export function initializeEnv(): void {
  try {
    dotenv.config();
  } catch (e) {
    console.log('Usando variáveis de ambiente do sistema');
  }
}
