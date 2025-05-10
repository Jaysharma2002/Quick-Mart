import React,{useEffect,useState}  from "react";
import axios from "axios";
import '../styles/Admin.css'
function AdminContent({selectedCategory,searchProduct}){
    const [onChange,setOnChange]=useState(false)
    const [isVisible,setIsVisible]=useState(false);
    const [isEdit,setIsEdit]=useState(null);
    const [newProduct,setNewProduct]=useState({
        title:"",
        images:"",
        description:"",
        price:"",
        rating:"",
        quantity:"",
        category:"",
    })
    const [product,setProducts]=useState([])
    useEffect(()=>{
        console.log(newProduct.quantity)
    },[newProduct])
    useEffect(()=>{
        console.log(selectedCategory)
        console.log(searchProduct)
        const fetch=async()=>{
            try {
                
                await axios.get("http://localhost:8000/api/product/fetch").then((response)=>{
                    const products=response.data
                    const filteredItems=products.filter((item)=>{
                    const selectedfiltereditems=selectedCategory?.toLowerCase()==="all" || item.category.toLowerCase()===selectedCategory.toLowerCase()
                    const searchedfiltereditems=searchProduct?.toLowerCase()==="" || item.title.toLowerCase().includes(searchProduct.toLowerCase()) || item.category.toLowerCase().includes(searchProduct.toLowerCase())
                    return selectedfiltereditems && searchedfiltereditems
                    })
                    setProducts(filteredItems)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetch();
    },[selectedCategory,searchProduct])
    

    const handleInput=async(e)=>{
        const {name,value}=e.target
        setNewProduct((prevState)=>({
            ...prevState,
            [name]:value,
        })
    )}

    const AddProduct=async()=>{
        const response=await axios.post("http://localhost:8000/api/product/create",{
            title:newProduct.title,
            images:newProduct.images,
            description:newProduct.description,
            price:newProduct.price,
            rating:newProduct.rating,
            quantity:newProduct.quantity,
            category:newProduct.category,
        })
        setProducts((prev)=>{
            if(Array.isArray(prev)){
                return  [...prev,response.data]
            }
            return [response.data]
           
        })
        setNewProduct({title:"",images:"",description:"",price:"",rating:"",quantity:"",category:"",})
    }

    function handleupdateInput(item){
        setNewProduct({
            title:item.title,
            images:item.images,
            description:item.description,
            price:item.price,
            rating:item.rating,
            quantity: item.quantity,
            category:item.category})
        setIsEdit(item._id)
    }

    const UpadateProduct=async()=>{
        if(!isEdit){
            console.log("No Product Found")
        }
        const response=await axios.put(`http://localhost:8000/api/product/update/${isEdit}`,{
            title:newProduct.title,
            images:newProduct.images,
            description:newProduct.description,
            price:newProduct.price,
            rating:newProduct.rating,
            quantity:newProduct.quantity,
            category:newProduct.category,
        })
        console.log(response.data)
        setProducts((products)=>products.map((product)=>
            product._id===isEdit?response.data:product
        ))
        setNewProduct({title:"",images:"",description:"",price:"",rating:"",quantity:"",category:""})
    }

    const handleDelete=async(id)=>{
        await axios.delete(`http://localhost:8000/api/product/delete/${id}`)
        setProducts((prev)=>{return prev.filter((product)=>product._id!==id)})
    }

    return(
        <>
        <div className="Table">
            <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Product Image</th>
                    <th>Product Description</th>
                    <th>Pice</th>
                    <th>Quantity</th>
                    <th>Category Name</th>
                    <th colSpan={2} ><button className="addbutton" onClick={()=>{setIsVisible(true),setOnChange(true)}}><i className="fa-solid fa-user-plus"></i><span className="text">Add Product</span></button></th>
                </tr>
            </thead>
            <tbody>
                {product.length>0?(product.map((item)=>(
                    <tr key={item._id}>
                    <td><p>{item.title}</p></td>
                    <td><img src={item.images[0]}></img></td>
                    <td><textarea defaultValue={`${item.description}`}></textarea></td>
                    <td><p>{item.price}</p></td>
                    <td><p>{item.sizes?.[0]?.quantity ?? 'N/A'}</p></td>
                    <td><p>{item.category}</p></td>
                    <td><button className="colbutton" onClick={()=>{handleupdateInput(item);setIsVisible(true);setOnChange(false)}}><i className="fa-solid fa-pen-to-square"></i><span className="text">Edit</span></button></td>
                    <td><button className="colbutton" onClick={()=>handleDelete(item._id)}><i className="fa-solid fa-delete-left"></i><span className="text">Delete</span></button></td>
                </tr>))):(
                    <tr>
                        <td colSpan={7}>No Data Available</td>
                    </tr>)}
            </tbody>
            </table>
        </div>
        <div className={`popup ${isVisible?'visible':'hidden'}`}>
            <input type="text" name="title" value={newProduct.title} onChange={handleInput} placeholder="Product Name"></input>
            <input type="text" name="images" value={newProduct.images} onChange={handleInput} placeholder="Product Image URL"></input>
            <input type="text" name="description" value={newProduct.description} onChange={handleInput} placeholder="Product Description"></input>
            <input type="text" name="price" value={newProduct.price} onChange={handleInput} placeholder="Product Price"></input>
            <input type="text" name="quantity" value={newProduct.quantity} onChange={handleInput} placeholder="Product Quantity"></input>
            <input type="text" name="category" value={newProduct.category} onChange={handleInput} placeholder="Product Category"></input>
            <div className="popbuttons">
                <div className={`disableadd ${onChange?'visible':'hidden'}`}>
                <button onClick={()=>{AddProduct();setIsVisible(false)}} ><i className="fa-solid fa-user-plus"></i><span className="text">Add New</span></button>
                </div>
                <div className={`disableupdate ${!onChange?'visible':'hidden'}`}>
                <button onClick={()=>{UpadateProduct();setIsVisible(false)}} ><i className="fa-solid fa-check"></i><span className="text">Update</span></button>
                </div>
                <button onClick={()=>{setIsVisible(false),setNewProduct({title:"",image:"",description:"",price:"",rating:"",category:""})}}><i className="fa-solid fa-xmark"></i><span className="text">Close</span></button>
            </div>
        </div> 
        </>
    )

}

export default AdminContent