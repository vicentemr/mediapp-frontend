import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PacienteService } from './../../../_service/paciente.service';
import { Paciente } from './../../../_model/paciente';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl('', [Validators.required , Validators.minLength(3)]),
      'apellidos': new FormControl('', Validators.required),
      'email': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl('')
    });

    this.route.params.subscribe((data: Params) => {
      this.id= data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    })

  }

  get f(){ return this.form.controls; }

  private initForm(){
    if(this.edicion){
      this.pacienteService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idPaciente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'email': new FormControl(data.email),
          'dni': new FormControl(data.dni),
          'telefono': new FormControl(data.telefono),
          'direccion': new FormControl(data.direccion)
        });
      });
    }
  }

  operar(){

    if(this.form.invalid) { return;}

    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.email = this.form.value['email'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];

    if(this.edicion){
      //MODIFICAR
      //PRACTICA IDEAL
      this.pacienteService.modificar(paciente).subscribe( () => {
        this.pacienteService.listar().subscribe( data => {
          // this.pacienteService.pacienteCambio.next(data);
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('SE MODIFICÓ EL PACIENTE');
        });
      });

      //pipe hace que no se suscriba hasta terminar todas las llamadas http
      this.pacienteService.modificar(paciente).pipe(switchMap( () => {
        return this.pacienteService.listar()
      })).subscribe(data => {
        this.pacienteService.setPacienteCambio(data);
      });
    }else{
      //REGISTRAR
      //PRACTICA COMUN
      this.pacienteService.registrar(paciente).subscribe( () => {
        this.pacienteService.listar().subscribe( data => {
          // this.pacienteService.pacienteCambio.next(data);
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('SE REGISTRÓ EL PACIENTE: ' + paciente.nombres + ' ' + paciente.apellidos);
        });
      });
    }

    this.router.navigate(['paciente']);
  }

}
