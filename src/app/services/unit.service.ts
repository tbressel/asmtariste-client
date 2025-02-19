///////////////////////////////////////////////////////
////////////////////  IMPORTATIONS   //////////////////
///////////////////////////////////////////////////////

// Modules
import { HttpClient } from '@angular/common/http';

// Decorator
import { Injectable } from '@angular/core';

// Type model for async data
import { Observable } from 'rxjs';

// Model
import { UnitModel } from '../models/unit.model';
import { FileModel } from '../models/unit-files.model';

// Configuration
import { CONFIG } from '../../config';

// Decorator to inject the service in all components that need it
@Injectable({
  providedIn: 'root',
})


export class UnitService {

  // Constructor to inject the HttpClient
  constructor(private http: HttpClient) { }

  /**
   * 
   * Method used to fetch the data menu
   */
  getAll(): Observable<UnitModel[]> {
    return this.http.get<UnitModel[]>(`${CONFIG.baseUrl}/navigation/get-disk-units`);
  }


  getFile(id: number): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(`${CONFIG.baseUrl}/file/get-files/${id}`);
  }

  /**
 * Methode used to submit the form
 */
  create(label: string, letter: string): Observable<any> {
    return this.http.post(`${CONFIG.baseUrl}/navigation/add-disk-unit`, { label, letter });
  }


  /**
   * Methode used to delete a menu item
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${CONFIG.baseUrl}/navigation/delete-disk-unit/${id}`);
  }

}
