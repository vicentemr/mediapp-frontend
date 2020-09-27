import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from './../../_model/paciente';
import { PacienteService } from './../../_service/paciente.service';
import { Medico } from './../../_model/medico';
import { MedicoService } from './../../_service/medico.service';
import { Especialidad } from './../../_model/especialidad';
import { EspecialidadService } from './../../_service/especialidad.service';
import { DetalleConsulta } from './../../_model/detalleConsulta';
import { Examen } from 'src/app/_model/examen';
import { ExamenService } from './../../_service/examen.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consulta } from './../../_model/consulta';
import * as moment from 'moment';
import { ConsultaListaExamenDTO } from './../../dto/consultaListaExamenDTO';
import { ConsultaService } from '../../_service/consulta.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  pacientes: Paciente[];
  pacientes$: Observable<Paciente[]>;
  medicos$: Observable<Medico[]>;
  especialidades$: Observable<Especialidad[]>;
  examenes$: Observable<Examen[]>;

  idPacienteSeleccionado: number;
  idMedicoSeleccionado: number;
  idEspecialidadSeleccionado: number;
  idExamenSeleccionado: number;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  diagnostico: string;
  tratamiento: string;
  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // this.pacienteService.listar().subscribe(data => {
    //   this.pacientes = data;
    // });

    this.pacientes$ = this.pacienteService.listar();
    this.medicos$ = this.medicoService.listar();
    this.especialidades$ = this.especialidadService.listar();
    this.examenes$ = this.examenService.listar();
  }

  cambiarFecha(e: any){
    console.log(e);
  }

  agregar() {
    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.detalleConsulta.push(det);
    }
  }

  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }

  agregarExamen() {
    if (this.idExamenSeleccionado > 0) {

      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if(examen.idExamen === this.idExamenSeleccionado){
          cont++;
          break;
        }
      }

      if(cont > 0){
        let mensaje = "El examen ya está seleccionado en la lista.";
        this.snackBar.open(mensaje, "AVISO", {duration: 2000});
      }else{
        this.examenService.listarPorId(this.idExamenSeleccionado).subscribe(data => {
          this.examenesSeleccionados.push(data);
        });
      }

    }
  }

  removerExamen(index: number){
    this.examenesSeleccionados.splice(index);
  }

  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 || this.idEspecialidadSeleccionado === 0 || this.idExamenSeleccionado === 0 || this.idPacienteSeleccionado === 0)
  }

  aceptar(){
    let medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;

    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionado;

    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    let consulta = new Consulta();
    consulta.especialidad = especialidad;
    consulta.medico = medico;
    consulta.paciente = paciente;
    consulta.numConsultorio = "C1";
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    console.log(consulta.fecha);
    consulta.detalleConsulta = this.detalleConsulta;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Se registró la consulta", "AVISO", {duration: 2000});

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = null;
    this.tratamiento = null;
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.idMedicoSeleccionado = 0;
    this.fechaSeleccionada = new Date();
  }
}
