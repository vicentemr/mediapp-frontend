import { Component, OnInit, Inject } from '@angular/core';
import { Paciente } from './../../../_model/paciente';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PacienteService } from './../../../_service/paciente.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente: Paciente;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.paciente = new Paciente();
    this.paciente.idPaciente = this.data.idPaciente;
    this.paciente.nombres = this.data.nombres;
    this.paciente.apellidos = this.data.apellidos;
    this.paciente.dni = this.data.dni;
    this.paciente.direccion = this.data.direccion;
    this.paciente.telefono = this.data.telefono;
    this.paciente.email = this.data.email;
  }

  registrar(){
    this.pacienteService.registrar(this.paciente).pipe(switchMap( () => {
      return this.pacienteService.listar();
    })).subscribe(data => {
      this.pacienteService.setPacienteCambio(data);
      this.pacienteService.setMensajeCambio("SE REGISTRÓ el paciente " + this.paciente.nombres + " " + this.paciente.apellidos);

      this.paciente = data[data.length - 1];
      this.cancelar(this.paciente);
    });

  }

  cancelar(pac?: Paciente){
    this.dialogRef.close(pac);
  }
}
