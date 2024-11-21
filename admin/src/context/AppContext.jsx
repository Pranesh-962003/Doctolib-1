import { createContext } from "react";

export const AppContext = createContext()


const AppContextProvider = (props)=>{

    const calculateAge = (dob)=>{
        const toaday = new Date()
        const birthDate = new Date(dob);

        let age = toaday.getFullYear()-birthDate.getFullYear()
        return age

    }
    const currency = '$'

    const months = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate)=>{
      const dateArray = slotDate.split('_')
      return dateArray[0]+" " + months[Number(dateArray[1])]+" "+dateArray[2]
    }


    const value = {
        calculateAge,slotDateFormat,
        currency

    }

    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>


}


export default AppContextProvider;