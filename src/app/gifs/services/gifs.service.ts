import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apikey:       string = 'aaJIK4IxBmnEi1SodjYqM4dHsnQHMeHO';
  private serviceUrl:   string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready')
   }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizedHistory(tag: string) {
    tag = tag.toLowerCase();

    if ( this._tagsHistory.includes(tag) ){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag )
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();

  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify( this._tagsHistory ));
  }

  private loadLocalStorage():void {
    if( !localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );

    if( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0] );


    // 2.
    // if( localStorage.getItem('history')) {
    //   //Tenemos Data
    // }
    // 1.
    // const temporal = localStorage.getItem('history');

  }

  searchTag( tag: string ): void {
    if ( tag.length === 0 ) return;
    this.organizedHistory(tag);

    const params = new HttpParams()
      .set( 'api_key', this.apikey )
      .set( 'limit', '10' )
      .set( 'q', tag )

    // ¡¡USAR!! opcion3 http.get:
    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params } )
      .subscribe( resp => {

        this.gifList = resp.data;
        // console.log({ gifs: this.gifList });


        // 2. mostrar resp:
        // console.log(resp);
        // console.log(resp.data);
        // Buscar data en interfaz 1:
        // .subscribe( (resp:SearchResponse) => {
        // console.log(resp.data[0].images.fixed_height);

      } );


    // op2 get http async promise
    // const res = await fetch ('https://api.giphy.com/v1/gifs/search?api_key=aaJIK4IxBmnEi1SodjYqM4dHsnQHMeHO&q=sonic&limit=20');
    // const data = await Response.json();
    // console.log(data);
    // op1 get http async promise
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=aaJIK4IxBmnEi1SodjYqM4dHsnQHMeHO&q=sonic&limit=20')
    //   .then( resp => resp.json() )
    //   .then( data => console.log(data) );

  }

}
