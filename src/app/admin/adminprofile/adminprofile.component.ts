import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/register.service';
import { Router } from '@angular/router';
import { RecentActionsService } from 'src/app/recent-actions.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.component.html',
  styleUrls: ['./adminprofile.component.css']
})
export class AdminprofileComponent implements OnInit {

  constructor(private router: Router, private registerService: RegisterService,private recentActionsService:RecentActionsService,private loginService:LoginService) { }

  ngOnInit() {
  }

  model: any = {
    username: '',
    password: '',
    isValid: false,
    isPasswordValid: true,
    isUsernameValid: true,
    usernameErrMsg: ''
  }

  private usernameLength = 6;
  private passwordPattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

  isUserNamePopulated() {
    const parent = this;
    if (parent.model.username.length < parent.usernameLength) {
      parent.model.usernameErrMsg = 'Invalid, Must have atleast 6 chars.';
      parent.model.isUsernameValid = false;
    } else {
      parent.model.isUsernameValid = true;
    }
    parent.enableDisabledFields();
  }

  validatePassword() {
    const parent = this;
    if (parent.passwordPattern.test(parent.model.password) == false) {
      parent.model.isPasswordValid = false;
    } else {
      parent.model.isPasswordValid = true;
    }
    parent.enableDisabledFields();
  }

  private enableDisabledFields() {
    const parent = this;
    parent.model.isValid = parent.model.isUsernameValid && parent.model.isPasswordValid
      && parent.model.username.length && parent.model.password.length;
      console.log(parent.model.isValid);
  }

  submitForm(dataObj) {
    if (this.model.isValid) {
      dataObj["role"] = "admin";
      this.registerService.addAdmin(dataObj).subscribe((res) => {
        if (res["message"] === "username already existed") {
          this.model.isValid = false;
          this.model.usernameErrMsg = 'Username already exists';
          this.model.isUsernameValid = false;
        }
        if (res["message"] === "registered successfully") {
          alert("added successfully");
          this.router.navigate(['/admindashboard']);
        }
      })
      let action ={};
      action['createdBy']=this.loginService.username;
        action['createdOn']=new Date();
        action['ActionDone']="Added Admin";
      this.recentActionsService.addAction(action).subscribe((res)=>{
        console.log("added recent action",res)
      })
    }
  }

  cancel() {
    this.router.navigate(['/admindashboard']);
  }
}

