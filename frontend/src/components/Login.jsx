import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
function Login({setUserId}) {
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const [incorrect,setIncorrect]=useState(false)
    const [isUserlogin,setIsUserlogin]=useState(true)
    const [admin,setAdmin]=useState()
    const [adminPass,setAdminPass]=useState()
    const navigate=useNavigate();
    function usersignin(){
        axios.post('http://localhost:8000/api/product/signin',{
            email,
            password,
        },{withCredentials:true}).then(result=>{
            console.log(result)
            if(result.data.message==="Success")
            {
                setUserId(result.data.uid);
                navigate("/home");
                
            }
            else{
                console.log("setIncorect is being updated");
                setIncorrect(true)
            }
        })
        .catch(error => {
            console.error("Error from API:", error);
            setIncorrect(true);
        });   
    }
    function adminsignin(){
        if(admin==="admin" && adminPass==="admin")
        {
            navigate("/admin");
        }
        else{
            setIncorrect(true);
        }
    }
    function register(){
        navigate("/register");
    }

    useEffect(()=>{
        if(incorrect)
        {
            setTimeout(()=>{setIncorrect(false)},1000)
        }
    },[incorrect])

    return (
        <div className="All">
        <div className="Login">
            <h1>SignIn</h1>
            <div className='changelogin'>
            <div className='switch'>
                <button onClick={()=>setIsUserlogin(true)}>User</button>
                <button onClick={()=>setIsUserlogin(false)}>Admin</button>
            </div>
            {isUserlogin?
            (<div className='userlogin'>
                <input type="text" placeholder='Email' name="email" onChange={(e)=>setEmail(e.target.value)}></input>
                <input type="password" placeholder='Password' name="password" onChange={(e)=>setPassword(e.target.value)}></input>
                <div className={`incorrectmessage ${incorrect?'visibilityon':'visibilityoff'}`}>
                    <span>Incorect Email or Password</span>
                </div>
                <div className="displayflex">
                    <button onClick={register}><i className="fa-solid fa-registered"></i>Register</button>
                    <button onClick={usersignin}><i className="fa-solid fa-user"></i>SignIn</button>
                </div>
            </div>
            ):
            (<div className='userlogin'>
                <input type="text" placeholder='Admin-name' onChange={(e)=>setAdmin(e.target.value)}></input>
                <input type="password" placeholder='Password' onChange={(e)=>setAdminPass(e.target.value)}></input>
                <div className={`incorrectmessage ${incorrect?'visibilityon':'visibilityoff'}`}>
                    <span>Incorect Email or Password</span>
                </div>
                <button onClick={adminsignin}><i className="fa-solid fa-user"></i>SignIn</button>
            </div>)}
            </div>
            </div>
        </div>
    );
}

export default Login;
