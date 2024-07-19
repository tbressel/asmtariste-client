///////////////////////////////////////////////////////
////////////////////  IMPORTATIONS   //////////////////
///////////////////////////////////////////////////////

// Modules
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Decorator
import { Injectable } from '@angular/core';

// Type model for async data
import { Observable } from 'rxjs';

// Models
import { CertificatesListModel } from '../models/certificate.models';


// Configuration
import { CONFIG } from '../../config';

interface GetCertificate {
  token: string;
}
interface CreateCertificate {
  id: number;
  certificate: boolean;
}
interface ViewCertificate {
  id: number | null;
  token: string;
}


// Decorator to inject the service in all components that need it
@Injectable({
  providedIn: 'root',
})


export class CertificateService {


      // Constructor to inject the HttpClient
  constructor(private http: HttpClient) {}





  createCertificate(id: number, certificate: boolean, note: number, token: string): Observable<CreateCertificate> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }
    return this.http.post<CreateCertificate>(`${CONFIG.baseUrl}/create-certificate/${id}`, {certificate, note}, httpOptions);
  }
  



    /**
   * 
   * Method used to fetch the data menu
   */
    getCertificates(token: string): Observable<GetCertificate[]> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      }
        return this.http.get<GetCertificate[]>(`${CONFIG.baseUrl}/get-certificates/`, httpOptions);
      }


    /**
   * 
   * Method used to fetch the data menu
   */
    viewCertificate(id: number, token: string): Observable<ViewCertificate[]> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      }
        return this.http.get<ViewCertificate[]>(`${CONFIG.baseUrl}/view-certificate/${id}`, httpOptions);
      }

      /**
 * 
 * Get the list of all certificate for all users
 * 
 * @param token 
 * @returns 
 */
      getAll(): Observable<CertificatesListModel[]> {
       
        return this.http.get<CertificatesListModel[]>(`${CONFIG.baseUrl}/last-certificates`);
      }
    
}

