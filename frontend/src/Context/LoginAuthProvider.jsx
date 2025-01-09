import React,{createContext, useState} from 'react'
import { Children } from 'react';



const AuthContext =createContext({});



export const  LoginAuthProvider =({children}) =>{
 const[auth, setAuth] = useState({});
 console.log(auth);
 console.log("shipping address is",auth.shippingAddress);
 return(
    <AuthContext.Provider value ={{auth, setAuth}}>
              {children}
    </AuthContext.Provider>

 )

}

export default AuthContext;
