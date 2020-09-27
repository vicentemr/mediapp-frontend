import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Consulta } from '../_model/consulta';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ConsultaListaExamenDTO } from '../dto/consultaListaExamenDTO';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService extends GenericService<Consulta>{

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/consultas`)
  }

  registrarTransaccion(consultaDTO: ConsultaListaExamenDTO) {
    return this.http.post(this.url, consultaDTO);
  }
}
