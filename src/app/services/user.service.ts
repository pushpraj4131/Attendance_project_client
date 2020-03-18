import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public _http: HttpClient) { }
  getAllUsers(){
  	var body = {
  		'branch' : localStorage.getItem('branchSelected')
  	}
  	return this._http.post( config.baseApiUrl+"user/get-users" , body);	
  }
  
  getUserById(id){
  	return this._http.get( config.baseApiUrl+"user/get-user-by-id/"+id);	
  }

  getEditById(id, value){
    console.log("the service data is: ", id, value);
    return this._http.put( config.baseApiUrl+"user/update-user-by-id/"+id,value);  
  }

  adminAddEmployee(value){
    console.log("the service data is: ", value);
    return this._http.post( config.baseApiUrl+"user/signup", value);  
  }

  adminDelEmployee(id){
    // console.log("the service del id is:", id);
    return this._http.delete( config.baseApiUrl+"user/delete-user-by-id/"+id);  
  }
}
