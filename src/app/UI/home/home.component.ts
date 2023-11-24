import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/Func/Models/Especialidad';
import { Medico } from 'src/app/Func/Models/Medico';
import { EspecialidadServiceService } from 'src/app/Func/Services/especialidad-service.service';
import { MedicoService } from 'src/app/Func/Services/medico.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  title = 'webAgenda';
  query: string = '';
  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  selectedEspecialidadId: number | null = null;

 
  constructor(    private especialidadService: EspecialidadServiceService, private medicoService: MedicoService, private router: Router    ) {
  }

  ngOnInit(): void {
    this.getEspecialidades();
  }

  buscarMedicos() {
    this.medicoService.buscarMedicos(this.query).subscribe((data) => {
      this.medicos = data;
    });
  }

  getEspecialidades(): void {
    this.especialidadService.getEspecialidades().subscribe(
      (data) => {
        this.especialidades = data;
      },
      (error) => {
        console.error('Error al obtener las especialidades', error);
      }
    );
  }


  onEspecialidadSelected(): void {
    if (this.selectedEspecialidadId !== null) {
      this.medicoService.obtenerMedicosPorEspecialidad(this.selectedEspecialidadId)
        .subscribe(medicos => {
          this.medicos = medicos;
        });
    } else {
      this.medicos = [];
    }
  }


  irADetalleMedico(medicoId: string) {
    // Navegar al componente de detalles con el ID del médico
    this.router.navigate(['/medico', medicoId]);
  }




}
