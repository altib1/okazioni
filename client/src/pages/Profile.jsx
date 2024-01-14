import React from 'react'
import { useSelector } from 'react-redux'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { app } from '../firebase';
import { set } from 'mongoose';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
  if(file){
    handleFileUpload(file);
  }
}, [file])

const handleFileUpload = (file) => {
const storage = getStorage(app);
const fileName = new Date().getTime() + file.name;
const storageRef = ref(storage, fileName);
const uploadTask = uploadBytesResumable(storageRef, file);

uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setFilePerc(Math.round(progress));
  },
  (error) => {
    setFileUploadError(true);
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setFormData({ ...formData, avatar: downloadURL });
    });
  }
);
}

  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profili</h1>
      <form className='flex flex-col'>
        <input type="file" onChange={(e) =>setFile(e.target.files[0]) }  ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='w-32 h-32 rounded-full object-cover mx-auto cursor-pointer self-center' alt='profile'/>
        <p className='text-center'>{fileUploadError ? 
        (<span className='text-red-700 text-center'>Nje problem u shkaktua dhe ngarkimi nuk u mundesua (Ju lutem sugurohuni qe imazhi juaj nuk esht me i madh se 2 mb)</span>)
        : filePerc > 0 &&  filePerc < 100 ? (<span className='text-slate-700 text-center'>{`Ngarkimi ${filePerc}%`} </span>)
        : filePerc === 100 ? (<span className='text-green-700 text-center'>Ngarkimi u krye me sukses</span>)
        : ("")}
        </p>
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
