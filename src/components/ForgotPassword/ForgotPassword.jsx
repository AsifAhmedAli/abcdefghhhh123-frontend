import { Component } from "react";
import './ForgotPassword.css';
//import bcrypt from 'bcryptjs';
//import axios from 'axios';

class ForgotPassword extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          fields: {
            email:'',
          },
          errors: {},
          messageFromServer: '',
        };
      }
    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        //Email
        if(!fields["email"]){
            formIsValid = false;
            errors["email"] = "Please provide email id";
        }
        if (typeof fields["email"] !== "undefined") {
          let lastAtPos = fields["email"].lastIndexOf("@");
          let lastDotPos = fields["email"].lastIndexOf(".");
    
          if (
            !(
              lastAtPos < lastDotPos &&
              lastAtPos > 0 &&
              fields["email"].indexOf("@@") === -1 &&
              lastDotPos > 2 &&
              fields["email"].length - lastDotPos > 2
            )
          ) {
            formIsValid = false;
            errors["email"] = "Email is not valid";
          }
        }
        this.setState({errors: errors});
        return formIsValid;
        }
      handleChange(field, e) {
        //this.handleValidation();
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
      }
      sendEmail = async (e) => {
        e.preventDefault();
        if(this.handleValidation()){
          //CHECK IF THE USER EXISTS
          try {
              const response =  await fetch('http://localhost:4000/forgotPassAPI/checkUser',{
                method: 'POST',
                body: JSON.stringify({
                  // Add parameters here
                  email : this.state.fields.email
                }),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                  'x-access-token' : localStorage.getItem('jwtToken')
                },
              });
              const json =  await response.json();
              if(json.message == 'valid data'){
                  try {
                      const jsonUpdate =  await fetch('http://localhost:4000/forgotPassAPI/forgotPassword',{
                          method: 'PUT',
                          body: JSON.stringify({
                          // Add parameters here
                          email : this.state.fields.email
                          }),
                          headers: {
                          'Content-type': 'application/json; charset=UTF-8',
                          'x-access-token' : localStorage.getItem('jwtToken')
                          },
                      }).then(response => {
                      // .then(data =>{
                        if(response.status == 200){
                          //redirect here
                          this.setState({
                            messageFromServer: 'recovery email sent',
                          });
                      }
                      else{
                          let errors = {};
                          errors["email"] = "Error! Please try again !";
                          this.setState({errors: errors});
                      }
                      })
                  } catch (error) {
                  console.log(error);
                  }
              }
              else{
                let errors = {};
                errors["email"] = "Email doesn't exist !!";
                this.setState({errors: errors});
              }
            } catch (error) {
              console.log(error);
            }  
          }
          // try {
          //   const response = await axios.post(
          //     'http://localhost:4000/testAPI',
          //     {
          //       email:this.state.fields.email,
          //     },
          //   );
          //   console.log(response.data);
          //   if (response.data === 'recovery email sent') {
          //     this.setState({
          //       showError: false,
          //       messageFromServer: 'recovery email sent',
          //     });
          //   }
          // } catch (error) {
          //   console.error(error.response.data);
          //   if (error.response.data === 'email not in db') {
          //     this.setState({
          //       showError: true,
          //       messageFromServer: '',
          //     });
          //   }
          // }
        }
        //}
      //};
      //On submitting the form
      //  async handleSubmit(e){
      //   e.preventDefault();
      //   if(this.handleValidation()){
      //       try {
      //           const response =  await fetch('http://localhost:4000/testAPI',{
      //             method: 'POST',
      //             body: JSON.stringify({
      //               // Add parameters here
      //               username : this.state.fields.email,
      //               password : this.state.fields.OldPassword
      //             }),
      //             headers: {
      //               'Content-type': 'application/json; charset=UTF-8',
      //             },
      //           });
      //           const json =  await response.json();
      //           if(json.message == 'valid data'){
      //               try {
      //                   const responseUpdate =  await fetch('http://localhost:4000/testAPI',{
      //                       method: 'PUT',
      //                       body: JSON.stringify({
      //                       // Add parameters here
      //                       username : this.state.fields.email,
      //                       oldpassword : this.state.fields.OldPassword,
      //                       newPassword: this.state.fields.newPassword
      //                       }),
      //                       headers: {
      //                       'Content-type': 'application/json; charset=UTF-8',
      //                       },
      //                   });
      //                   const jsonUpdate =  await responseUpdate.json();
      //                   if(jsonUpdate.message == 'updated'){
      //                       //redirect here
      //                       this.state.fields.email='';
      //                       this.state.fields.OldPassword='';
      //                       this.state.fields.newPassword='';
      //                       alert("success");
      //                   }
      //                   else{
      //                       let errors = {};
      //                       errors["newPassword"] = "Error! Please try again !";
      //                       this.setState({errors: errors});
      //                   }
      //               } catch (error) {
      //               console.log(error);
      //               }
      //           }
      //           else{
      //             let errors = {};
      //             errors["password"] = "Incorrect credentials !!";
      //             this.setState({errors: errors});
      //           }
      //         } catch (error) {
      //           console.log(error);
      //         }  
      //       }
      //   else{
      //     return
      //   }   
      // }
    render(){
      const messageFromServer = this.state.messageFromServer;
        return(
            <form id="resetForm" onSubmit={this.sendEmail}>
            <div className="userDiv">
              <label className="lblAdminLogin" htmlFor="text">Email ID</label>
              <input 
              className="inpAdminLogin" 
              id="email" 
              type="text" 
              value={this.state.fields["email"]}
              onChange={this.handleChange.bind(this, "email")}
              placeholder="Please enter email id"/>
          <div className='errorDiv' id="errorsEmail">
            {this.state.errors["email"]}
          </div>
            </div>
            {/* <div className="passDiv">
              <label className="lblAdminLogin" htmlFor="password">Old Password</label>
              <input 
              className="inpAdminLogin" 
              id="oldPassword" type="password" 
              value={this.state.fields["OldPassword"]}
              onChange={this.handleChange.bind(this, "OldPassword")}
              placeholder="Please enter password"/>
          <div className='errorDiv' id="errorsPass">
            {this.state.errors["OldPassword"]}
          </div>
            </div>
            <div className="passDiv">
              <label className="lblAdminLogin" htmlFor="password">New Password</label>
              <input 
              className="inpAdminLogin" 
              id="newPassword" type="password" 
              value={this.state.fields["newPassword"]}
              onChange={this.handleChange.bind(this, "newPassword")}
              placeholder="Please enter password"/>
          <div className='errorDiv' id="errorsPass">
            {this.state.errors["newPassword"]}
          </div>
            </div> */}
            <button className="btnResetSubmit" type="submit">Reset Password</button>
            {messageFromServer === 'recovery email sent' && (
              <div className="successDivEmail">
                <h3>Password Reset Email Successfully Sent!</h3>
              </div>
            )}
            <a href="/AdminLogin" className="btnReset">Back to Login</a>
          </form>
        );
    }
}
export default ForgotPassword;