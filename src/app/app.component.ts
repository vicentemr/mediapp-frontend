import { Component, OnInit } from '@angular/core';
import { LoginService } from './_service/login.service';
import { Menu } from './_model/menu';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { perfil } from './_model/perfil';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  menus: Menu[];
  per : perfil;
  tienePerfil: boolean = false;
  constructor(
    public loginService: LoginService,
    public perfil: PerfilComponent
  ){

  }

  ngOnInit(){

    this.loginService.getMenuCambio().subscribe(data => {
      this.menus = data;
    });

    console.log("per :" + this.per);
    if(this.per != null){
      this.datosUsuario;
    }

  }

  datosUsuario(){
    this.per = new perfil();
    this. per = this.perfil.obtenerDatos();
    if(this.per != null){
      this.tienePerfil = true;
    }
  }

}
