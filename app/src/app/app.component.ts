import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private httpClient: HttpClient){};
  title = 'sagicor-lpr'
  plateNum : any;
  plateConfidence: any;
  displayElement = false;
  displayError = false;
  progress: number = 0;
  url: any;

  onFileUpload(event : any){
    const file = event.target.files[0];

    if(!file) {
      console.log("No file uploaded! ");
      return;
    }

    let reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);

		reader.onload = (_event) => {
			this.url = reader.result;
		}

    const formData = new FormData();
    formData.append("file", file);
    const upload$ = this.httpClient.post("http://localhost:3000/", formData);

    upload$.subscribe({
      next: (res: any)=>{
        console.log(res);
        if(res.plate) {
          this.displayElement = true;
          this.displayError = false
          this.plateNum = res.plate;
          this.plateConfidence = res.confidence.toFixed(2);
        }

      },
      error: (error)=>{
        this.displayError = true
        this.displayElement = false;
        console.log(error)
      }
    });

  }

}
