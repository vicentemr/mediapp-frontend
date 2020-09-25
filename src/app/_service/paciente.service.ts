import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paciente } from '../_model/paciente';
import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})

export class PacienteService extends GenericService<Paciente>{

  private pacienteCambio = new Subject<Paciente[]>();
  private mensajeCambio = new Subject<string>();
  //private url: string = `${environment.HOST}/pacientes`

  constructor(protected http: HttpClient) {
    super(
      http, `${environment.HOST}/pacientes`
    );
  }

  /*listar(){
    return this.http.get<Paciente[]>(this.url);
  }

  listarPorId(id: number){
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }

  registrar(paciente: Paciente){
    return this.http.post(this.url, paciente);
  }

  modificar(paciente: Paciente){
    return this.http.put(this.url, paciente);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }*/

  /////// get y set de pacienteCambio /////////

  getPacienteCambio() {
    return this.pacienteCambio.asObservable();
  }

  setPacienteCambio(pacientes: Paciente[]) {
    return this.pacienteCambio.next(pacientes);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje)
  }
}
