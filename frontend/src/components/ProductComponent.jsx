import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ProductComponent.css'
function ProductComponent({data,productId,setProductInCart,setProducts,setAddedtocart,addedToCart})
{
    const navigate=useNavigate()
    const [currProduct,setCurrProduct]=useState(null)
    const [imageIndex,setImageIndex]=useState(0)
    const [reviewIndex, setReviewIndex] = useState(0);

    useEffect(()=>{
        if(!productId)
        {
            navigate('/home')
        }
        else{
            setCurrProduct(data.find((product)=>product._id===productId))
            setImageIndex(0)
            setReviewIndex(0);
        }
    },[data,productId])
    useEffect(()=>{
        console.log(currProduct)
    },[currProduct])
    function imageleft()
    {
        if(currProduct?.images?.length>0)
        {
            setImageIndex((prevIndex)=>prevIndex===0?currProduct.images.length-1:prevIndex-1)
        }
    }
    function imageright()
    {
        if(currProduct?.images?.length>0)
        {
            setImageIndex((prevIndex)=>prevIndex===currProduct.images.length-1?0:prevIndex+1)
        }
    }
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
    const nextReview = () => {
        setReviewIndex((prev) =>
            currProduct?.reviews && currProduct.reviews.length > 0
                ? (prev + 1) % currProduct.reviews.length
                : 0
        );
    };
    const prevReview = () => {
        setReviewIndex((prev) =>
            currProduct?.reviews && currProduct.reviews.length > 0
                ? (prev - 1 + currProduct.reviews.length) % currProduct.reviews.length
                : 0
        );
    };

 return(
    <div className="ProductComponent">
            <div className="product" key={currProduct?._id}>
                <div className="productimages">
                    <button onClick={()=>imageleft()}>{"<"}</button>
                    <div className="imagecontainer">
                        <img src={currProduct?.images[imageIndex]}></img>
                    </div>
                    <button onClick={()=>imageright()}>{">"}</button>    
                </div>
                <div className="productdetails">
                    <p><span className="head">Name</span>:{currProduct?.title}</p>
                    <p className="description"><span className="head">Description</span>:{currProduct?.description}</p>
                    <p><span className="head">Price</span>: ₹{currProduct?.price}</p>
                    {currProduct?.reviews && currProduct.reviews.length > 0 ? (
                        <div className="customer-reviews-wrapper">
                            <button onClick={prevReview} className="review-btn"><i className="fa-solid fa-square-caret-left"></i></button>
                            <div className="review-card">
                                <p><span className="head">Reviewed By:</span> {currProduct.reviews[reviewIndex]?.user_id?.name}</p>
                                <p><span className="head">Rating:</span> {currProduct.reviews[reviewIndex]?.rating}/5</p>
                                <p><span className="head">Comment:</span> {currProduct.reviews[reviewIndex]?.comment}</p>
                            </div>
                            <button onClick={nextReview} className="review-btn"><i className="fa-solid fa-square-caret-right"></i></button>
                        </div>
                    ) : (
                        <div className="no-reviews">
                        <p><span className="head">No Customer Reviews Yet!!</span></p>
                        </div>
                    )}
                    <button className="add" onClick={()=>addtocart(currProduct)}><i className="fa-solid fa-cart-plus">Add to Cart</i></button>
                </div>
            </div>
    </div>
 )
}

export default ProductComponent