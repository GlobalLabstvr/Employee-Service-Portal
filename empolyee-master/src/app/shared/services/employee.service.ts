import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Employee } from '../model/employee.model';


@Injectable({
  providedIn: 'root'
})

export class EmployeeListService {
  public employees: any;
  constructor(private http: HttpClient, private router: Router) {}

  // getUsers():Observable<User[]> {
  // return this.http.get<User[]>('http://localhost:3000/api/user')
  // }

  getEmployees() {
    return this.http.get('http://localhost:3000/api/employee');
  }

  getEmployee(id: string) {
    return this.http.get<{ _id: string; firstName: string; lastName: string; email: string; phoneNumber: number}>(
      'http://localhost:3000/api/employee' + id
    );
  }

  setResult(res: any) {
    this.employees = res;
  }
}









