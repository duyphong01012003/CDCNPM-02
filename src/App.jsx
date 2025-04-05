import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import Home from "./pages/Home";
import Document from "./pages/Document";
import Process from "./pages/Process";
import Employee from "./pages/Employee";
import User from "./pages/User";
import Login from "./pages/Login";
import Navbar from "../src/components/Navbar";
import GroupProjectList from "../src/components/GroupProjectList";
import ProjectList from "../src/components/ProjectList";
import TaskProjectList from "../src/components/TaskProjectList";
import ProgressProjectList from "../src/components/ProgressProjectList";
import Sidebar from "../src/components/Sidebar"
import DarkModeToggle from "./components/Dark";


function Layout() {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row dark:bg-gray-800">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block dark:bg-gray-900 dark:text-white">
        <Sidebar />
      </div>
      {/*<MoblieSidebar/>*/}
      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        <Navbar />
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}
// 
function App() {
  return (
    <main className='w-full min-h-screen bg-[#f3f4f6]'>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='/home' element={<Home />} />
          <Route path='/document' element={<Document />} />
          <Route path='/employee' element={<Employee />} />
          <Route path='/process' element={<Process />}>
            <Route index element={<GroupProjectList />} />
            <Route path="groups" element={<GroupProjectList />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="task" element={<TaskProjectList />} />
            <Route path="progress" element={<ProgressProjectList />} />
          </Route>
          <Route path='/user' element={<User />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>

      <Toaster richColors />
    </main>
  )
}

export default App
