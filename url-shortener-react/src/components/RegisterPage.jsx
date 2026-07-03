import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import TextField from './TextField';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const registerHandler = async (data) => {
        setLoader(true);
        try {
            const { data: response } = await api.post(
                "/api/auth/public/register",
                data
            );
            reset();
            navigate("/login");
            toast.success("Registeration Successful!")
        } catch (error) {
            console.log(error);
            toast.error("Registeration Failed!")
        } finally {
            setLoader(false);
        }
    };

  return (
    <div
        className='min-h-[calc(100vh-72px)] bg-transparent flex justify-center items-center py-16'>
        <form onSubmit={handleSubmit(registerHandler)}
            className="sm:w-[450px] w-[92%] bg-white border border-[#E5E7EB] p-8 sm:p-10 rounded-2xl shadow-sm">
            <h1 className="text-center font-bold font-montserrat text-[#111827] lg:text-3xl text-2xl mb-2 tracking-tight">
                Register Here
            </h1>
            <p className="text-center text-[#6B7280] text-sm mb-8 font-normal">Create your account to start shortening links.</p>

            <div className="flex flex-col gap-5">
                <TextField
                    label="UserName"
                    required
                    id="username"
                    type="text"
                    message="*Username is required"
                    placeholder="Type your username"
                    register={register}
                    errors={errors}
                />

                <TextField
                    label="Email"
                    required
                    id="email"
                    type="email"
                    message="*Email is required"
                    placeholder="Type your email"
                    register={register}
                    errors={errors}
                />

                <TextField
                    label="Password"
                    required
                    id="password"
                    type="password"
                    message="*Password is required"
                    placeholder="Type your password"
                    register={register}
                    min={6}
                    errors={errors}
                />
            </div>

            <button
                disabled={loader}
                type='submit'
                className='bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-semibold w-full h-12 transition-all duration-150 rounded-xl my-6 text-sm shadow-sm flex items-center justify-center'>
                {loader ? "Loading..." : "Register"}
            </button>

            <p className='text-center text-sm text-[#6B7280] font-normal'>
                Already have an account? 
                <Link
                    className='font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline ml-1'
                    to="/login">
                    Login
                </Link>
            </p>
        </form>
    </div>
  )
}

export default RegisterPage