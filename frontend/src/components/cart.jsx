import React,{useEffect,useState} from 'react';
import '../styles/cart.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart({ product,setProducts,setAddedtocart,addedToCart,userId}) {
    const navigate = useNavigate();
    const [emptyMessage,setEmptyMessage]=useState(false)
    const [totalprice, setTotalprice] = React.useState(0);
    const [editData,setEditData]=useState({
        address:'',
        phone:''
    })
    function shop() {
        navigate("/home");
    }
    
    function Onclickremove(id)
    {
        setProducts(products=>{return products.filter(product=>product._id!==id)})
        setAddedtocart(addedToCart-1)
    }

    function Totalprice(){
        return product.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2);
    }
    useEffect(()=>{
        window.scrollTo(0,0)
        const fetch=async()=>{
            const response=await axios.post("http://localhost:8000/api/product/getaddress",{},{withCredentials:true})
            setEditData({
                address:response.data.address || '',
                phone:response.data.phone || ''
            })
            console.log(response.data)
            console.log(product)
        }
        fetch()
    },[])
    useEffect(()=>{
        const total=Totalprice();
        if(setTotalprice){
            setTotalprice(total)
        }
    },[product,setTotalprice])
    
    function InputHandler(e){
        const {name,value}=e.target
        setEditData((prevState)=>({
            ...prevState,
            [name]:value
        }))
        console.log(editData)
    }

    const submit=async()=>{
        const response=await axios.put("http://localhost:8000/api/product/updateaddress",editData,{withCredentials:true})
        setEditData({
            address:response.data.address,
            phone:response.data.phone
        })
        console.log(response.data)
    }

    const onAddQuantity=(e)=>{
        setProducts((prevState)=>
            prevState.map((item)=>item._id===e._id?{...item,quantity:item.quantity+1}:item)
        )
    }

    const onRemoveQuanity=(e)=>{
        setProducts((prevState)=>
            prevState.map((item)=>item._id===e._id && item.quantity>1?{...item,quantity:item.quantity-1}:item)
        )
    }

    const Payment=async()=>{
        
        if(editData.address!=='' && editData.phone!==''){
        const response = await fetch('http://localhost:8000/api/product/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount:totalprice*100, currency: 'INR', receipt: 'receipt#1', notes: {} })
          });
          const order = await response.json();

      // Open Razorpay Checkout
      const options = {
        key: 'rzp_test_fx1IQ3ysrz5vZE', // Replace with your Razorpay key_id
        amount: totalprice*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: 'Shop Mall',
        description: 'Test Transaction',
        order_id: order.id, // This is the order_id created in the backend
        prefill: {
          name: 'Jay Sharma',
          email: 'jaysharmadec2002@gmail.com',
          contact: '7720964387'
        },
        theme: {
          color: '#F37254'
        },
        handler:async function(){
            try{
                console.log(product)
                navigate("/home")
                axios.post('http://localhost:8000/api/product/order',{products:product},{withCredentials:true})
                setProducts([])
                setAddedtocart(0)
            }
            catch (error) {
                console.error('Error sending products to the server:', error);
            }
        },
        config: {
            display: {
              blocks: {
                banks: {
                  name: 'All Payment Options',
                  instruments: [
                    {
                      method: 'upi'
                    },
                    {
                      method: 'card'
                    },
                    {
                        method: 'wallet'
                    },
                    {
                        method: 'netbanking'
                    }
                  ],
                },
              },
              sequence: ['block.banks'],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
        }
      const rzp = new Razorpay(options);
      rzp.open();}
      else{
        setEmptyMessage(true)
        setTimeout(()=>{
            setEmptyMessage(false)
        },3000)
      }
    }

    return (
        <>
            { product.length === 0 ? (
                <div className="cart">
                    <h1 className='headertitle'>Your Cart Is Empty</h1>
                    <button onClick={shop}>
                        <i className="fa-solid fa-bag-shopping"></i><span>Continue Shopping</span></button>
                </div>
            ) :
            
            (<div className="maincontent">
                <div className="contentcontainer">
                    <div className='content-title'>
                        <h1 className='headertitleedit'>YOUR CART</h1>
                    </div>
                    <div className='content-items'>
                            {product.map((e) => (
                                <div key={e._id} className="cartcard">
                                    <img src={e.images[0]} alt={e.title} /> {/* Add alt for accessibility */}
                                    <p><span className="head">Name</span>: {e.title}</p>
                                    <p><span className="head">Price</span>: ₹{e.price}</p>
                                    <div className="quantity">
                                        <button onClick={()=>{onAddQuantity(e);}}><i class="fa-solid fa-plus"></i></button>
                                        <p>Quantity{e.quantity}</p>
                                        <button onClick={()=>{onRemoveQuanity(e);}}><i class="fa-solid fa-minus"></i></button>
                                    </div>
                                    <div className='remove'>
                                    <button onClick={()=>Onclickremove(e._id)}><i class="fa-solid fa-trash">Remove</i></button>
                                    </div>
                                </div>
                            ))}
                        
                    </div>
                </div>
                <div className='cartdetails'>
                <div className="address">
                    <span style={{color:emptyMessage?'red':'white'}}>Please Fill the Empty Fields!!</span>
                    <div className='inputgroupcontainer'>
                        <div className="inputgroup">
                            <label>Address</label>
                            <input type="text" name="address" value={editData.address} onChange={InputHandler}/>
                        </div>
                        <div className='inputgroup'>
                            <label>Phone No.</label>
                            <input type="text" name="phone" value={editData.phone} onChange={InputHandler}/>
                        </div> 
                        <button onClick={()=>submit()} className="savedetails">SAVE DETAILS</button>
                    </div>
                </div>
                <div className='paynow'>
                    <div className='totalprice'>
                        <p><i className="fa-solid fa-money-check-dollar"></i> Total: ₹{Totalprice()}/-</p>
                    </div>
                    <div className='payment'>
                        <button onClick={Payment} className="savedetails"><i className="fa-solid fa-wallet"></i>&nbsp;Check Out</button>
                    </div>
                </div>
            </div>
        </div>
        )}
    
        </>
    );
}

export default Cart;
