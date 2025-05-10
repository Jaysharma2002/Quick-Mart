import React, { useState ,useEffect} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios'
import '../styles/Header.css';

function Header({ setSelectedcategory, searchedProduct, setSearchedProduct,addedToCart,productInCart,setProductInCart,selectedcategory,profileupdate}) {
    const [isSidebarvisible, setSidebarvisible] = useState(false); 
    const [showMessage,setShowMessage]=useState(false)
    const [profileShow,setProfileShow]=useState(false)
    const [profileImageURL,setProfileImageURL]=useState('')
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        const fetchimage=async()=>{
            const response=await axios.post("http://localhost:8000/api/product/profileimage",{},{withCredentials:true})
            setProfileImageURL(response.data)
            console.log(response.data)
        }
        fetchimage()
    },[])
    useEffect(()=>{
        const fetchimage=async()=>{
            const response=await axios.post("http://localhost:8000/api/product/profileimage",{},{withCredentials:true})
            setProfileImageURL(response.data)
            console.log(response.data)
        }
        if(profileupdate)
        {
            fetchimage()
        }
    },[profileupdate])
    useEffect(()=>{
        if(productInCart)
        {
            setShowMessage(true)
            setTimeout(()=>{setShowMessage(false);setProductInCart(false);},3000)
        }
    },[productInCart])

    useEffect(()=>{
        if(selectedcategory!=="All"){
            navigateTo('/home')
            setSidebarvisible(false)
        }
      },[selectedcategory])
  
    const handleSearch = (e) => {
        setSearchedProduct(e.target.value);
        navigate('/home')
    };

    const navigateTo = (path) => {
        navigate(path);
    };
    function logout(){
        axios.post('http://localhost:8000/api/product/logout',{},{withCredentials:true})
        setProfileShow(false)
        navigateTo('/')
    }
    function viewprofile(){
        navigateTo('/viewprofile')
    }
    return (
        <>
            <div className="Allheader">
                <div className="header">
                    <img src="images.png" className="logo" alt="Site Logo" />
                    <div className="searchbarcon">
                        <input type="text" className="searchbar" placeholder="Search something.." value={searchedProduct} onChange={handleSearch}/>
                    </div>
                    <div className="buttons">
                        <button onClick={()=>{setSelectedcategory("All");navigateTo('/home')}}><i className="fa-solid fa-house"> Home</i></button> 
                        <button onClick={() => navigateTo('/cart')} className="cart-btn"><i className="fa-solid fa-cart-shopping"> Cart</i><span className="badge">{addedToCart}</span></button>
                        <button onClick={()=> navigateTo('/order')}><i className="fa-solid fa-clipboard"> Orders</i></button>
                        <button onClick={() => {setSidebarvisible(true);setProfileShow(false)}}><i className="fa-solid fa-list"> Category</i> </button>
                        <div className="profilebutton-container">
                            <button onClick={()=>{setProfileShow(true);setSidebarvisible(false)}}>
                                <img src={profileImageURL ? `backend/${profileImageURL}` : "blank-profile.png"} className="profilebutton"/>
                            </button>
                            <div className={`profile ${profileShow ? 'visible' : 'hidden'}`}>
                                <button onClick={() => setProfileShow(false)} className='closebutton'>{"X"}</button>
                                <button onClick={() => {viewprofile(); setProfileShow(false)}} className='profileoption'><i className="fa-solid fa-user"></i></button>
                                <button onClick={() => {logout(); setProfileShow(false)}} className='profileoption'><i className="fa-solid fa-right-from-bracket"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`productincart ${showMessage?'visible':'hidden'}`}>
                    <p><i className="fa-solid fa-bell"></i>  Product Is Already In Cart</p>
                </div>
            </div>
            <div className={`navbar ${isSidebarvisible?'visible':'hidden'}`}>
                <button onClick={()=>setSidebarvisible(false)} className='closebutton'><i className="fa-solid fa-xmark">Close</i></button>
                <button onClick={()=>{setSelectedcategory("Beauty");}} className="categories">Beauty</button>
                <button onClick={()=>{setSelectedcategory("Fragrances");}} className="categories">Fragrances</button>
                <button onClick={()=>{setSelectedcategory("Furniture");}} className="categories">Furniture</button>
                <button onClick={()=>{setSelectedcategory("Groceries");}} className="categories">Groceries</button>
                <button onClick={()=>{setSelectedcategory("Home-Decoration");}} className="categories">Home Decoration</button>
                <button onClick={()=>{setSelectedcategory("Kitchen-Accessories");}} className="categories">Kitchen Accessories</button>
                <button onClick={()=>{setSelectedcategory("Laptops");}} className="categories">Laptops</button>
                <button onClick={()=>{setSelectedcategory("Mens-Shirts");}} className="categories">Men Shirts</button>
                <button onClick={()=>{setSelectedcategory("Mens-Shoes");}} className="categories">Men Shoes</button>
                <button onClick={()=>{setSelectedcategory("Men-Watches");}} className="categories">Mens Watches</button>
                <button onClick={()=>{setSelectedcategory("Mobile-Accessories");}} className="categories">Mobile Accessories</button>
                <button onClick={()=>{setSelectedcategory("Skin-Care");}} className="categories">Skin-Care</button>
                <button onClick={()=>{setSelectedcategory("Smartphones");}} className="categories">Smartphones</button>
                <button onClick={()=>{setSelectedcategory("Sport-Accessories");}} className="categories">Sports Accessories</button>
                <button onClick={()=>{setSelectedcategory("Sunglasses");}} className="categories">Sunglasses</button>
                <button onClick={()=>{setSelectedcategory("Tablets");}} className="categories">Tablets</button>
                <button onClick={()=>{setSelectedcategory("Tops");}} className="categories">Tops</button>
                <button onClick={()=>{setSelectedcategory("HandBags");}} className="categories">Womens Bags</button>
                <button onClick={()=>{setSelectedcategory("Dresses");}} className="categories">Womens Dresses</button>
                <button onClick={()=>{setSelectedcategory("Women-Shoes");}} className="categories">Womens Shoes</button>
                <button onClick={()=>{setSelectedcategory("Women-Watches");}} className="categories">Womens Watches</button>
            </div>
        </>
    );
}

export default Header;
