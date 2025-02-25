import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextBox from "../components/TextBox";
import Button from "../components/Button";


const Login = () => {
    const { user } = useSelector(state => state.auth);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const submitHandler = async (data) => {
        console.log("submit");
    }
    // console.log(user);

    useEffect(() => {
        user && navigate("/home");
    }, [user]);
    return (
        <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
            <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
                {/*left side*/}
                <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
                    <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
                        <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-[#1CA756]'>
                            <span>Welcome To</span>
                            <span>Business Management</span>
                        </p>

                        <div className='cell'>
                            <div className='circle rotate-in-up-left'></div>
                        </div>
                    </div>
                </div>
                {/*right side*/}
                <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
                    >
                        <div>
                            <p className='text-[#1CA756] text-3xl font-bold text-center'>Welcome back</p>
                        </div>
                        <div className='flex flex-col gap-[20px]'>
                            <TextBox
                                placeholder='email@example.com'
                                type='email'
                                name='email'
                                label='Email Address'
                                className='w-full rounded-full'
                                register={register("email", {
                                    required: "Email Address is required!",
                                })}
                                error={errors.email ? errors.email.message : ""}
                            />
                            <TextBox
                                placeholder='your password'
                                type='password'
                                name='password'
                                label='Password'
                                className='w-full rounded-full'
                                register={register("password", {
                                    required: "Password is required!",
                                })}
                                error={errors.password ? errors.password.message : ""}
                            />
                            <span className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer'>
                                Forget Password?
                            </span>
                            <Button
                                type='submit'
                                label='Submit'
                                className='w-full h-10 bg-[#1CA756] text-white rounded-full cursor-pointer'
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login