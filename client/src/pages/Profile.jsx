import React from 'react'
import { useSelector } from 'react-redux'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { app } from '../firebase';
import { set } from 'mongoose';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

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
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.id]: e.target.value });
}

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
  } catch (error) {
    dispatch(updateUserFailure(error.message));
  }
}

const handleDeleteUser = async () => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
}

const handleSignOut = async() => {
  try{
    dispatch(signOutUserStart());
    const res = await fetch('/api/auth/signout');
    const data = await res.json();
    if(data.success === false){
      dispatch(signOutUserFailure(data.message));
      return;
    }
    dispatch(signOutUserSuccess(data));

  }catch(error){
    dispatch(signOutUserFailure(error.message));
  }
}

  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profili</h1>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input type="file" onChange={(e) =>setFile(e.target.files[0]) }  ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='w-32 h-32 rounded-full object-cover mx-auto cursor-pointer self-center' alt='profile'/>
        <p className='text-center'>{fileUploadError ? 
        (<span className='text-red-700 text-center'>Nje problem u shkaktua dhe ngarkimi nuk u mundesua (Ju lutem sugurohuni qe imazhi juaj nuk esht me i madh se 2 mb)</span>)
        : filePerc > 0 &&  filePerc < 100 ? (<span className='text-slate-700 text-center'>{`Ngarkimi ${filePerc}%`} </span>)
        : filePerc === 100 ? (<span className='text-green-700 text-center'>Ngarkimi u krye me sukses</span>)
        : ("")}
        </p>
        <input type='text' placeholder='Emri i perdorimit' defaultValue={currentUser.username} onChange={handleChange} className='border border-gray-300 p-2 rounded-lg my-3 self-center' id='username' />
        <input type='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} className='border border-gray-300 p-2 rounded-lg my-3 self-center' id='email' />
        <input type='password' placeholder='Fjalekalimi' onChange={handleChange} className='border border-gray-300 p-2 rounded-lg my-3 self-center' id='password' />
        <button disabled={loading} className='bg-orange-500 text-white p-2 rounded-lg self-center w-32 hover:opacity-90'>{loading ? 'Duke ngarkuar ...' : "Ndrysho"}</button>
      </form>
      <div className='flex justify-between mt-5 align-middle' >
          <span onClick={handleDeleteUser} className='text-semibold text-red-700 cursor-pointer self-center mx-auto'>Fshije profilin</span>
          <span onClick={handleSignOut} className=' text-red-700 text-semibold cursor-pointer self-center mx-auto'>Dil</span>
      </div>
          <p className='text-center text-red-700 text-semibold mt-5'>{error ? error : ''}</p>
          <p className='text-center text-green-700 text-semibold mt-5'>{updateSuccess ? 'Profili u ndryshua me sukses' : ''}</p>
    </div>
  )
}
