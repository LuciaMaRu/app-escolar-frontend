import { Component, inject, Input, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Location } from '@angular/common';
import { MaestrosService } from '../../services/maestros-service';
//Importar la interfaz de datos del alumno
import { DatosMaestro } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-registro-maestros',
  imports: [...SHARED_IMPORTS],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss',
})
export class RegistroMaestros implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosMaestro = {} as DatosMaestro;

  //Inyectar el servicio Location para poder regresar a la página anterior
  private location = inject(Location);
  //Inyectar el servicio de alumno para poder registrar y actualizar los datos del administrador
  private maestrosService = inject(MaestrosService);

  //Declarar las variables para el formulario de registro
  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  //Variables para el campo de contraseña
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  //Variables para el calendario
  public minDate: Date = new Date(1960, 0, 1);
  public maxDate: Date = new Date(
    new Date().getFullYear() - 18,
    new Date().getMonth(),
    new Date().getDate(),
  );

  //Variables de materias
  public materiasSeleccionadas = {
    aplicacionesWeb: false,
    programacion1: false,
    basesDatos: false,
    tecnologiasWeb: false,
    mineriaDatos: false,
    desarrolloMovil: false,
    estructurasDatos: false,
    administracionRedes: false,
    ingenieriaSoftware: false,
    administracionSO: false,
  };

  constructor() {}

  ngOnInit(): void {
    //Si el rol es maestro, se inicializa el objeto maestro con los datos del usuario
    this.maestro = this.maestrosService.esquemaMaestro();
    console.log('Datos del maestro:', this.maestro);
  }

  public regresar(): void {
    this.location.back();
  }

  public showPassword(): void {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar(): void {
    if (this.inputType_2 === 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public registrar() {
    // Lógica para validar si el usuario alumno trae datos o no en los campos del formulario
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    console.log('Errores de validación:', this.errors);

    // Si hay errores de validación, no se procede con el registro o actualización
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    //Lógica para registrar o actualizar los datos del alumno
    // TODO: Aquí se debe implementar la lógica para registrar o actualizar los datos del administrador en el backend, utilizando el servicio de administradores.
  }

  public actualizar() {}

  public soloLetras(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
  public validarMatricula(event: KeyboardEvent): void {
    if (!/[0-9]/.test(event.key) && event.key.length === 1) {
      event.preventDefault();
    }
  }
}
