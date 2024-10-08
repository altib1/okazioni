import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
    dispatch(signInStart());
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    if (data.success === false) {
      dispatch(signInFailure(data.message));
      return
    }
    dispatch(signInSuccess(data));
    navigate('/')
  } catch (err) {
    dispatch(signInFailure(err.message));
  }
  }
  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-7'>Identifikohu</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-center'> 
        <input className='border-2 border-gray-300 rounded-md p-2 w-80 mb-3' id='email' onChange={handleChange} type='text' placeholder='Emaili' />
        <input className='border-2 border-gray-300 rounded-md p-2 w-80 mb-3' id='password' onChange={handleChange} type='password' placeholder='Fjalekalimi' />
        <button disabled={loading} className='bg-slate-700 hover:opacity-95 disabled:opacity-80 text-white font-bold py-2 px-4 rounded uppercase'>
          {loading ? 'Duke u identifikuar...' : 'Identifikohu'}
        </button>
        <OAuth  />
      </form>
      <div className='flex flex-row justify-center items-center gap-2 mt-5 text-center'>
        <p>Doni te regjistroheni ?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>regjistrohu</span>
        </Link>
      </div>
      {error && <p className='text-red-500 text-center'>{error}</p>}
    </div>
  )
}

