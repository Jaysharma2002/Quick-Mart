import React,{useEffect,useState} from "react";
import axios from 'axios'
import '../styles/AdminOrder.css'
import { updateorder } from "../../../backend/Controller";
function AdminOrder(){
    const [orders,setOrder]=useState([])
    const [filteredOrders,setFilteredOrders]=useState([])
    const [option,setOption]=useState()
    const [changeOption,setChangeOption]=useState()
    const [date,setDate]=useState()
    const [selectedOrders,setSelectedOrders]=useState([])
    const [updateButton,setUpdateButton]=useState(false)
    useEffect(()=>{
        const fetch=async()=>{
            const response=await axios.get('http://localhost:8000/api/product/getorder')
                console.log(response.data)
                setFilteredOrders(response.data)
                setOrder(response.data)         
        }
        fetch();
        
    },[])
    useEffect(()=>{
        if(date || option)
        {
            const filteredorders=orders.filter((order)=>{
                const filteredbydate=date?(order.orderDate).slice(0,10)===date : true
                const filteredbyoptions=option?order.orderStatus===option : true
                return filteredbydate && filteredbyoptions
            })
            setFilteredOrders(filteredorders)   
        }
        else{
            setFilteredOrders(orders)
        }
    },
    [date,orders,option])
    useEffect(()=>{
        if(selectedOrders && updateButton)
        {
            const fetch=async()=>{
                console.log("selectedOrders",selectedOrders)
                const response=await axios.put('http://localhost:8000/api/product/updatestatus',{selectedOrders:selectedOrders,changeOption:{orderStatus:changeOption}})
                console.log(response.data)
                setFilteredOrders((prevOrders)=>
                    prevOrders.map((order)=>
                        response.data.find((updateOrder)=>updateOrder._id===order._id) || order
                    )
                )
                setOrder((prevOrders)=>
                    prevOrders.map((order)=>
                        response.data.find((updateOrder)=>updateOrder._id===order._id) || order
                    )
                )
                setSelectedOrders([])
            }
            fetch()
        }
        setUpdateButton(false)
    },[changeOption,selectedOrders,updateButton])
    function SelectionHandler(id) {
        setSelectedOrders((prevState)=>
            prevState.includes(id)?
                prevState.filter((orderId)=>orderId!==id)
                :[...prevState,id]
        )
      }
    return(
        <div className="TableOrder">
            <div className="order">
                <h1 className="ordertext">Orders</h1>
                <div className="Adminorder">
                    <button onClick={()=>{setFilteredOrders(orders);setDate();setOption();}} className="showallbutton">Show All Orders</button>
                    <div className="datecontainer">
                        <label>Select Date</label>
                        <input type="date"  onChange={(e)=>setDate(e.target.value)} className="dateinput"></input>
                    </div>
                    <div className="statuscontainer">
                        <label>Select Status</label>
                        <select onChange={(e)=>setOption(e.target.value)} className="newoption">
                        <option value="Placed" className="option">Placed</option>
                            <option value="Dispatched" className="option">Dispatched</option>
                            <option vlaue="Delivered" className="option">Delivered</option>
                            <option value="Failed" className="option">Failed</option>
                            <option value="Cancelled" className="option">Cancelled</option>
                        </select>
                    </div>
                    <div className="statuscontainer">
                        <button onClick={()=>setUpdateButton(true)} className="updatebutton">Update</button>
                        <select onChange={(e)=>setChangeOption(e.target.value)} className="newoption">
                            <option value="Dispatched" className="option">Dispatched</option>
                            <option vlaue="Delivered" className="option">Delivered</option>
                            <option value="Failed" className="option">Failed</option>
                        </select>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>UserId</th>
                        <th>UserName</th>
                        <th>UserEmail</th>
                        <th>Products
                            <tr>
                                <th style={{paddingRight:'35px'}}>Product Title</th>
                                <th>Product Image</th>
                                <th>Product Quantity</th>
                                <th>Product Price</th>
                            </tr>
                        </th>
                        <th>PaymentStatus</th>
                        <th>OrderDate</th>
                        <th>OrderStatus</th>
                    </tr>
                </thead>
                <tbody>
                {filteredOrders.length>0?(filteredOrders.map((item)=>(
                    <tr key={item._id}>
                        <td><input type="checkbox" checked={selectedOrders.includes(item._id)} onClick={()=>SelectionHandler(item._id)}></input></td>
                        <td><p>{item.userId}</p></td>
                        <td><p>{item.userName}</p></td>
                        <td><p>{item.userEmail}</p></td>
                        <td>
                            <tr key={item.items._id}>
                                <td><span>{item.items.title}</span></td>
                                <td className="nopadding"><img src={item.items.images[0]}></img></td>
                                <td><span>{item.items.quantity}</span></td>
                                <td><span>{item.items.price}</span></td>    
                            </tr>
                        </td>
                        <td><p>{item.paymentStatus}</p></td>
                        <td><p>{(item.orderDate).slice(0,10)}</p></td>
                        <td><p>{item.orderStatus}</p></td>
                </tr>))):(
                    <tr>
                        <td colSpan={7}>No Data Available</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default AdminOrder