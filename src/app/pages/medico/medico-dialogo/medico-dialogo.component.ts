import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medico } from 'src/app/_model/medico';
import { MedicoService } from './../../../_service/medico.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  medico: Medico;

  constructor(
    private dialogRef: MatDialogRef<MedicoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Medico,
    private medicoService: MedicoService
  ) { }

  ngOnInit(): void {
    this.medico = new Medico();
    this.medico.idMedico = this.data.idMedico
    this.medico.nombres = this.data.nombres
    this.medico.apellidos = this.data.apellidos
    this.medico.cmp = this.data.cmp
    this.medico.fotoUrl = this.data.fotoUrl
  }

  operar(){
    if (this.medico.idMedico != null && this.medico.idMedico > 0) {
      //MODIFICAR
      this.medicoService.modificar(this.medico).pipe(switchMap( () => {
        return this.medicoService.listar();
      })).subscribe(data => {
        this.medicoService.setMedicoCambio(data);
        this.medicoService.setMensajeCambio('SE MODIFICO EL MÉDICO');
      });

    }else{
      //REGISTRAR
      this.medicoService.registrar(this.medico).pipe(switchMap(() => {
        return this.medicoService.listar();
      })).subscribe(data => {
        this.medicoService.setMedicoCambio(data);
        this.medicoService.setMensajeCambio('SE AGREGÓ EL MEDICO ' + this.medico.nombres + ' ' + this.medico.apellidos);
      });
    }

    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close();
  }

}
