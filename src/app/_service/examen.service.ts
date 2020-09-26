import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Examen } from './../_model/examen';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamenService extends GenericService<Examen>{

  private examenCambio = new Subject<Examen[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(http,`${environment.HOST}/examenes`);
  }

  getExamenCambio() {
    return this.examenCambio.asObservable();
  }

  setExamenCambio(examenes: Examen[]){
    this.examenCambio.next(examenes);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
