import { Component } from "react";
import './AdminLogin.css';
//import bcrypt from 'bcryptjs';
//import { Navigate} from "react-router-dom";
import withNavigateHook from './withNavigateHook';

class AdminLogin extends Component{
    constructor(props) {
        super(props); 
        this.state = {
          fields: {
            email:'',
            password:'',
          },
          errors: {},
          redirectToReferrer:false,
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
        if(!fields["password"]){
            formIsValid = false;
            errors["password"] = "Please provide password";
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
    async handleSubmit(e){        
      e.preventDefault();
      if(this.handleValidation()){
        // const hashedPassword = bcrypt.hashSync(this.state.fields["password"],10);
        // console.log(hashedPassword);
        try {
          const response =  await fetch('http://localhost:4000/testAPI',{
            method: 'POST',
            body: JSON.stringify({
              // Add parameters here
              email : this.state.fields.email,
              password : this.state.fields.password
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
          });
          const jsonData =  await response.json();
          console.log(jsonData,"jsonData")
          if(jsonData.message == 'valid data'){
            console.log(jsonData.token);
            localStorage.setItem('jwtToken', jsonData.token);
            this.props.navigation('/Location');
          }
          else{
            let errors = {};
            errors["password"] = "Incorrect credentials !!";
            this.setState({errors: errors});
          }
        } catch (error) {
          console.log(error);
        } 
        // finally {
        //   this.setState({isLoading: false});
        // }
      }
      else{
        return
      }
  
    }
    render(){
        return(
            <form className="formLogin" onSubmit={this.handleSubmit.bind(this)}>
            <div className="userDiv">
              <label className="lblAdminLogin" htmlFor="text">Email ID</label>
              <input 
              className="inpAdminLogin" 
              id="email" 
              type="text" 
              value={this.state.fields["email"]}
              onChange={this.handleChange.bind(this, "email")}
              placeholder="Please enter email id"/>
              {/* {form.errorsEmail == true?( */}
          <div className='errorDiv' id="errorsEmail">
            {this.state.errors["email"]}
          </div>
        {/* ) : null} */}
            </div>
            <div className="passDiv">
              <label className="lblAdminLogin" htmlFor="password">Password</label>
              <input 
              className="inpAdminLogin" 
              id="password" type="password" 
              value={this.state.fields["password"]}
              onChange={this.handleChange.bind(this, "password")}
              placeholder="Please enter password"/>
              {/* {form.errorsPass==true? ( */}
          <div className='errorDiv' id="errorsPass">
            {this.state.errors["password"]}
          </div>
         {/* ) : null} */}
            </div>
            <button className="btnSubmit" type="submit">Submit</button>
            <a href="/ForgotPassword" className="btnReset">Forgot Password ?</a>
          </form>
        );
    }
}
export default withNavigateHook(AdminLogin);