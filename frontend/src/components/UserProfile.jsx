import React,{useState,useEffect} from "react";
import axios from "axios";
import '../styles/UserProfile.css'
function UserProfile({setProfileUpdate})
{
    const [editData,setEditData]=useState({
        profileimage:'',
        name:'',
        email:'',
        address:'',
        phone:'',
        gender:'',
        age:''
    })
    const [selectedImage,setSelectedImage]=useState(null)
    useEffect(()=>{
        const fetch=async()=>{
            const response=await axios.post("http://localhost:8000/api/product/userprofile",{},{withCredentials:true})
            console.log(response.data)
            setEditData({
                profileimage:response.data.profileimage || '',
                name:response.data.name || '',
                email:response.data.email || '',
                address:response.data.address || '',
                phone:response.data.phone || '',
                gender:response.data.gender || '',
                age:response.data.age || ''
            })
        }
        fetch()
        window.scrollTo(0,0)
    },[])
    function InputHandler(e){
        const {name,value}=e.target
        setEditData((prevState)=>({
            ...prevState,
            [name]:value,
        }))
    }
    function ImageHandler(e){
        setSelectedImage(e.target.files[0])
    }
    const submit=async()=>{
        const formdata=new FormData()
        if(selectedImage){
            formdata.append("profileimage",selectedImage)
        }
        formdata.append("name",editData.name)
        formdata.append("email",editData.email)
        formdata.append("address",editData.address)
        formdata.append("phone",editData.phone)
        formdata.append("gender",editData.gender)
        formdata.append("age",editData.age)
        const response=await axios.post("http://localhost:8000/api/product/updateprofile",formdata,{withCredentials:true,headers:{"Content-Type":"multipart/form-data"}})
        console.log(response.data)
        setEditData({
            profileimage:response.data.profileimage || '',
            name:response.data.name || '',
            email:response.data.email || '',
            address:response.data.address || '',
            phone:response.data.phone || '',
            gender:response.data.gender || '',
            age:response.data.age || ''
        })
        setProfileUpdate(true)
    }
    return(
        <div className="Allcontainer">
        <div className="userprofile">
            <h1 className="headertitle">User Profile</h1>
            {editData.profileimage===""?(<img src="blank-profile.png" className="profileimage"/>):(<img src={`backend/${editData.profileimage}`} className="profileimage"/>)}
            <div className="borderline">
                <label>Photo:</label>
                <input type="file" accept="image/*" onChange={ImageHandler}/>
            </div>
            <div className="borderline">
                <label>Name:</label>
                <input type="text" name="name" value={editData.name} onChange={InputHandler}/>
            </div>
            <div className="borderline">
                <label>Email:</label>
                <input type="text" name="email" value={editData.email} onChange={InputHandler}/>
            </div>
            <div className="borderline">
                <label>Address:</label>
                <input type="text" name="address" value={editData.address} onChange={InputHandler}/>
            </div>
            <div className="borderline">
                <label>Phone No:</label>
                <input type="text" name="phone" value={editData.phone} onChange={InputHandler}/>
            </div>
            <div className="borderline">
                <label>Gender:</label>
                <input type="text" name="gender" value={editData.gender} onChange={InputHandler}/>
            </div>
            <div className="borderline">
                <label>Age:</label>
                <input type="text" name="age" value={editData.age} onChange={InputHandler}/>
            </div>
            <button onClick={()=>submit()} className="savedetails">Submit</button>
        </div>
        </div>
    )
}

export default UserProfile