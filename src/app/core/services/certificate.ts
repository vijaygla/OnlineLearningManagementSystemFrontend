import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Certificate, IssueCertificateRequest, CertificateVerificationResponse } from '../models/certificate.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/certificates`;

  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/student`);
  }

  getCertificateById(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${id}`);
  }

  issueCertificate(request: IssueCertificateRequest): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.apiUrl}/issue`, request);
  }

  downloadCertificate(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  verifyCertificate(number: string): Observable<CertificateVerificationResponse> {
    return this.http.get<CertificateVerificationResponse>(`${this.apiUrl}/verify/${number}`);
  }
}
