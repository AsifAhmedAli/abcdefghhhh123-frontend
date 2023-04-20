import { Component } from "react";
import './ResetPass.css';
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';
//import bcrypt from 'bcryptjs';
import axios from 'axios';

const loading = {
  margin: '1em',
  fontSize: '24px',
};
export function withRouter(Children){
  return(props)=>{

     const match  = {params: useParams()};
     return <Children {...props}  match = {match}/>
 }
}

class ResetPass extends Component{
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      updated: false,
      isLoading: true,
      error: false,
    };
  }
  async componentDidMount() {
    console.log(this.props.match.params.token);
    // const {
    //   match: {
    //     params: { token },
    //   },
    // } = this.props;
    try {
      const response =  await fetch('http://localhost:4000/adminAPI/reset',{
        method: 'POST',
        body: JSON.stringify({
          // Add parameters here
          resetPasswordToken: this.props.match.params.token,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const json =  await response.json();
      if(json.message === 'password reset link a-ok'){
        this.setState({
                email: json.username,
                updated: false,
                isLoading: false,
                error: false,
              });
      }
      // else{
      //   let errors = {};
      //   errors["password"] = "Incorrect credentials !!";
      //   this.setState({errors: errors});
      // }
    } catch (error) {
      this.setState({
            updated: false,
            isLoading: false,
            error: true,
          });
    } 
    // try {
    //   const response = await axios.get('http://localhost:3003/reset', {
    //     params: {
    //       resetPasswordToken: token,
    //     },
    //   });
    //   if (response.data.message === 'password reset link a-ok') {
    //     this.setState({
    //       username: response.data.username,
    //       updated: false,
    //       isLoading: false,
    //       error: false,
    //     });
    //   }
    // } catch (error) {
    //   console.log(error.response.data);
    //   this.setState({
    //     updated: false,
    //     isLoading: false,
    //     error: true,
    //   });
    // }
  }
  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };
  updatePassword = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    // const {
    //   match: {
    //     params: { token },
    //   },
    // } = this.props;
    try {
      const response =  await fetch('http://localhost:4000/adminAPI/checkUser',{
        method: 'POST',
        body: JSON.stringify({
          // Add parameters here
          email,
          password,
          resetPasswordToken: this.props.match.params.token,
          //email : this.state.fields.email
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'x-access-token' : localStorage.getItem('jwtToken')
        },
      });
      const json =  await response.json();
      if(json.message === 'user exists in db'){
        try {
            const responseUpdate =  await fetch('http://localhost:4000/adminAPI/UpdatePassword',{
                method: 'PUT',
                body: JSON.stringify({
                // Add parameters here
                email : this.state.email,
                password : this.state.password
                }),
                headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'x-access-token' : localStorage.getItem('jwtToken')
                },
            });
            const jsonUpdate =  await responseUpdate.json();
            if(jsonUpdate.message == 'password updated'){
              this.setState({
                      updated: true,
                      error: false,
                    });
            } 
            else {
                    this.setState({
                      updated: false,
                      error: true,
                    });
            }
        } catch (error) {
        console.log(error);
        }
      }
      else{
        this.setState({
          updated: false,
          isLoading: false,
          error: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
    // try {
    //   const response = await axios.put(
    //     'http://localhost:3003/updatePasswordViaEmail',
    //     {
    //       username,
    //       password,
    //       resetPasswordToken: token,
    //     },
    //   );
    //   console.log(response.data);
    //   if (response.data.message === 'password updated') {
    //     this.setState({
    //       updated: true,
    //       error: false,
    //     });
    //   } else {
    //     this.setState({
    //       updated: false,
    //       error: true,
    //     });
    //   }
    // } catch (error) {
    //   console.log(error.response.data);
    // }
  };
  render() {
    const {password, error, isLoading, updated } = this.state;

    if (error) {
      return (
        <div>
          <div style={loading}>
          <h4>Problem resetting password. Please send another reset link.</h4>
          <a href="/AdminLogin" className="loginReset">Login</a>
          <a href="/ForgotPassword" className="forgotReset" >Forgot Password</a>
          {/* <button className="btnResetSubmit" type="submit">Go Home</button>
          <button className="btnResetSubmit" type="submit">Forgot Password</button> */}
          </div>
        </div>
        // <div>
        //   <HeaderBar title={title} />
        //   <div style={loading}>
        //     <h4>Problem resetting password. Please send another reset link.</h4>
        //     <LinkButtons
        //       buttonText="Go Home"
        //       buttonStyle={homeButton}
        //       link="/"
        //     />
        //     <LinkButtons
        //       buttonStyle={forgotButton}
        //       buttonText="Forgot Password?"
        //       link="/forgotPassword"
        //     />
        //   </div>
        // </div>
      );
    }
    if (isLoading) {
      return (
        <div>
          <div style={loading}>Loading User Data...</div>
        </div>
      );
    }
    return (
      <div>
        <form className="password-form" onSubmit={this.updatePassword}>
          {/* <TextField
            style={inputStyle}
            id="password"
            label="password"
            onChange={this.handleChange('password')}
            value={password}
            type="password"
          /> */}
          <div className="passDiv">
              <label className="lblAdminLogin" htmlFor="password">Password</label>
              <input 
              className="inpAdminLogin" 
              id="password" type="password" 
              value={password}
              onChange={this.handleChange("password")}
              placeholder="Please enter password"/>
              {/* {form.errorsPass==true? ( */}
          {/* <div className='errorDiv' id="errorsPass">
            {this.state.errors["password"]}
          </div> */}
         {/* ) : null} */}
            </div>
            <button className="btnResetSubmit" type="submit">Change Password</button>
          {/* <SubmitButtons
            buttonStyle={updateButton}
            buttonText="Update Password"
          /> */}
        </form>

        {updated && (
          <div className="successDivReset">
            <div>
              Your password has been successfully reset, please try logging in
              again.
            </div>
            {/* <LinkButtons
              buttonStyle={loginButton}
              buttonText="Login"
              link="/login"
            /> */}
            {/* <button className="btnLogin" type="submit">Login</button> */}
            <a href="/AdminLogin" >Go back to Login</a>
          </div>
        )}
        {/* <LinkButtons buttonText="Go Home" buttonStyle={homeButton} link="/" /> */}
      </div>
    );
  }
}
export default withRouter(ResetPass);
// ResetPass.propTypes = {
//   // eslint-disable-next-line react/require-default-props
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       token: PropTypes.string.isRequired,
//     }),
//   }),
// };