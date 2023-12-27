import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
    setLoading(true)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    if (data.success === false) {
      setLoading(false)
      setError(data.message)
      return
    }
    setLoading(false)
    setError(null)
    navigate('/sign-in')
  } catch (err) {
    setLoading(false)
    setError(err.message)
  }
  }
  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-7'>Regjistrohu</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-center'> 
        <input className='border-2 border-gray-300 rounded-md p-2 w-80 mb-3' id='username' onChange={handleChange} type='text' placeholder='Emri i perdorimit' />
        <input className='border-2 border-gray-300 rounded-md p-2 w-80 mb-3' id='email' onChange={handleChange} type='text' placeholder='Emaili' />
        <input className='border-2 border-gray-300 rounded-md p-2 w-80 mb-3' id='password' onChange={handleChange} type='password' placeholder='Fjalekalimi' />
        <button disabled={loading} className='bg-slate-700 hover:opacity-95 disabled:opacity-80 text-white font-bold py-2 px-4 rounded uppercase'>
          {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
        </button>
        <OAuth  />
      </form>
      <div className='flex flex-row justify-center items-center gap-2 mt-5 text-center'>
        <p>Doni te identifikoheni ?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>identifikohu</span>
        </Link>
      </div>
      {error && <p className='text-red-500 text-center'>{error}</p>}
    </div>
  )
}

