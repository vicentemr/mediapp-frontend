import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Paciente } from './../../../_model/paciente';
import { Especialidad } from './../../../_model/especialidad';
import { Medico } from './../../../_model/medico';
import { Examen } from './../../../_model/examen';
import { DetalleConsulta } from './../../../_model/detalleConsulta';
import { PacienteService } from './../../../_service/paciente.service';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { MedicoService } from './../../../_service/medico.service';
import { ExamenService } from './../../../_service/examen.service';
import { ConsultaService } from './../../../_service/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Consulta } from './../../../_model/consulta';
import { ConsultaListaExamenDTO } from './../../../dto/consultaListaExamenDTO';
import * as moment from 'moment';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  isLinear = false;
  primerFormGroup: FormGroup;
  segundoFormGroup: FormGroup;

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

  consultorios: number[] = [];
  consultorioSeleccionado: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private pacienteService : PacienteService,
    private especialidadService: EspecialidadService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar //Mensajes emergentes
  ) { }

  ngOnInit(): void {

    this.primerFormGroup = this.formBuilder.group({
      cboPaciente: ['', Validators.required],
      fecha: ['', new FormControl(new Date(), [Validators.required])],
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl('')

    });

    this.segundoFormGroup = this.formBuilder.group({
      hidden: ['', Validators.required]
    });



    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();
    this.listarConsultorios();
  }

  listarConsultorios(){
    for (let i = 0; i <= 20; i++) {
      this.consultorios.push(i);
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

  seleccionarPaciente(e: any){
    this.pacienteSeleccionado = e.value;
  }

  seleccionarEspecialidad(e: any){
    this.especialidadSeleccionada = e.value;
  }

  seleccionarMedico(medico: Medico){
    this.medicoSeleccionado = medico;
  }

  seleccionarConsultorio(e: number){
    this.consultorioSeleccionado = e;
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

  agregarExamen() {
    if (this.examenSeleccionado) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont++;
          break;
        }
      }
      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }

  removerDiagnostico(index: number){
    this.detalleConsulta.splice(index, 1);
  }

  nextManualStep(){
    if(this.consultorioSeleccionado > 0){
      this.stepper.linear = false;
      this.stepper.next();
    } else {
      this.snackBar.open("DEBE SELECCIONAR LOS CAMPOS OBLIGATORIOS.", "INFO", {duration: 2000});
    }
  }

  registrar(){
    let consulta = new Consulta();
    consulta.especialidad = this.especialidadSeleccionada;
    consulta.medico = this.medicoSeleccionado;
    consulta.paciente = this.pacienteSeleccionado;
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;
    consulta.numConsultorio = `C${this.consultorioSeleccionado}`;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Se registrรณ", "Aviso", { duration: 2000 });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = undefined;
    this.especialidadSeleccionada = undefined;
    this.medicoSeleccionado = undefined;
    this.examenSeleccionado = undefined;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.consultorioSeleccionado = 0;
    this.mensaje = '';
    this.stepper.reset();
  }

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === undefined || this.medicoSeleccionado === undefined || this.pacienteSeleccionado === undefined || this.consultorioSeleccionado === 0);
  }
}
