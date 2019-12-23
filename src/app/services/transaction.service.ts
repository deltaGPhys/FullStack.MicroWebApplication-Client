import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'; export const apiUrl = environment.apiUrl;

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Transaction } from '../models/Transaction';


@Injectable({ providedIn: 'root' })
export class TransactionService {
    
    @Inject(apiUrl) private apiUrl: string;
    private transactionsUrl: string = apiUrl+"/transactions";
    transTypes: string[] = []; 

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { 
        this.refreshTransTypes();
    }



    /** GET Transactions from the server */
    getTransactions (): Observable<Transaction[]> {
        
        return this.http.get<Transaction[]>(this.transactionsUrl)
            .pipe(
                tap(_ => console.log('fetched Transactions')),
                catchError(this.handleError<Transaction[]>('getTransactions', []))
            );
    }

    /** GET Transaction types from the server */
    getTransTypes (): Observable<string[]> {
      return this.http.get<string[]>(apiUrl+"/transactiontypes")
            .pipe(
                tap(_ => console.log('fetched Transactions')),
                catchError(this.handleError<string[]>('getTransactions', []))
            );
    }

    /** GET Transaction types from the server */
    refreshTransTypes (): void {
        const promise = this.http.get(apiUrl+"/transactiontypes").toPromise();
          
        promise.then((data)=>{
        let respData: Object = data;
        
        for (let i=0; i < Object.keys(respData).length;i++)  {
            this.transTypes.push(respData[i]);
        }
        console.log('ref');
        }).catch((error)=>{
        console.log("Promise rejected with " + JSON.stringify(error));
        });
    }

//   /** GET Transaction by id. Return `undefined` when id not found */
//   getTransactionNo404<Data>(id: number): Observable<Transaction> {
//     const url = `${this.TransactionesUrl}/?id=${id}`;
//     return this.http.get<Transaction[]>(url)
//       .pipe(
//         map(Transactiones => Transactiones[0]), // returns a {0|1} element array
//         tap(h => {
//           const outcome = h ? `fetched` : `did not find`;
//           this.log(`${outcome} Transaction id=${id}`);
//         }),
//         catchError(this.handleError<Transaction>(`getTransaction id=${id}`))
//       );
//   }

//   /** GET Transaction by id. Will 404 if id not found */
//   getTransaction(id: number): Observable<Transaction> {
//     const url = `${this.TransactionesUrl}/${id}`;
//     return this.http.get<Transaction>(url).pipe(
//       tap(_ => this.log(`fetched Transaction id=${id}`)),
//       catchError(this.handleError<Transaction>(`getTransaction id=${id}`))
//     );
//   }

//   /* GET Transactiones whose name contains search term */
//   searchTransactiones(term: string): Observable<Transaction[]> {
//     if (!term.trim()) {
//       // if not search term, return empty Transaction array.
//       return of([]);
//     }
//     return this.http.get<Transaction[]>(`${this.TransactionesUrl}/?name=${term}`).pipe(
//       tap(_ => this.log(`found Transactiones matching "${term}"`)),
//       catchError(this.handleError<Transaction[]>('searchTransactiones', []))
//     );
//   }

//   //////// Save methods //////////

  /** POST: add a new Transaction to the server */
  addTransaction (transaction: Transaction): Observable<Transaction> {
    console.log(transaction.comment);
    console.log("transaction.comment");
    console.log(transaction.amount);
    transaction.id = null;
    transaction.account = null;
    console.log(transaction);
    
    return this.http.post<Transaction>(this.transactionsUrl, transaction, this.httpOptions).pipe(
      tap((newTransaction: Transaction) => console.log(`added Transaction w/ id=${newTransaction.id}`)),
      catchError(this.handleError<Transaction>('addTransaction'))
    );
  }

//   /** DELETE: delete the Transaction from the server */
//   deleteTransaction (Transaction: Transaction | number): Observable<Transaction> {
//     const id = typeof Transaction === 'number' ? Transaction : Transaction.id;
//     const url = `${this.TransactionesUrl}/${id}`;

//     return this.http.delete<Transaction>(url, this.httpOptions).pipe(
//       tap(_ => this.log(`deleted Transaction id=${id}`)),
//       catchError(this.handleError<Transaction>('deleteTransaction'))
//     );
//   }

//   /** PUT: update the Transaction on the server */
//   updateTransaction (Transaction: Transaction): Observable<any> {
//     return this.http.put(this.TransactionesUrl, Transaction, this.httpOptions).pipe(
//       tap(_ => this.log(`updated Transaction id=${Transaction.id}`)),
//       catchError(this.handleError<any>('updateTransaction'))
//     );
//   }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log('error');
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
