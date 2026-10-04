import { TestBed } from '@angular/core/testing';
import type { AuthUser } from '../auth/auth-user';
import { AuthSessionService } from './auth-session.service';

describe('AuthSessionService', () => {
  const user: AuthUser = {
    _id: 'user-id',
    firstName: 'Elevate',
    lastName: 'Tech',
    email: 'user@example.com',
    gender: 'male',
    height: 170,
    weight: 70,
    age: 30,
    goal: 'Gain weight',
    activityLevel: 'level1',
  };

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('stores the token and user in local storage', () => {
    const session = TestBed.inject(AuthSessionService);

    session.setToken('test-token');
    session.setUser(user);

    expect(session.token()).toBe('test-token');
    expect(session.user()).toEqual(user);
    expect(localStorage.getItem('access_token')).toBe('test-token');
    expect(JSON.parse(localStorage.getItem('auth_user') ?? 'null')).toEqual(user);
  });

  it('restores a stored session', () => {
    localStorage.setItem('access_token', 'stored-token');
    localStorage.setItem('auth_user', JSON.stringify(user));

    const session = TestBed.inject(AuthSessionService);

    expect(session.token()).toBe('stored-token');
    expect(session.user()).toEqual(user);
    expect(session.isAuthenticated()).toBe(true);
  });

  it('clears the complete session', () => {
    const session = TestBed.inject(AuthSessionService);
    session.setToken('test-token');
    session.setUser(user);

    session.clearSession();

    expect(session.token()).toBeNull();
    expect(session.user()).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });
});
