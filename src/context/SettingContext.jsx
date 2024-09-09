'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getUsers } from '@/services/userService';
import { getRoles } from '@/services/roleService';

const SettingContext = createContext();

export const SettingProvider = ({ children }) => {
    const [userData, setUserData] = useState([]);
    const [roleData, setRoleData] = useState([]);

    //------------------------ GetUpdate Usuarios -------------------------/
    const updateUsers = async () => {
        //console.log('Obtener Nuevos Usuarios');
        const data = await getUsers();
        setUserData(data);
    };
    useEffect(() => {
        updateUsers();
    }, []);

    //------------------------ GetUpdate Role -------------------------/
    const updateRoles = async () => {
        const data = await getRoles();
        setRoleData(data);
    };
    useEffect(() => {
        updateRoles();
    }, []);

    return (
        <SettingContext.Provider
            value={{ userData, updateUsers, roleData, updateRoles, setUserData }}
        >
            {children}
        </SettingContext.Provider>
    );
};

export const useSettingContext = () => useContext(SettingContext);
