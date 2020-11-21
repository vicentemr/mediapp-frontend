import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from './../_model/menu';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu>{

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/menus`
    )
  }

  listarPorUsuario(nombre: string){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    //Sin usar la libreia de @auth0/angular-jwt
    return this.http.post<Menu[]>(`${this.url}/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
  }
}
