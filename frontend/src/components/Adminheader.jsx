import React from "react";
import { useNavigate,useLocation } from "react-router-dom";
function Adminheader({selectedCategory,setSelectedCategory,searchProduct,setSearchProduct}){
    const navigate=useNavigate()
    const location=useLocation()
    function logout(){
        navigate("/")
    }
    const handleOption=async(e)=>{
        setSelectedCategory(e.target.value)
        navigate("/admin")
    }
    function navigateOrder(){
        navigate("/adminorder")
    }
    function navigateAdmin(){
        navigate("/admin")
    }
    if(location.pathname==="/viewprofile" ||location.pathname==="/productcomponent" || location.pathname==="/home" || location.pathname === "/" || location.pathname==="/cart" || location.pathname==="/Payment" || location.pathname==="/thankyou" || location.pathname==='/register' || location.pathname==='/order')
    {
        return null;
    }
    return(
        <div className="adminheader" style={{width:'98%'}}>
            <div className="headtitle">
                <img src="images.png" style={{height:'70px',width:'300px'}}></img>
                <input type="text" placeholder="Search Something" value={searchProduct} onChange={(e) => {setSearchProduct(e.target.value);navigate("/admin")}}/>
            </div>
            <div className="rest">
            
            <div className="buttons">
                <button onClick={()=>{setSelectedCategory("All");navigateAdmin();}}><i className="fa-solid fa-house"> Home</i></button>
                <button onClick={navigateOrder}><i className="fa-solid fa-clipboard"> Orders</i></button>
            </div>
            <select value={selectedCategory} onChange={handleOption} className="option">
                <option value="All">All</option>
                <option value="Beauty">Beauty</option>
                <option value="Fragrances">Fragrances</option>
                <option value="Furniture">Furniture</option>
                <option value="Groceries">Groceries</option>
                <option value="Home-Decoration">Home-Decoration</option>
                <option value="Kitchen-Accessories">Kitchen-Accessories</option>
                <option value="Laptops">Laptops</option>
                <option value="Mens-Shirts">Mens-Shirts</option>
                <option value="Mens-Shoes">Men-Shoes</option>
                <option value="Men-Watches">Men-Watches</option>
                <option value="Mobile-Accessories">Mobile-Accessories</option>
                <option value="Skin-Care">Skin-Care</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Sport-Accessories">Sport-Accessories</option>
                <option value="Sunglasses">Sunglasses</option>
                <option value="Tablets">Tablets</option>
                <option value="Tops">Tops</option>
                <option value="HandBags">Womens-Bags</option>
                <option value="Dresses">Womens-Dresses</option>
                <option value="Women-Shoes">Womens-Shoes</option>
                <option value="Women-Watches">Womens-Watches</option>
                
            </select>
            <div className="buttons">
                <button onClick={logout}><i className="fa-solid fa-right-from-bracket"> Log-Out</i></button>
            </div>
            </div>
        </div>
    )

}

export default Adminheader