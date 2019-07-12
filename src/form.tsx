/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import { createStore, Mutation, Store } from "rehooker";
import { OperatorFunction, identity } from 'rxjs';
import { renderFields, FieldPath } from "./field";
import { FormButtons } from './inject-submittable';
import { initialize, submit } from './mutations';
import { debounceTime, distinctUntilKeyChanged, filter } from 'rxjs/operators';

export type Option = {name:string,value:any,group?:string}
export type AsyncOptions = ()=>Promise<Option[]>
export type RuntimeAsyncOptions = (search:any, props?:WidgetProps)=>Promise<Option[]>
export type FieldListens={
    /**
     * q:what is valuePath here?
     * a:
     * If your formValue is {"foo":{"haha":[{"bar":10032}]}}, then the callback here will receive these arguments:
     * 10032, {bar:10032}, [{bar:10032}], {haha:[{bar:10032}]}, {foo:...}
     */
    to:string[]|((keyPath:string)=>string[]),
    then:(values:any[])=>Partial<FormFieldSchema&{value:any}>|Promise<Partial<FormFieldSchema>&{value:any}>|void;
}[]

export interface WidgetInjectedProps{
    hide?:boolean,
    multiple?:boolean,
    placeholder?:any,
    fullWidth?:boolean, //todo: should I put this presentation logic here?
    required?:boolean,
    disabled?:boolean,
    [propName:string]:any
}

export type WidgetProps = {
    schema:FormFieldSchema,
    form:Store<FormState>,
    onChange:(e:any)=>void,
    value:any
    componentProps:any,
    keyPath:FieldPath,
    error:any
}

export type FormFieldSchema = WidgetInjectedProps & {
    key:string,
    label:React.ReactNode,
    type: string | React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>,
    children?:FormFieldSchema[]
    /**
     * keyPath will keyPath from the root of the form to your deeply nested field. e.g. foo.bar[1].far
     */
    listens?:FieldListens,
    parse?:(v:any)=>any,
    format?:(v:any)=>any,
    style?:React.CSSProperties,
    defaultValue?:any // set when mount
    options?:Option[] | AsyncOptions | RuntimeAsyncOptions,

    wrapperProps?:any // used as antd's Form.Item props
}

/**
 * type ErrorMap = Record<string,string|null|undefined|Array<ErrorMap>|ErrorMap>
 */

export type FormState = {
    submitting:boolean,
    submitSucceeded:boolean,
    errors:any
    values:any
    initialValues:any,
    valid:boolean,
}

const defaultFormState:FormState = {
    submitting:false,
    submitSucceeded:false,
    initialValues:{},
    errors:{},
    values:{},
    valid:true,
}

type ErrorMap = Record<string,any>
type CreateFormOptions = {
    validator?:(v:any)=>Promise<ErrorMap>,
    validationDelay?:number,
    middleware?:OperatorFunction<Mutation<FormState>,Mutation<FormState>>
}

export function createForm(options?:CreateFormOptions){
    const store = createStore({
        ...defaultFormState,
    },options?options.middleware:undefined)

    const validator = options && options.validator

    store.stream.pipe(
        distinctUntilKeyChanged("values"),
        filter(x=>!x.valid),
        options && options.validationDelay ? debounceTime(options.validationDelay) : identity
    ).subscribe(async fs=>{
        if(fs.values !== fs.initialValues){
            if(validator){
                console.log("validating...")
                const errors = await validator(fs.values)
                store.next(f=>({
                    ...f,
                    valid:!Object.keys(errors).some(y=>!!errors[y]),
                    errors
                }))
            }else{
                store.next(f=>({
                    ...f,
                    valid:true,
                    errors:{}
                }))
            }
        }
    })
    return store
}

// const store = createStore({})

export type SchemaFormProps = {
    schema:FormFieldSchema[],
    noButton?:boolean,
    form:Store<FormState>,
    initialValues?:any
    onSubmit?:(values:any)=>Promise<void>,
    disableInitialize?:boolean
    disableDestruction?:boolean
}

export function SchemaForm(props:SchemaFormProps){
    const handleSubmit = React.useMemo(()=>(e:React.FormEvent)=>{
        e.preventDefault()
        submit(props.form.next,props.onSubmit || noopSubmit)
        return false
    },[props.form])

    React.useEffect(()=>{
        if(!props.disableInitialize){
            props.form.next(s=>{
                return initialize(props.initialValues) (s)
            })
        }
    },[props.initialValues])

    React.useEffect(()=>()=>{
        if(!props.disableDestruction){
            props.form.next(function destroyOnUnmounnt(){
                return defaultFormState 
            })
        }
    },[props.form])

    return <form className="schema-form" onSubmit={handleSubmit}>
        { renderFields(props.form,props.schema,[])}
        {
            (!props.noButton)? <FormButtons onSubmit={props.onSubmit || noopSubmit} form={props.form} /> : null
        }
    </form>
}

const noopSubmit = ()=>{
    return Promise.resolve()
}