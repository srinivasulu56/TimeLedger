import { Routes,Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Dashboard from "../features/dashboard/pages/DashboardPage";
import DashboardLayout from "../layouts/DashboardLayout";
import TasksPage from "../features/tasks/pages/TasksPage";
import TaskDetailsPage from "../features/tasks/pages/TaskDetailsPage";

function AppRouter(){

  return(
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/Dashboard" element={<DashboardLayout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="tasks" element={<TasksPage/>}/>
        <Route path="tasks/:taskId" element={<TaskDetailsPage />} />

        </Route>
    </Routes>
  )

}

export default AppRouter;