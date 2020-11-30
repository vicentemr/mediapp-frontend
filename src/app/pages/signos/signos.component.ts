import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Signos } from './../../_model/signos';
import { MatSort } from '@angular/material/sort';
import { SignosService } from './../../_service/signos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  displayedColumns = ['paciente', 'temperatura', 'pulso', 'ritmo', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Signos>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private signosService: SignosService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.signosService.getSignosCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });

    this.signosService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration: 2000});
    });

    this.signosService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idSignos: number){
    this.signosService.eliminar(idSignos).pipe(switchMap( () => {
      return this.signosService.listar()
    })).subscribe(data => {
      this.signosService.setSignosCambio(data);
      this.signosService.setMensajeCambio("SE ELIMINÓ EL REGISTRO.");
    });
  }

}
