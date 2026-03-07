import {login,register,getAllNotes} from "../../services/auth.api";
import { logoutUser } from "../../services/logout.api";
import {useContext} from "react";
import {AuthContext} from "../auth.context";

export const useAuth = ()=> {
    const context  = useContext(AuthContext);
    const {user,setUser,Loading,setLoading} = context;

    async function handleRegister({username,email,password}) {
        setLoading(true);
        const data = await register({username,email,password});
        setUser(data.user);
        setLoading(false);
    }

    async function handleLogin({username,email,password}) {
        setLoading(true);
        const data = await login({username,email,password});
        setUser(data.user);
        setLoading(false);
    }

    async function handleLogout() {
        setLoading(true);
        await logoutUser();   
        setUser(null);
        setLoading(false);
    }

    async function handleGetAllNotes() {
        setLoading(true);
         await getAllNotes();
        setLoading(false);
    }

    return {user,handleRegister,handleLogin,handleLogout,handleGetAllNotes,Loading}
}