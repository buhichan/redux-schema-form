import * as React from "react";
import { EnumOption } from './types';
import { FormFieldSchema } from './index';

export function useEnumOptions(maybeOptions:FormFieldSchema['options'],search?:string){
    const [options,setOptions] = React.useState(null as null | EnumOption[])
    
    React.useEffect(()=>{
        if(Array.isArray(maybeOptions)){
            setOptions(maybeOptions)
        }
    },[maybeOptions])

    React.useEffect(()=>{
        if(maybeOptions instanceof Function){
            let canceled = false
            maybeOptions(search).then((options)=>{
                if(!canceled){
                    setOptions(options)
                }
            })
        }
    },[maybeOptions instanceof Function && maybeOptions.length > 0 ? search : ""])

    return options
}