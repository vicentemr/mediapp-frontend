import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConsultaService } from './../../_service/consulta.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Consulta } from 'src/app/_model/consulta';
import { MatPaginator } from '@angular/material/paginator';
import { viewClassName } from '@angular/compiler';
import { MatSort } from '@angular/material/sort';
import { FiltroConsultaDTO } from './../../dto/filtroConsultaDTO';
import * as moment from 'moment';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form: FormGroup;
  fechaMax: Date = new Date();
  displayedColumns: ['paciente', 'medico', 'especialidad', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Consulta>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private consultaService: ConsultaService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'dni': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta': new FormControl()
    });
  }

  buscar(){
    let filtro = new FiltroConsultaDTO(this.form.value['dni'], this.form.value['nombreCompleto'], moment(this.form.value['fechaConsulta']).format('YYYY-MM-DDTHH:mm:ss'));


    //delete es propio de JS, es un operador que elimina atributos de un objeto.
    if(filtro.fechaConsulta){
      delete filtro.dni;
      delete filtro.nombreCompleto;
    } else{
      delete filtro.fechaConsulta;

      if(filtro.dni.length === 0)
        delete filtro.dni;

        if(filtro.nombreCompleto.length === 0)
          delete filtro.nombreCompleto;
    }

    this.consultaService.buscar(filtro).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  verDetalle(consulta: Consulta){
    this.dialog.open(BuscarComponent, {
      data: consulta
    });
  }
}
