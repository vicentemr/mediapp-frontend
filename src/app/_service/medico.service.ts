import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Medico } from './../_model/medico';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MedicoService extends GenericService<Medico>{

  private medicoCambio = new Subject<Medico[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http:HttpClient) {
    super(
      http, `${environment.HOST}/medicos`
    )
  }

  getMedicoCambio(){
    return this.medicoCambio.asObservable();
  }

  setMedicoCambio(pacientes: Medico[]){
    return this.medicoCambio.next(pacientes);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje)
  }
}
