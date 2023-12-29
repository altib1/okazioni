import React from 'react'
import { useSelector } from 'react-redux'
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profili</h1>
      <form className='flex flex-col'>
        <img src={currentUser.avatar} className='w-32 h-32 rounded-full object-cover mx-auto cursor-pointer self-center' alt='profile'/>
        <input type='text' placeholder='Emri i perdorimit' className='border border-gray-300 p-2 rounded-lg my-3 self-center' id='username' />
        <input type='email' placeholder='Email' className='border border-gray-300 p-2 rounded-lg my-3 self-center' id='email' />
        <input type='password' placeholder='Fjalekalimi' className='border border-gray-300 p-2 rounded-lg my-3 self-center' id='password' />
        <button className='bg-orange-500 text-white p-2 rounded-lg self-center w-32 hover:opacity-90'>Ndrysho</button>
      </form>
      <div className='flex justify-between mt-5 align-middle' >
          <span className='text-semibold text-red-700 cursor-pointer self-center mx-auto'>Fshije profilin</span>
          <span className=' text-red-700 text-semibold cursor-pointer self-center mx-auto'>Dil</span>
      </div>

    </div>
  )
}
