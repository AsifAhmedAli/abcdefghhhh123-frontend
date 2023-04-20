// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react'
import { Navigate, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
    let isLoggedIn=false;
  // Add your own authentication on the below line.
  if(localStorage.getItem('jwtToken')!='')
   isLoggedIn=true; 

//   return (
//     <Route
//       {...rest}
//       render={props =>
//         return isLoggedIn ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//         )
//       }
//     />
//   )
return (
    <Route {...rest} render={props => {
        if (!isLoggedIn) {
            // not logged in so redirect to login page with the return url
            return <Navigate to={{ pathname: '/AdminLogin', state: { from: props.location } }} />
        }

        // authorized so return component
        return <Component {...props} />
    }} />
);
}

export default PrivateRoute