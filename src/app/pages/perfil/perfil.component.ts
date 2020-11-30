import { Component, Injectable, OnInit } from '@angular/core';
import { AppComponent } from './../../app.component';
import { LoginService } from './../../_service/login.service';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { perfil } from './../../_model/perfil';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

@Injectable({
  providedIn: AppComponent
})

export class PerfilComponent implements OnInit {

  perfil = new perfil();
  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos(){
    const helper = new JwtHelperService;
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.perfil.nombre_usuario = decodedToken.user_name;
    this.perfil.rol = decodedToken.authorities;
    return this.perfil;
  }
}
