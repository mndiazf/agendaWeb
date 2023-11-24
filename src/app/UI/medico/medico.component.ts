import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Medico } from 'src/app/Func/Models/Medico';
import { HorarioTrabajoService } from 'src/app/Func/Services/horario-trabajo.service';
import { MedicoService } from 'src/app/Func/Services/medico.service';


@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.scss'],
})
export class MedicoComponent {
  fechasConHoras: any[] = [];
  medico!: Medico;
  idMedico!: string;

  nuevaFecha!: string | null;


  constructor(
    private route: ActivatedRoute,
    private medicoService: MedicoService,
    private horarioTrabajoService: HorarioTrabajoService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const medicoId = params.get('id');
      if (medicoId) {
        this.idMedico = medicoId;
        this.obtenerDetalleMedico(medicoId);
        this.obtenerFechasPorMedico(medicoId);
      }
    });
    
  }

  toggleDatePicker(fechaConHoras: any) {
    fechaConHoras.showDatePicker = !fechaConHoras.showDatePicker;
  }

  toggleAddHourForm(fechaConHoras: any): void {
    fechaConHoras.showAddHourForm = !fechaConHoras.showAddHourForm;
  }

  toggleEditHora(fechaConHoras: any, hora: string): void {
    fechaConHoras.editingHora = fechaConHoras.editingHora === hora ? null : hora;
  }



  obtenerDetalleMedico(medicoId: string): void {
    this.medicoService.obtenerDetalleMedico(medicoId).subscribe((medico) => {
      this.medico = medico;
    });
  }

  obtenerFechasPorMedico(medicoId: string) {
    this.horarioTrabajoService.obtenerFechasPorMedico(medicoId).subscribe({
      next: (fechas: any[]) => {
        this.fechasConHoras = fechas.map(fecha => ({ id: fecha.id, fecha: fecha.fecha, horas: [] }));
        this.obtenerHorasPorHorarioTrabajoIds();
      },
      error: (error) => {
        console.error('Error al obtener fechas por medicoId:', error);
      }
    });
  }


obtenerHorasPorHorarioTrabajoIds() {
  const observables = this.fechasConHoras.map(fecha =>
    this.horarioTrabajoService.obtenerHorasPorHorarioTrabajoId(fecha.id)
  );

  forkJoin(observables).subscribe({
    next: (horarios: any[][]) => {
      // Asigna las horas a cada fecha
      horarios.forEach((horas, index) => {
        this.fechasConHoras[index].horas = horas.map(hora => ({ id: hora.id, hora: hora.hora }));
      });
    },
    error: (error) => {
      console.error('Error al obtener horas por id de horario de trabajo:', error);
    }
  });
}





  ////CRUD


  agregarFecha() {
    if (!this.nuevaFecha) {
      console.error('Seleccione una fecha antes de agregarla.');
      return;
    }

    // Formatear la fecha como "yyyy-MM-dd"
    const fechaFormateada: string = new Date(this.nuevaFecha).toISOString().split('T')[0];
    console.log('Fecha a enviar al servidor:', fechaFormateada);
    console.log('ID del Médico:', this.idMedico);

    // Llamar al servicio para generar el horario de trabajo
    this.horarioTrabajoService.generarHorarioTrabajo(fechaFormateada, this.idMedico.toString())
      .subscribe(
        (mensajeExito) => {
          console.log('Mensaje de éxito del servidor:', mensajeExito);
          this.obtenerFechasPorMedico(this.idMedico.toString());
          // Puedes realizar otras acciones aquí, como actualizar la vista
        },
        (error) => {
          // Manejar el error del servicio
          console.error('Error al agregar fecha:', error);
          // Puedes mostrar un mensaje de error o realizar otras acciones según sea necesario
        }
      );
  }


  updateFecha(fechaConHoras: any) {
    if (!fechaConHoras.id) {
      console.error('ID de horario de trabajo no definido.');
      return;
    }

    const idHorarioTrabajo = fechaConHoras.id;
    const nuevaFecha = fechaConHoras.nuevaFecha.toISOString().split('T')[0];

    this.horarioTrabajoService.modificarFechaHorarioTrabajo(idHorarioTrabajo, nuevaFecha)
      .subscribe(
        (response) => {
          console.log('Fecha del horario de trabajo modificada con éxito:', response);
          fechaConHoras.showDatePicker = false; // Oculta el datepicker después de actualizar
          this.obtenerFechasPorMedico(this.idMedico.toString());
          // Puedes realizar otras acciones aquí, como actualizar la vista
        },
        (error) => {
          console.log(nuevaFecha)
          console.error('Error al modificar fecha del horario de trabajo:', error);
          // Puedes mostrar un mensaje de error o realizar otras acciones según sea necesario
        }
      );
  }
  
  addHora(fechaConHoras: any): void {
    // Lógica para agregar la nueva hora
    const nuevaHora = fechaConHoras.nuevaHora;
  
    // Realizar acciones necesarias, por ejemplo, llamar a un servicio para guardar la hora
    this.horarioTrabajoService.guardarHora(nuevaHora, fechaConHoras.id)
      .subscribe(
        (response) => {
          // Verificar la respuesta y realizar acciones adicionales si es necesario
          this.obtenerFechasPorMedico(this.idMedico.toString());
          console.log('Hora agregada exitosamente:', response);
  
          // Limpiar el campo y ocultar el formulario
          fechaConHoras.nuevaHora = '';
          fechaConHoras.showAddHourForm = false;
        },
        (error) => {
          // Manejar el error del servicio
          console.error('Error al agregar la hora:', error);
          // Puedes mostrar un mensaje de error o realizar otras acciones según sea necesario
        }
      );
  }

  confirmEditHora(fechaConHoras: any, hora: any): void {
    // Verifica que horas esté definido y no sea un array vacío
    if (!fechaConHoras.horas || fechaConHoras.horas.length === 0) {
      console.error('Error: horas no está definido o es un array vacío en fechaConHoras.');
      return;
    }
  
  
    // Verifica que idHora esté definido y tenga un valor antes de continuar
    if (!hora) {
      console.error('Error: idHora no está definido en la primera hora de fechaConHoras.');
      return;
    }
  
    const nuevaHora = fechaConHoras.nuevaHora;
  
    this.horarioTrabajoService.modificarHora(hora.id, nuevaHora).subscribe(
      (response) => {
        this.obtenerFechasPorMedico(this.idMedico.toString());

        // Verificar y manejar la respuesta según tus necesidades
        console.log('Hora modificada con éxito:', response);
      },
      (error) => {
        console.error('Error al modificar hora:', error);
        // Puedes mostrar un mensaje de error o realizar otras acciones según sea necesario
      }
    );
  }

  deleteFecha(fechaConHoras: any): void {
    const idHorarioTrabajo = fechaConHoras.id;
  
    this.horarioTrabajoService.borrarHorarioTrabajo(idHorarioTrabajo).subscribe(
      (response) => {
        console.log('Fecha borrada con éxito:', response);
  
        // Filtra las fechas, manteniendo solo aquellas que no coincidan con la fecha eliminada
        this.fechasConHoras = this.fechasConHoras.filter(fecha => fecha.id !== idHorarioTrabajo);
      },
      (error) => {
        console.error('Error al borrar la fecha:', error);
        // Puedes mostrar un mensaje de error o realizar otras acciones según sea necesario
      }
    );
  }

  borrarHora(hora: any): void {
    // Verifica que la hora esté definida antes de continuar
    if (!hora || !hora.id) {
      console.error('Error: La hora no está definida o no tiene un ID.');
      return;
    }
  
    this.horarioTrabajoService.borrarHora(hora.id).subscribe(
      (response) => {
        // Verificar y manejar la respuesta según tus necesidades
        console.log('Hora borrada con éxito:', response);
        this.obtenerFechasPorMedico(this.idMedico.toString());
      },
      (error) => {
        console.error('Error al borrar hora:', error);
        // Puedes mostrar un mensaje de error o realizar otras acciones según sea necesario
      }
    );
  }
  
  
}





