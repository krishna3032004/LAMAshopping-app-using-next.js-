'use client'
import React, { useState } from 'react'
import { initiate } from '@/actions/useraction'
const page = () => {
    const [form, setform] = useState([])
    const [showFinished, setshowFinished] = useState(false)


    const handleChange = (e) => {
        setform({...form,[e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value // Handle checkbox input for boolean
      });
    }

    const handlesubmit = async(e)=>{
        await initiate(form)
    }
  
  return (
    <form onSubmit={handlesubmit}>
      <input type="text" value={form.name ? form.name : ""} onChange={handleChange} name='name' placeholder='name'/>
      <input type="text" value={form.type ? form.type : ""} onChange={handleChange} name='type' placeholder='type'/>
      {/* <input type="text" value={form.message ? form.message : ""} onChange={handleChange} name='message' placeholder='message'/> */}
      <input type="number" value={form.amount ? form.amount : ""} onChange={handleChange} name='amount' placeholder='amount'/>
      <input type="number" value={form.oldamount ? form.oldamount : ""} onChange={handleChange} name='oldamount' placeholder='old amount'/>
      <input type="number" value={form.quantity ? form.quantity : ""} onChange={handleChange} name='quantity' placeholder='quantity'/>
      <input type="text" value={form.image ? form.image : ""} onChange={handleChange} name='image' placeholder='product_image'/>
      <label><input type="checkbox" checked={form.featured || false} onChange={handleChange} name="featured"/>Featured</label>
      <button type='submit'>Submit</button>

    </form>
  )
}

export default page
