import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { MenuService } from './menu.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../environments/environment';
import { Menu } from './../_model/menu';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //1) Verificar si esta logueado
    let rpta = this.loginService.estaLogueado();
    if(!rpta){
      this.loginService.cerrarSesion();
      return false;
    }else{
    //2) Verificar si el token no ha expirado
      const helper = new JwtHelperService();
      let token = sessionStorage.getItem(environment.TOKEN_NAME);
      if(!helper.isTokenExpired(token)){
      //3) Verificar si tiene rol para acceder a esta pagina
        let url = state.url;

        const decodedToken = helper.decodeToken(token);

        //No usar un subscribe dentro de un Guard o CanActivate por ser asincrono
        return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map( (data: Menu[]) => {
          this.loginService.setMenuCambio(data);

          let cont = 0;
          for(let m of data){
            if(url.startsWith(m.url)){
              cont++;
              break;
            }
          }

          if(cont > 0){
            return true;
          }else{
            this.router.navigate(['not-403']);
            return false;
          }
        }));
      }else{
        this.loginService.cerrarSesion();
        return false;
      }
    }


  }
}
