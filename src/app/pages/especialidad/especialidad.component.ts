  import { Component, OnInit, ViewChild } from '@angular/core';
  import { MatTableDataSource } from '@angular/material/table';
  import { Especialidad } from './../../_model/especialidad';
  import { MatPaginator } from '@angular/material/paginator';
  import { MatSort } from '@angular/material/sort';
  import { EspecialidadService } from './../../_service/especialidad.service';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { ActivatedRoute } from '@angular/router';
  import { switchMap } from 'rxjs/operators';

  @Component({
    selector: 'app-especialidad',
    templateUrl: './especialidad.component.html',
    styleUrls: ['./especialidad.component.css']
  })
  export class EspecialidadComponent implements OnInit {

    displayedColumns = ['id', 'nombre', 'descripcion', 'acciones'];
    dataSource: MatTableDataSource<Especialidad>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
      private especialidadService: EspecialidadService,
      private snackBar: MatSnackBar,
      public route: ActivatedRoute
    ) { }

    ngOnInit(): void {
      this.especialidadService.getEspecialidadCambio().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });

      this.especialidadService.getMensajeCambio().subscribe(data => {
        this.snackBar.open(data, 'Aviso', {duration: 2000});
      });

      this.especialidadService.listar().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    }

    filtrar(valor: string){
      this.dataSource.filter = valor.trim().toLowerCase();
    }

    eliminar(especialidad: Especialidad){
      this.especialidadService.eliminar(especialidad.idEspecialidad).pipe(switchMap( () => {
        return this.especialidadService.listar();
      })).subscribe(data => {
        this.especialidadService.setEspecialidadCambio(data);
        this.especialidadService.setMensajeCambio('SE ELIMINÓ LA ESPECIALIDAD.');
      });
    }

  }
