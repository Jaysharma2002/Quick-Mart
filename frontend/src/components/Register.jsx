import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
function Register(){
    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    
    const navigate=useNavigate()
    function login(){
        axios.post('http://localhost:8000/api/product/createuser',{
            name,email,password
        })
        .then((result)=>{
            console.log(result)
            navigate('/')
        }
    )    
    }
    function signin(){
        navigate('/')
    }

    return (
        <div className="All">
            <div className="Login">
                
                    <h1>Register</h1>
                    <div className="changelogin">
                        <div className="userlogin">
                            <input type="text" name="name" placeholder="Enter Name" autoComplete="off" onChange={(e)=>setName(e.target.value)}></input>
                            <input type="text" name="email" placeholder="Enter Email" autoComplete="off" onChange={(e)=>setEmail(e.target.value)}></input>
                            <input type="password" name="password" placeholder="Enter Password" autoComplete="off" onChange={(e)=>setPassword(e.target.value)}></input>
                            <button onClick={login}>Register</button>
                            <div className="already">
                                <label style={{color:'black'}}>Already Have An Account?</label>
                                <button onClick={signin}>Login</button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )

}

export default Register