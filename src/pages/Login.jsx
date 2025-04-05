import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextBox from "../components/TextBox";
import Button from "../components/Button";
import { useLoginMutation } from '../redux/slices/authApiSlice';
import { toast } from 'sonner';
import { setCredentials } from '../redux/slices/authSlice';
import Loading from '../components/Loading';


const Login = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const submitHandler = async (formData) => {
        console.log(formData);
        try {
            const result = await login({
                Code: formData.username,
                Password: formData.password
            }).unwrap();
            console.log(result);

            dispatch(setCredentials(result));
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || error.message)
        }
    }

    useEffect(() => {
        user && navigate("/home");
    }, [user]);

    if (isLoading) {
        return <Loading />;
    }

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
                                placeholder='your username'
                                type='text'
                                name='username'
                                label='Username'
                                className='w-full rounded-full'
                                register={register("username", {
                                    required: "Tên đăng nhập không được để trống!",
                                })}
                                error={errors.username ? errors.username.message : ""}
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