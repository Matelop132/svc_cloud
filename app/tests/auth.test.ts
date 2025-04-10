// tests/auth.test.ts

import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '@/'; // Import de ton application

let token: string; // Pour stocker le token JWT après la connexion

describe('Auth API', () => {
  // Avant tous les tests, créer un utilisateur ou réinitialiser l'état de la base de données
  beforeAll(async () => {
    // Si tu utilises un modèle d'utilisateur, tu peux ajouter un utilisateur ici
    const res = await request(app)
      .post('/api/auth')
      .send({ action: 'register', email: 'test@test.com', password: '123456' });
    
    expect(res.status).toBe(201);
  });

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({ action: 'register', email: 'test2@test.com', password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should login a user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({ action: 'login', email: 'test@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token; // On stocke le token pour les tests suivants
  });

  it('should access a protected route with a valid token', async () => {
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Protected route accessed');
  });

  it('should return 401 for an invalid token', async () => {
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid token');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/protected');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided');
  });

  // Nettoyer après tous les tests si nécessaire (ex: supprimer l'utilisateur créé)
  afterAll(async () => {
    // Code pour nettoyer les utilisateurs, etc. (optionnel)
  });
});
