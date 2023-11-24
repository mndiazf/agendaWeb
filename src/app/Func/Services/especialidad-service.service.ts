import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Especialidad } from '../Models/Especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadServiceService {


  private apiUrl = 'http://localhost:8080/api/especialidades/todas';

  constructor(private http: HttpClient) {}

  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}`);
  }
}
