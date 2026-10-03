import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  afterEach(() => localStorage.clear());

  it('should attach the JWT when available', done => {
    localStorage.setItem('jwtToken', 'token-value');
    authInterceptor(new HttpRequest('GET', '/api'), request => {
      expect(request.headers.get('Authorization')).toBe('Bearer token-value');
      return of(new HttpResponse());
    }).subscribe(() => done());
  });

  it('should preserve the request without a JWT', done => {
    authInterceptor(new HttpRequest('GET', '/api'), request => {
      expect(request.headers.has('Authorization')).toBe(false);
      return of(new HttpResponse());
    }).subscribe(() => done());
  });
});
