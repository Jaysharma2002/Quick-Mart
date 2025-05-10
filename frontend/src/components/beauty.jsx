import React,{useEffect,useState} from 'react'
import '../styles/beauty.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Beauty({selectedcategory,setProducts,searchedProduct,setAddedtocart,addedToCart,setProductInCart,setData,data,setProductId}){
    
    const [isImage,setIsImage]=useState(true)
    const navigate=useNavigate()
    useEffect(() => {
        console.log(selectedcategory);
        const fetch=async()=>{
            await axios.get("http://localhost:8000/api/product/fetch").then((response) => {
                const products=response.data
                const filteredItems =products.filter((item)=>{
                    const categoryfiltereditem=selectedcategory?.toLowerCase()==="all" || item.category.toLowerCase()===selectedcategory.toLowerCase()
                    const searchfiltereditems=searchedProduct?.toLowerCase()==="" || item.title.toLowerCase().includes(searchedProduct.toLowerCase())
                    return categoryfiltereditem && searchfiltereditems
                })
                if(filteredItems.length===0){
                    setData([]);
                }
                else{
                    setData(filteredItems);
                }
                
            });
        }
        fetch();
    }, [selectedcategory,searchedProduct]);
    
    function addtocart(e){
        setProducts(prevproducts=>{
            const isProductIn=prevproducts.some(product=>product._id===e._id)
            if(!isProductIn){
                setAddedtocart(addedToCart+1)
                return [...prevproducts,e];
            }
            else{
                setProductInCart(true)
            }
            return prevproducts;
        })
    }
        const images = ["mobile.jpg", "grocery.png","clothes.png","kitchen.png","furniture.png"];
        const [curr, setCurr] = useState(0); // Initial index set to 0
    
        function previmage() {
            setCurr((prev) => (prev === 0 ? images.length - 1 : prev - 1)); // Loop to the last image when at the first one
        }
    
        function nextimage() {
            setCurr((prev) => (prev === images.length - 1 ? 0 : prev + 1)); // Loop to the first image when at the last one
        }
        useEffect(()=>{
            if(selectedcategory!=="All" || searchedProduct!=="")
            {
                setIsImage(false)
            }
            else{
                setIsImage(true)
            }
        },[selectedcategory,searchedProduct])

    return(
        <>
        <div className={`image-container ${isImage?'visible':'hidden'}`}>
            <button onClick={previmage} className="prev"><i className="fa-solid fa-left-long"></i></button>
            <img src={images[curr]} alt="carousel" className='slideimage'/>
            <button onClick={nextimage} className="next"><i className="fa-solid fa-right-long"></i></button>
        </div>
        <div className="content">
            {Array.isArray(data) && data.length>0?(data.map((e)=>
            <div key={e._id} className="card" onClick={()=>{setProductId(e._id);navigate('/productcomponent')}}>
                <div className='img-container'>
                    <img src={e.images[0]} ></img>
                </div>
                <p><span className="head">Name</span>:{e.title}</p>
                <p className="desc"><span className="head">Description</span>:{e.description}</p>
                <p><span className="head">Price</span>: ₹{e.price}</p>
                <p><span className="head">Rating</span>:{e.reviews.length>0?((()=>{const totalRating=e.reviews.reduce((sum,review)=>sum+review.rating,0)
                                                                                  const averageRating=(totalRating/e.reviews.length).toFixed(1)
                                                                                  return `${averageRating}`})()):(<span>NA</span>)}/5</p>
                {e.sizes[0].quantity>0?(
                    <button className="add" onClick={(event)=>{event.stopPropagation();addtocart(e)}}><i className="fa-solid fa-cart-plus">Add to Cart</i></button>
                ):(
                    <button className="outofstock" disabled={true}><i className="fa-solid fa-cart-plus">Out Of Stock</i></button>
                )}
            </div>)):(<h1>No Product Found</h1>)}
        </div>
        </>
    )
}

export default Beauty; 