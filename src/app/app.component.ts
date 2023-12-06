import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface UserDto {
  username: string;
  email: string;
  type: 'user' | 'admin';
  password: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  types: string[];
  registerForm: FormGroup;
  isSummitting: boolean = false;
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  // CODE HERE
  //
  // I want to be able to create a new user for the application. Implement a reactive form that I can submit
  //
  // Form:
  // - username (required, min 3, max 24 characters)
  // - email (required, valid email address)
  // - type (required, select dropdown with either 'user' or 'admin')
  // - password (required, min 5, max 24 characters, upper and lower case, at least one special character)
  //
  // Requirements:
  // The form should submit a valid UserDto object (call createUser() function)
  // The submit button should be disabled if the form is invalid
  // The submit button should be disabled while the submit request is pending
  // If the request fails the button must become submittable again (error message must not be displayed)
  // Errors should be displayed under each input if not valid
  //
  // Futher Notes:
  // Styling is not important, use default HTML elements (no angular material or bootstrap)

  ngOnInit() {
    this.types = ['user', 'admin'];
    this.registerForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      type: ['', [Validators.required, Validators.pattern(/^(user|admin)$/)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(24),
          Validators.pattern(/^[a-zA-Z$&+,:;=?@#|'<>.^*()%!-]+$/),
          Validators.pattern(/[$&+,:;=?@#|'<>.^*()%!-]+/),
        ],
      ],
    });
  }

  async createUser() {
    this.isSummitting = true;
    // await new Promise((res) => setTimeout(res, 2500));
    // Backend call happening here.
    this.http
      .post('http://localhost:3000/register', {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        type: this.registerForm.value.type,
        password: this.registerForm.value.password,
      })
      .pipe(map((res) => res))
      .subscribe({
        next: (res) => {
          console.log(res);
          return {
            username: this.registerForm.value.username,
            email: this.registerForm.value.email,
            type: this.registerForm.value.type,
          };
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => (this.isSummitting = false),
      });
  }
}
