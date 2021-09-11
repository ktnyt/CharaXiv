import { createContext, useContext } from 'react'
import { AppData } from '@/api/app_data'

export const AppDataContext = createContext<AppData>(null!)
export const useAppData = () => useContext(AppDataContext)
