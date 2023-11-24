import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, switchMap, throwError } from 'rxjs';
import { Medico } from '../Models/Medico';

@Injectable({
  providedIn: 'root'
})
export class HorarioTrabajoService {
  private apiUrl = 'http://localhost:8080/api/horarios-trabajo'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) {}

  obtenerFechasPorMedico(medicoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fechas/${medicoId}`);
  }

  obtenerHorasPorHorarioTrabajoId(idHorarioTrabajo: string): Observable<string[]> {
    const url = `${this.apiUrl}/horas/${idHorarioTrabajo}`;
    return this.http.get<string[]>(url);
  }

  
  //CRUD HORARIO/HORAS

  generarHorarioTrabajo(fecha: string, idMedico: string): Observable<any> {
    const url = `${this.apiUrl}/generarHorario?fecha=${fecha}&idMedico=${idMedico}`;

    return this.http.post(url, {}, { responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error al generar el horario de trabajo:', error);
        return throwError(error);
      })
    );
  }
  

  modificarFechaHorarioTrabajo(idHorarioTrabajo: string, nuevaFecha: string): Observable<any> {
    const url = `${this.apiUrl}/modificarHorario/${idHorarioTrabajo}`;
  
    // Construir un objeto FormData para simular el envío de form-data
    const formData = new FormData();
    formData.append('nuevaFecha', nuevaFecha);
  
    // Realizar la solicitud HTTP con el método PUT y el objeto FormData
    return this.http.put(url, formData, { responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error al modificar fecha de horario de trabajo:', error);
        return throwError(error);
      }),
      map((response: any) => {
        // La respuesta ya es tratada como texto, no es necesario convertirla
        return response;
      })
    );
  }
  

  guardarHora(hora: string, idHorarioTrabajo: string): Observable<any> {
    const url = `${this.apiUrl}/guardarHora`;

    // Configurar las cabeceras según sea necesario
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
      // Puedes agregar otros encabezados según sea necesario
    });

    // Construir el cuerpo de la solicitud
    const body = `hora=${hora}&idHorarioTrabajo=${idHorarioTrabajo}`;

    // Realizar la solicitud HTTP con el método POST y los parámetros en el cuerpo
    return this.http.post(url, body, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error al guardar la hora:', error);
        return throwError(error);
      })
    );
  }



  modificarHora(idHora: string, nuevaHora: string): Observable<any> {
    const url = `${this.apiUrl}/modificarHora/${idHora}`;

    // Configurar las cabeceras según sea necesario
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // Puedes agregar otros encabezados según sea necesario
    });

    // Construir el cuerpo de la solicitud
    const body = `nuevaHora=${nuevaHora}`;

    // Realizar la solicitud HTTP con el método PUT y los parámetros en el cuerpo
    return this.http.put(url, body, { headers, responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Error al modificar la hora:', error);
        return throwError(error);
      })
    );
  }

  borrarHorarioTrabajo(idHorarioTrabajo: string): Observable<any> {
    const url = `${this.apiUrl}/borrarHorario/${idHorarioTrabajo}`;
  
    // Realizar la solicitud HTTP con el método DELETE
    return this.http.delete(url, { responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error al borrar el horario de trabajo:', error);
        return throwError(error);
      })
    );
  }
  
  borrarHora(idHora: string): Observable<any> {
    const url = `${this.apiUrl}/borrarHora/${idHora}`;
  
    // Realizar la solicitud HTTP con el método DELETE
    return this.http.delete(url, { responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error al borrar la hora:', error);
        return throwError(error);
      })
    );
  }

  //FIN CRUD
}