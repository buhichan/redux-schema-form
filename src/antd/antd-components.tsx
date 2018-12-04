/**
 * Created by Administrator on 2017/8/8.
 */
///<reference path="./declarations.d.ts" />

import * as React from "react"
import {addType, renderFields} from "../field";
import { AutoComplete, Radio ,Checkbox, InputNumber, Tooltip, Upload, Button, Icon, Input,Select,DatePicker, Collapse} from 'antd';
import {Options, WidgetProps} from "../form";
import {RuntimeAsyncOptions} from "../form";
import { setButton } from "../inject-submittable";
import * as moment from "moment"
import { ResolveMaybePromise } from '../resolve-maybe-promise';
import { FieldArray } from '../field-array';

const RadioGroup = Radio.Group;
const {TextArea} =Input;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const PropTypes = require('prop-types')
const RCSelect = require("rc-select").default

RCSelect.propTypes['value'] = PropTypes.any;
Option.propTypes && ( Option.propTypes['value'] = PropTypes.any );
(Select as any).propTypes['value'] = PropTypes.any as any

const emptyArray:any[] = []

const errorStyle={color:"red"};
function TextInput(props:WidgetProps){
    return <div>
        <div>{props.schema.label}</div>
        <Input 
            type={props.schema.type}
            id={props.schema.key}
            className="full-width"
            style={{width:"100%"}}
            name={props.schema.name}
            value={props.value}
            onChange={props.onChange}
            {...props.componentProps}
        />
        <div style={errorStyle}>{props.error}</div>
    </div>
}

class SelectInput extends React.PureComponent<WidgetProps>{
    state={
        search:""
    }
    onChange=(v:any)=>{
        this.setState({
            search:""
        })
        this.props.onChange(v)
    }
    onSearchChange=(v:string)=>this.setState({search:v})
    render(){
        const {schema,componentProps,value,error} = this.props
        return <div>
            <label>{schema.label}</label>
            <ResolveMaybePromise maybePromise={schema.options} >
                {(options)=>{
                    if(options == undefined)
                        options = emptyArray
                    console.log("rerender")
                    const finalValue = schema.multiple||componentProps.mode==="multiple"?(Array.isArray(value)?value:[]):value
                    return <Select
                        showSearch
                        style={{ width: "100%" }}
                        onSearch={this.onSearchChange}
                        mode={schema.multiple?"multiple":"default"}
                        value={finalValue}
                        onChange={this.onChange}
                        filterOption={false}
                        {...componentProps}
                    >
                        {options.filter((option)=>{
                            return !this.state.search || option.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0
                        }).slice(0,schema.maxOptionCount || Infinity).map(option=>{
                            const {name,value,...rest} = option
                            return <Option key={name} value={value} {...rest}>{name}</Option>
                        })}
                    </Select>
                }}
            </ResolveMaybePromise>
            <div style={errorStyle}>
                {error}
            </div>
        </div>
    }
}

function CheckboxInput (props:WidgetProps){
    return <div style={{width:"100%",paddingTop:20}}>
        <label style={{marginRight:15}}>{props.schema.label}</label>
        <Checkbox
            onChange={(e)=>props.onChange((e.target as HTMLInputElement).checked)}
            checked={Boolean(props.value)}
            {...props.componentProps}
        />
    </div>
}




function DateTimeInput(props:WidgetProps){
    const value=props.value?moment(props.value):undefined;
    return <div>
        <label>{props.schema.label}</label>
        <DatePicker
            showTime
            format={props.componentProps.dateFormat||"YYYY/MM/DD HH:mm:ss"}
            value={value}
            style={{width:"100%"}}
            onChange={(_,dateString)=>props.onChange(dateString)}
            {...props.componentProps}
        />
        <div style={errorStyle}>{props.error}</div>
    </div>
}

function DateInput(props:WidgetProps){
    let value= null;
    if(props.value){
        if(!(props.value instanceof moment))
            value= moment(props.value);
    }
    return<div >
        <label>{props.schema.label}</label>
        <DatePicker
            key={props.schema.name}
            value={value}
            style={{width:"100%"}}
            onChange={(_,dateString)=>{props.onChange(dateString)}}
            {...props.componentProps}
        />
        <div style={errorStyle}>
            {props.error}
        </div>
    </div>
}

function DateTimeRangeInput (props:WidgetProps){
    let value =props.value
    return <div>
        <label>{props.schema.label}</label>
        <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            style={{width:"100%"}}
            format={props.componentProps.dateFormat||"YYYY/MM/DD HH:mm:ss"}
            placeholder={['开始时间', '结束时间']}
            value={[(value&&value[0]&&moment(value[0]))||moment(),(value&&value[1]&&moment(value[1]))||moment()]}
            onChange={(_,dataStrings)=>{
                props.onChange(dataStrings);
            }}
            {...props.componentProps}
        />
        <div style={errorStyle}>{props.error}</div>
    </div>
}


function NumberInput(props:WidgetProps){
    return <div style={{width:"100%"}}>
        <label>{props.schema.label}</label>
        <InputNumber
            style={{width:"100%"}}
            id={props.schema.key}
            min={0}
            value={isNaN(parseFloat(props.value))?0:parseFloat(props.value)}
            onChange={(value)=>{if(isNaN(parseFloat(value as any))){
                props.onChange(0)
            }else{
                props.onChange(parseFloat(value as any) )
            }
            }} 
            {...props.componentProps}
        />
        <div style={errorStyle}>{props.error}</div>

    </div>
}

const defaultAutoCompleteFilter = (input:string,element:any)=>{
    return typeof element.props.children === 'string' && element.props.children.includes(input)
}

const AutoCompleteDefault = function(props:WidgetProps){
    const {error,value,onChange,schema} = props;
    return <div style={{ width:"100%" }}>
        <label>{schema.label}</label>
        <ResolveMaybePromise maybePromise={schema.options}>
            {options=>{
                return <AutoComplete
                    dataSource={options?options.map(itm=>({value:itm.value,text:itm.name})):emptyArray}
                    style={{ width:"100%" }}
                    value={value}
                    filterOption={defaultAutoCompleteFilter}
                    onSelect={onChange}
                    {...props.componentProps}
                />
            }}
        </ResolveMaybePromise>
        <div style={errorStyle}>{error}</div>
    </div>
}


class FileInput extends React.Component<WidgetProps,any>{
    onChange=(info:any)=>{
        this.props.onChange((info.fileList as any[]).map(file=>{
            if(file.response && file.response.url){
                file.url = file.response.url;
            }
            return {
                ...file
            }
        }).filter(file=>{
            if(file.response && file.response.url){
                return file.status==="done";
            }
            return true;
        }))
    };
    customRequest=(customRequestParams:any)=>{
        const {onSuccess,onError,onProgress,file,filename} = customRequestParams
        if(!this.props.schema.onFileChange){
            setTimeout(()=>{
                onProgress({percent:100});
                onSuccess(filename,null);
            },1)
        }else{
            this.props.schema.onFileChange(file).then(previewUrl=>{
                onProgress({percent:100});
                onSuccess(previewUrl,null);
            },(err)=>onError(err))
        }
    };
    render(){
        return <div style={{width:"100%"}}>
            <Upload
                fileList={this.props.value||emptyArray}
                multiple={true}
                onChange={this.onChange}
                customRequest={this.customRequest}
                {...this.props.componentProps}
            >
                <Button>
                    <Icon type="upload" /> {this.props.schema.label}
                </Button>
            </Upload>
        </div>
    }
}

function SelectRadio (props:WidgetProps){
    return <div>
        <label style={{paddingLeft:0}}>
            {props.schema.label}
        </label>
        <ResolveMaybePromise maybePromise={props.schema.options}>
            {options=><RadioGroup
                value={props.value || false}
                onChange={(v)=>props.onChange(v)}
                {...props.componentProps}
            >
                {
                    options?options.map((option) => (
                        <Radio style={{
                            width:"auto",
                            flex:1,
                            whiteSpace:"nowrap",
                            margin:"0 15px 0 0"
                        }} key={option.value} value={option.value} >{option.name}</Radio>
                    )):null
                }
            </RadioGroup>}
        </ResolveMaybePromise>
        <p style={errorStyle}>{props.error}</p>
    </div>
}

function DateRangeInput (props:WidgetProps){
    const dateFormat = props.schema.dateFormat || 'YYYY/MM/DD';
    const value=props.value
    const from =value?value[0]:undefined;
    const to =value?value[1]:undefined;
    return <div >
        <RangePicker
            defaultValue={[from?moment(from,dateFormat):undefined, to?moment(to,dateFormat):undefined]}
            format={dateFormat}
            onChange={(_,dateStrings)=>{props.onChange(dateStrings)}}
            {...props.componentProps}
        />
    </div>
}


function TextareaInput (props:WidgetProps){
    return <div style={{marginBottom:16}}>
        <label>{props.schema.label}</label>
        <TextArea 
            value={props.value}
            onChange={(value)=>props.onChange(value)}
            autosize={{minRows:4,maxRows:8}} 
            {...props.componentProps}
        />
        <div style={errorStyle}>{props.error}</div>
    </div>
}


class AutoCompleteAsync extends React.Component<WidgetProps,any>{
    pendingUpdate:any;
    fetchingQuery:any;
    $isMounted=false;
    componentDidMount(){
        this.$isMounted=true;
    }
    componentWillUnmount(){
        this.$isMounted=false;
    }
    componentWillReceiveProps(this:AutoCompleteAsync,nextProps:typeof this['props']){
        if(nextProps.value!==this.props.value)
            this.setState({
                searchText:this.findName(nextProps.value)
            })
    }
    findName(value:any){
        const entry = (this.state.dataSource as Options).find(x=>x.value === value);
        return entry?entry.name:value;
    }
    onUpdateInput=(name:string)=>{
        const throttle = this.props.schema.throttle || 400
        this.setState({
            searchText:name
        });
        if(this.pendingUpdate)
            clearTimeout(this.pendingUpdate);
        this.pendingUpdate = setTimeout(()=>{
            this.fetchingQuery = name;
            const result = (this.props.schema.options as RuntimeAsyncOptions)(name,this.props);
            if(result instanceof Promise)
                result.then(options=>{
                    if(this.fetchingQuery === name && this.$isMounted)
                        this.setState({
                            dataSource:options.map(itm=>({text:itm.name,value:itm.value}))
                        })
                });
            else this.setState({
                dataSource:result.map(itm=>({text:itm.name,value:itm.value}))
            })
        },throttle);
    };
    onSelected=(params:any)=>{
        this.props.onChange(params.value)
    };
    state={
        searchText:"",
        dataSource:emptyArray
    };
    render(){
        const {error,onChange,schema,componentProps} = this.props;
        return <div>
            <label>{schema.label}</label>
            <AutoComplete
                dataSource={this.state.dataSource}
                style={{width:"100%"}}
                onSelect={onChange}
                onSearch={this.onUpdateInput}
                filterOption={false}
                {...componentProps}
            />
            <div style={errorStyle}>
                {error}
            </div>
        </div>
    }
}


class AutoCompleteText extends React.Component<WidgetProps,any>{
    onUpdateInput=(name:string)=>{
        const entry = (this.props.schema.options as Options).find(x=>x.name===name);
        return this.props.onChange(entry?entry.value:name);
    };
    render(){
        const {componentProps,onChange,error,schema} = this.props;
        return <div>
            <label>{schema.label}</label>
            <AutoComplete
                dataSource={(schema.options as Options).map(itm=>({text:itm.name,value:itm.value}))}
                onSearch={this.onUpdateInput}
                onSelect={onChange}
                filterOption={defaultAutoCompleteFilter}
                {...componentProps}
            />
            <div style={errorStyle}>{error}</div>
        </div>
    }
}

function GroupRenderer({form,schema,keyPath,componentProps}:WidgetProps){
    return <Collapse defaultActiveKey={["0"]} style={{marginBottom:15}} {...componentProps}>
        <Collapse.Panel key={"0"} header={schema.label}>
            {
                renderFields(form, schema.children || [], keyPath +"." + schema.key)
            }
        </Collapse.Panel>
    </Collapse>
}

function ArrayFieldRenderer(props:WidgetProps){
    return <FieldArray {...props}>
        {(keys,add,remove,renderChild)=><>
            <label>{props.schema.label}</label>
            <div className="add-button">
                <Tooltip placement="topLeft" title="添加" arrowPointAtCenter>
                    <Button icon="plus" onClick={add}/>
                </Tooltip>
            </div>
            <Collapse style={{marginBottom:16,marginTop:16}}>
            {
                keys.map((id,index) => {
                    return <Collapse.Panel forceRender showArrow={false} key={id} header={<div>
                            {props.schema.label+" #"+index}
                            <div className="delete-button" onClick={e=>e.stopPropagation()}>
                                <Tooltip placement="topLeft" title="删除" arrowPointAtCenter>
                                    <Icon type="close" style={{cursor:"pointer",marginRight:8}} onClick={() => remove(id)}/>
                                </Tooltip>
                            </div>
                        </div>}>
                        <div key={id} className="array-field-child">
                            {
                                renderChild(id)
                            }
                        </div>
                    </Collapse.Panel>
                })
            }
            </Collapse>
        </>}
    </FieldArray>
}

addType("group",GroupRenderer)

addType('text',TextInput);
addType('select',SelectInput);

addType('radio',SelectRadio)

addType('checkbox',CheckboxInput);

addType('date',DateInput);

addType('autocomplete-text',AutoCompleteText);

addType('datetime',DateTimeInput);

addType('datetimeRange',DateTimeRangeInput);

addType('number',NumberInput);

addType('autocomplete',AutoCompleteDefault);

addType("file",FileInput);

addType("dateRange",DateRangeInput);

addType("textarea",TextareaInput);


addType("password",TextInput);
addType("email",TextInput);
addType('text',TextInput);

addType("array",ArrayFieldRenderer);

addType("autocomplete-async",AutoCompleteAsync);

setButton(props=>{
    return <div style={{textAlign:"center",float:"left",margin:15,width:"100%"}}>
        <Button.Group>
            <Button
                style={{
                    backgroundColor: "transparent",
                }}
                onClick={props.onReset}
                disabled={props.disabled}
                type={"default"}
                htmlType={'reset'}
            >
                重置
            </Button>
            <Button
                className="raised-button"
                onClick={props.onSubmit}
                icon={props.submitSucceeded?"check":undefined}
                disabled={props.disabled}
                type={'primary'}
                loading={props.submitting}
                htmlType={'submit'}
            >
                提交
            </Button>
        </Button.Group>
    </div>
})