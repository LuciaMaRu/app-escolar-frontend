import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { DatosAlumno } from '../interfaces/usuarios.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  //Inyectar los servicios para validaciones y errores
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // Método para los headers de autenticación que sirven para enviar el token de sesión en las solicitudes HTTP
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  //Método para definir el esquema de validación para los datos del alumno
  public esquemaAlumno(): DatosAlumno {
    return {
      id: 0,
      matricula: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: '',
      curp: '',
      rfc: '',
      edad: 0,
      telefono: '',
      ocupacion: '',
    };
  }
  // Variables para la validación de fechas
  public minDate: Date = new Date(1960, 0, 1);
  public maxDate: Date = new Date(
    new Date().getFullYear() - 18,
    new Date().getMonth(),
    new Date().getDate(),
  );
  public validarAlumno(data: DatosAlumno, editar: boolean) {
    // Lógica de validación para los datos del alumno
    const error: any = {};

    //Validaciones
    if (!this.validatorService.required(data['matricula'])) {
      error['matricula'] = this.errorService.required;
    } else if (!/^\d+$/.test(data['matricula'].toString())) {
      error['matricula'] = 'La matrícula debe contener únicamente números.';
    }

    if (!this.validatorService.required(data['first_name'])) {
      error['first_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['last_name'])) {
      error['last_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data['password'])) {
        error['password'] = this.errorService.required;
      }

      if (!this.validatorService.required(data['confirmar_password'])) {
        error['confirmar_password'] = this.errorService.required;
      }
    }

    const fechaNacimiento = new Date(data['fecha_nacimiento']);

    if (!this.validatorService.required(data['fecha_nacimiento'])) {
      error['fecha_nacimiento'] = this.errorService.required;
    } else if (fechaNacimiento > this.maxDate || fechaNacimiento < this.minDate) {
      error['fecha_nacimiento'] = 'La edad debe ser de al menos 18 años.';
    }

    const curp = data['curp']?.trim().toUpperCase();
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;

    if (!this.validatorService.required(curp)) {
      error['curp'] = this.errorService.required;
    } else if (!curpRegex.test(curp)) {
      error['curp'] = 'La CURP debe tener un formato válido de 18 caracteres.';
    }

    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
    }

    if (!this.validatorService.required(data['edad'])) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['edad'])) {
      error['edad'] = 'El formato es solo números';
    } else if (data['edad'] < 18) {
      error['edad'] = 'La edad debe ser mayor o igual a 18';
    }

    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['ocupacion'])) {
      error['ocupacion'] = this.errorService.required;
    }

    //Return JSON con los errores encontrados, si no hay errores el JSON estará vacío
    return error;
  }
}
