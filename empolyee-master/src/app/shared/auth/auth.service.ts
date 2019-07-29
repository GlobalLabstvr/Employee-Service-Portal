import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map} from 'rxjs/operators';

import { Employee } from '../model/employee.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private loginEmpSubject$: Subject<string> = new Subject<string>();
          loginEmpObservable$: Observable<string> = this.loginEmpSubject$.asObservable();
  private isAuthenticated = false;
  private token: string;
  public  employees: Employee[] = [];
  private authStatusListener = new Subject<boolean>();
  private loginEmp: Employee = null;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  getEmpdata() {
    return this.http.get<Employee[]>('http://localhost:3000/api/employee');
  }

  setResult(result: Employee[]) {
    this.employees = result;
  }

  createEmployee(employee: Employee) {
    this.http
      .post('http://localhost:3000/api/employee/signup', employee)
      .subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    return this.http.post<{token: string, employee: Employee}>('http://localhost:3000/api/employee/login', {
      email: email,
      password: password
    })
    .pipe(map(result => {
      if (result) {
        // this.users =result;
        console.log('success:' + JSON.stringify(result));
        this.setLoginEmp(result.employee);
      } else {
        localStorage.setItem('result', null);
        JSON.parse(localStorage.getItem('result'));
      }
      return result;
      })
    );
  }

  setLoginEmp( employee: Employee ) {
    console.log('setLoginUser:' + JSON.stringify(employee));
    this.loginEmp = employee;
    this.loginEmpSubject$.next(employee.email);
  }

  getLoginEmp(): Employee {
    return this.loginEmp;
  }
}
