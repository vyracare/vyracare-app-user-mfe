import { TestBed } from '@angular/core/testing';
import { AccessControlService } from './access-control.service';

describe('AccessControlService', () => {
  let service: AccessControlService;
  const token = (payload: object) => `x.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.y`;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(AccessControlService);
  });

  it('should recognize an administrator by access level', () => {
    localStorage.setItem('jwtToken', token({ access_level: 'Administrador' }));
    expect(service.isAdministrator()).toBe(true);
  });

  it('should recognize the standard role claim', () => {
    localStorage.setItem('jwtToken', token({ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Administrador' }));
    expect(service.isAdministrator()).toBe(true);
  });

  it('should deny missing, invalid and non-admin tokens', () => {
    expect(service.isAdministrator()).toBe(false);
    localStorage.setItem('jwtToken', 'invalid');
    expect(service.isAdministrator()).toBe(false);
    localStorage.setItem('jwtToken', token({ role: 'Operacional' }));
    expect(service.isAdministrator()).toBe(false);
  });
});
