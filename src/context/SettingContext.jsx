'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getUsers } from '@/services/userService';

import { getCountries } from '@/services/countryService';
import { getAirports } from '@/services/airportService';
import { getCities, getAllCities } from '@/services/cityService';

const SettingContext = createContext();

export const SettingProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    const [countriesData, setCountriesData] = useState([]);
    const [airportData, setAirportData] = useState([]);
    const [citiesData, setCitiesData] = useState([]);

    const updateCountries = useCallback(async () => {
        const data = await getCountries();
        setCountriesData(data);
    }, []);

    const refreshAirport = useCallback(async () => {
        const data = await getAirports();
        setAirportData(data);
    }, []);

    const updateCities = useCallback(async () => {
        const data = await getAllCities();
        setCitiesData({
            data,
            meta: {
                total: data.length,
                page: 1,
                pageSize: 100,
                totalPages: Math.ceil(data.length / 100),
            },
        });
    }, []);

    useEffect(() => {
        if (!isInitialized) {
            const initializeData = async () => {
                await Promise.all([updateCountries(), updateCities(), refreshAirport()]);
                setIsInitialized(true);
            };
            initializeData();
        }
    }, [isInitialized, updateCountries, updateCities, refreshAirport]);

    const contextValue = useMemo(
        () => ({
            countriesData,
            updateCountries,
            citiesData,
            updateCities,
            airportData,
            refreshAirport,
        }),
        [countriesData, citiesData, airportData, updateCountries, updateCities, refreshAirport]
    );

    return <SettingContext.Provider value={contextValue}>{children}</SettingContext.Provider>;
};

export const useSettingContext = () => useContext(SettingContext);
