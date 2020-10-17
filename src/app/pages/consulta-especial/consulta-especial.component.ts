import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PacienteService } from './../../_service/paciente.service';
import { EspecialidadService } from './../../_service/especialidad.service';
import { MedicoService } from './../../_service/medico.service';
import { ExamenService } from './../../_service/examen.service';
import { ConsultaService } from './../../_service/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paciente } from './../../_model/paciente';
import { Especialidad } from './../../_model/especialidad';
import { Medico } from 'src/app/_model/medico';
import { Examen } from 'src/app/_model/examen';
import { DetalleConsulta } from './../../_model/detalleConsulta';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { escapeIdentifier } from '@angular/compiler/src/output/abstract_emitter';
import * as moment  from 'moment';
import { Consulta } from './../../_model/consulta';
import { ConsultaListaExamenDTO } from './../../dto/consultaListaExamenDTO';

@Component({
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css']
})
export class ConsultaEspecialComponent implements OnInit {

  form: FormGroup;
  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  examenes: Examen[] = [];

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  pacienteSeleccionado: Paciente;
  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  examenSeleccionado: Examen;

  fechaSeleccionada: Date = new Date();
  fechaMax: Date = new Date();

  //Para cada autocomplete
  myControlPaciente: FormControl = new FormControl();
  myControlMedico: FormControl = new FormControl();

  pacientesFiltrados$: Observable<Paciente[]>;
  medicosFiltrados$: Observable<Medico[]>;

  constructor(
    private pacienteService : PacienteService,
    private especialidadService: EspecialidadService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar //Mensajes emergentes
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'paciente': this.myControlPaciente,
      'especialidad': new FormControl(),
      'medico': this.myControlMedico,
      'fecha': new FormControl(new Date()),
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl('')
    });

    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
    this.medicosFiltrados$ = this.myControlMedico.valueChanges.pipe(map(val => this.filtrarMedicos(val)));

  }

  filtrarPacientes(val: any){
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni));
    }

    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val));

  }

  filtrarMedicos(val: any){
    if(val != null && val.idMedico > 0){
      return this.medicos.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.cmp.includes(val.cmp));
    }else {
      return this.medicos.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.cmp.includes(val.cmp));
      }
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  listarMedicos(){
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }

  listarEspecialidad(){
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  listarExamenes(){
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    });
  }

  agregar(){

    if(this.diagnostico != null && this.tratamiento != null){
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.detalleConsulta.push(det);
      this.diagnostico = null;
      this.tratamiento = null;
    }else {
      this.mensaje = `Es necesario ingresar un diagnóstico y un tratamiento`;
      this.snackBar.open(this.mensaje, "AVISO", {duration: 2000});
    }
  }

  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }

  removerExamen(index: number){
    this.examenesSeleccionados.splice(index, 1);
  }

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === null || this.medicoSeleccionado === null || this.pacienteSeleccionado === null)
  }
  agregarExamen() {
    if(this.examenSeleccionado){
      let cont = 0;
      for(let i = 0; i < this.examenesSeleccionados.length; i++){
        let examen = this.examenesSeleccionados[i];
        if(examen.idExamen === this.examenSeleccionado.idExamen) {
          cont ++;
          break;
        }
      }

      if(cont > 0){
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, "AVISO", {duration: 2000});
      }else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, "AVISO", {duration: 2000});
    }
  }

  aceptar() {
    let consulta = new Consulta();
    consulta.paciente = this.form.value['paciente']; // también se puede obtener usando: this.pacienteSeleccionado
    consulta.medico = this.form.value['medico'];
    consulta.especialidad = this.form.value['especialidad'];
    consulta.numConsultorio = "C1";
    consulta.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Se registró", "AVISO", {duration: 2000});

      setTimeout(() => {
        this.limpiarControles();
      }, 2000)
    });

  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = null;
    this.especialidadSeleccionada = null;
    this.examenSeleccionado = null;
    this.medicoSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';

    //para vacias autocompletes
    this.myControlMedico.reset();
    this.myControlPaciente.reset();
  }

  mostrarPacientes(val: Paciente){
    return val ? `${val.nombres} ${val.apellidos}`: val;
  }

  seleccionarPaciente(e: any){
    console.log(e);
    this.pacienteSeleccionado = e.option.value;
  }

  mostrarMedicos(val: Medico){
    return val ? `${val.nombres} ${val.apellidos}`: val;
  }

  seleccionarMedico(e: any){
    console.log(e);
    this.medicoSeleccionado = e.option.value;
  }
}
