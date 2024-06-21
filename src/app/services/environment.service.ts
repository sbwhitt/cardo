import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() { }

  isLocal(): boolean {
    return location.hostname !== "localhost";
  }
}
