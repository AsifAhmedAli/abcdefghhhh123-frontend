import { Component } from "react";
import './SignUp.css';
//import bcrypt from 'bcryptjs';
//import { Navigate} from "react-router-dom";
import withNavigateHook from '../AdminLogin/withNavigateHook';

class SignUp extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          fields: {
            fname:'',
            lname:'',
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
        if(!fields["fname"]){
            formIsValid = false;
            errors["fname"] = "Please provide firstname";
        }
        if (typeof fields["fname"] !== "undefined") {
            if (!fields["fname"].match(/^[a-zA-Z]+$/)) {
              formIsValid = false;
              errors["fname"] = "Only letters are allowed for firstname";
            }
          }
        if(!fields["lname"]){
            formIsValid = false;
            errors["lname"] = "Please provide lastname";
        }
        if (typeof fields["lname"] !== "undefined") {
            if (!fields["lname"].match(/^[a-zA-Z]+$/)) {
              formIsValid = false;
              errors["lname"] = "Only letters are allowed for lastname";
            }
          }
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
          try {
            const response =  await fetch('http://localhost:4000/adminAPI/newAdmin',{
              method: 'POST',
              body: JSON.stringify({
                // Add parameters here
                fname:this.state.fields.fname,
                lname:this.state.fields.lname,
                email : this.state.fields.email,
                password : this.state.fields.password
              }),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'x-access-token' : localStorage.getItem('jwtToken')
              },
            });
            const json =  await response.json();
            if(json.message === 'created'){
              this.setState({
                redirectToReferrer: true,
              });
              // setTimeout(function () {
              //   this.setState({
              //     redirectToReferrer: false,
              //   });
              // }, 10000)
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
      const successMsg = this.state.redirectToReferrer
        return(
            <form className="formSignUp" onSubmit={this.handleSubmit.bind(this)}>
            { this.state.redirectToReferrer && <div className="successDivCreate"> Admin created successfully</div>}
            <div className="fnameDiv">
              <label className="lblAdminLogin" htmlFor="text">First Name</label>
              <input 
              className="inpAdminLogin" 
              id="fname" 
              type="text" 
              value={this.state.fields["fname"]}
              onChange={this.handleChange.bind(this, "fname")}
              placeholder="Please enter first name"/>
              {/* {form.errorsEmail == true?( */}
          <div className='errorDiv' id="errorsFName">
            {this.state.errors["fname"]}
          </div>
        {/* ) : null} */}
            </div>
            <div className="lnameDiv">
              <label className="lblAdminLogin" htmlFor="text">Last Name</label>
              <input 
              className="inpAdminLogin" 
              id="lname" 
              type="text" 
              value={this.state.fields["lname"]}
              onChange={this.handleChange.bind(this, "lname")}
              placeholder="Please enter last name"/>
              {/* {form.errorsEmail == true?( */}
          <div className='errorDiv' id="errorsLName">
            {this.state.errors["lname"]}
          </div>
        {/* ) : null} */}
            </div>
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
          </form>
        );
    }
}
export default withNavigateHook(SignUp);