import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private httpClient: HttpClient){};
  plateNum : any;
  plateConfidence: any;

  onFileUpload(event : any){
    const file = event.target.files[0];

    if(!file) {
      console.log("No file uploaded! ");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const upload$ = this.httpClient.post("http://localhost:3000/", formData);
    upload$.subscribe((response: any)=>{
      console.log(response)
      this.plateNum = response.plate;
      this.plateConfidence = response.confidence;
    });

  }

}
