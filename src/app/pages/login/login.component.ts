import { Component, OnInit } from '@angular/core';
import '../../../assets/login-animation.js';
import { LoginService } from './../../_service/login.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MenuService } from './../../_service/menu.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string;
  error: string;

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  iniciarSesion(){
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);

      const helper = new JwtHelperService();
      let decodeToken = helper.decodeToken(data.access_token);
      this.menuService.listarPorUsuario(decodeToken.user_name).subscribe(data => {
        this.loginService.setMenuCambio(data);
        this.router.navigate(['paciente']);
      });

    });
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

}
