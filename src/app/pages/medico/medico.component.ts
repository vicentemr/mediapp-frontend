import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Medico } from './../../_model/medico';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MedicoService } from './../../_service/medico.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  displayedColumns = ['idmedico', 'nombres', 'apellidos', 'cmp', 'acciones'];
  dataSource: MatTableDataSource<Medico>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private medicoService: MedicoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.medicoService.getMedicoCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.medicoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration: 2000});
    });

    this.medicoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idMedico: number){
    this.medicoService.eliminar(idMedico).pipe(switchMap( () => {
      return this.medicoService.listar()
    })).subscribe(data => {
      this.medicoService.setMedicoCambio(data);
      this.medicoService.setMensajeCambio("SE ELIMINÓ EL MÉDICO.");
    });
  }

  //se añade el ? para determinar que es opcional el parámetro
  abrirDialogo(medico?: Medico){
    let med = medico != null ? medico : new Medico();
    this.dialog.open(MedicoDialogoComponent, {
      width: '250px',
      data: med
    })
  }

}
