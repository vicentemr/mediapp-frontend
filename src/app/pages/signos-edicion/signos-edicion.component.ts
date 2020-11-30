import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Paciente } from '../../_model/paciente';
import { Observable } from 'rxjs';
import { PacienteService } from '../../_service/paciente.service';
import { SignosService } from '../../_service/signos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, switchMap, subscribeOn } from 'rxjs/operators';
import { Signos } from '../../_model/signos';
import * as moment  from 'moment';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PacienteDialogoComponent } from './paciente-dialogo/paciente-dialogo.component';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  id: number;
  edicion: boolean;
  dialogo: boolean;

  form: FormGroup;
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente;
  controlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;

  fechaSeleccionada: Date = new Date();
  fechaMax: Date = new Date();

  temperatura: string;
  pulso: string;
  ritmo: string;

  mensaje: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private signosService: SignosService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.controlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl('')
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.iniciarFormulario();
    })

    this.listarPacientes();

    this.pacientesFiltrados$ = this.controlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
  }

  get f(){ return this.form.controls; }

  iniciarFormulario(pacFromDialog?: Paciente){
    if(this.edicion){
      this.signosService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSignos),
          'paciente': new FormControl(data.paciente),
          'fecha': new FormControl(data.fecha),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmo': new FormControl(data.ritmo)
        });
      });
    }else if(this.dialogo){
      this.form = new FormGroup({
        'id': new FormControl(0),
        'paciente': new FormControl(pacFromDialog),
        'fecha': new FormControl(new Date()),
        'temperatura': new FormControl(''),
        'pulso': new FormControl(''),
        'ritmo': new FormControl('')
      });
    }
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  filtrarPacientes(val: any){
    if(val != null && val.idPaciente > 0){
      return this.pacientes.filter(ele =>
        ele.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || ele.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()));
    }

    return this.pacientes.filter(ele =>
      ele.nombres.toLowerCase().includes(val?.toLowerCase()) || ele.apellidos.toLowerCase().includes(val?.toLowerCase()));
  }

  seleccionarPaciente(p: any){
    console.log(p);
    this.pacienteSeleccionado = p.option.value;
  }

  mostrarPacientes(p: Paciente){
    return p ? `${p.nombres} ${p.apellidos}`: p;
  }

  aceptar(){

    if(this.form.invalid) { return;}

    let signos = new Signos();
    signos.idSignos = this.form.value['id'];
    signos.paciente = this.form.value['paciente'];
    signos.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    signos.temperatura = this.form.value['temperatura'];
    signos.pulso = this.form.value['pulso'];
    signos.ritmo = this.form.value['ritmo'];

    if(this.edicion){
      this.signosService.modificar(signos).pipe(switchMap( () => {
        return this.signosService.listar()
      })).subscribe(data => {
        this.signosService.setSignosCambio(data);
        this.signosService.setMensajeCambio('SE MODIFICÓ los signos del paciente ' + signos.paciente.nombres);
      });
    }else{
      this.signosService.registrar(signos).pipe(switchMap( () => {
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.setSignosCambio(data);
        this.snackBar.open("Se registró", "AVISO", {duration: 2000});

        setTimeout(() => {
          this.limpiarControles();
        }, 2000)
      });
    }

    this.router.navigate(['signos']);

  }

  openDialog(){
    let pac = new Paciente();
    let dialogRef = this.dialog.open(PacienteDialogoComponent, {
      width: '250px',
      data: pac
    })

    dialogRef.afterClosed().subscribe(data => {
      if(data != undefined){
        this.dialogo = true
        this.iniciarFormulario(data);
      }
    });
  }

  limpiarControles(){
    this.pacienteSeleccionado = null;
    this.temperatura = '';
    this.pulso = '';
    this.ritmo = '';
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';

    this.controlPaciente.reset();
  }

}
