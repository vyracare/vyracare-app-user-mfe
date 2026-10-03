import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccessControlService {
  isAdministrator(): boolean {
    const payload = this.readPayload();
    const accessLevel = payload?.['access_level']
      ?? payload?.['role']
      ?? payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return typeof accessLevel === 'string' && accessLevel.toLocaleLowerCase('pt-BR') === 'administrador';
  }

  private readPayload(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;
    const token = window.localStorage.getItem('jwtToken');
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')));
    } catch {
      return null;
    }
  }
}
