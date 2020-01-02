import { Injectable, Inject} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'; export const apiUrl = environment.apiUrl;

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SavingGoal} from '../models/Saving-goal.model';


@Injectable({
  providedIn: 'root'
})
export class GoalServiceService {

  @Inject(apiUrl) private apiUrl: string;
  private addGoalUrl: string = apiUrl+"/goals/add";
  private goalsUrl: string = apiUrl+"/goals";

  httpOptions = {
    headers: new HttpHeaders({'Content-Type' : 'application/json'})
  }

  constructor(private http: HttpClient) { }

  //Add a new goal to the database
  addGoal(savingGoal: SavingGoal): Observable<SavingGoal>{
    console.log(apiUrl);
    console.log(this.addGoalUrl);
    return this.http.post<SavingGoal>(this.addGoalUrl, savingGoal, this.httpOptions)
            .pipe(tap(data => console.log(data)), catchError(this.handleError<SavingGoal>('addSavingGoal')));
  }

  getAllGoals(id: number) : Observable<SavingGoal[]>{
    return this.http.get<SavingGoal[]>(this.goalsUrl, this.httpOptions)
            .pipe(tap(data => console.log(data)), 
            catchError(this.handleError<SavingGoal[]>('getSavingGoals', [])));
  }

  parseDate(array) : string {
    let result: string = array[0] + "-";
    result += (array[1] >= 10) ? array[1] : ("0" + array[1]);
    result += "-";
    result += (array[2] >= 10) ? array[2] : ("0" + array[2]);
    return result;
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}



