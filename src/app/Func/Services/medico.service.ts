import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medico } from '../Models/Medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private apiUrl = 'http://localhost:8080/medicos';

  constructor(private http: HttpClient) {}

  obtenerMedicosPorEspecialidad(idEspecialidad: number): Observable<Medico[]> {
    const url = `${this.apiUrl}/por-especialidad/${idEspecialidad}`;
    return this.http.get<Medico[]>(url);
  }

  buscarMedicos(query: string): Observable<Medico[]> {
    const url = `${this.apiUrl}/buscar?q=${query}`;
    return this.http.get<Medico[]>(url);
  }

  obtenerDetalleMedico(id: string): Observable<Medico> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Medico>(url);
  }
}
