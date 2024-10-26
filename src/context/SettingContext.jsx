'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

import { getCountries } from '@/services/countryService';
import { getAirports } from '@/services/airportService';
import { getCities, getAllCities } from '@/services/cityService';

const SettingContext = createContext();

export const SettingProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    const [airportData, setAirportData] = useState([]);

    const refreshAirport = useCallback(async () => {
        const data = await getAirports();
        setAirportData(data);
    }, []);

    useEffect(() => {
        if (!isInitialized) {
            const initializeData = async () => {
                await Promise.all([refreshAirport()]);
                setIsInitialized(true);
            };
            initializeData();
        }
    }, [isInitialized, refreshAirport]);

    const contextValue = useMemo(
        () => ({
            airportData,
            refreshAirport,
        }),
        [airportData, refreshAirport]
    );

    return <SettingContext.Provider value={contextValue}>{children}</SettingContext.Provider>;
};

export const useSettingContext = () => useContext(SettingContext);
