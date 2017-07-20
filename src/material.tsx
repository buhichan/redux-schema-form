/**
 * Created by buhi on 2017/4/28.
 */
import * as React from "react"
import {addType, AsyncOption, AsyncOptions, CustomWidgetProps, Options, setButton} from "./form"
import {TextField,SelectField,MenuItem,Checkbox,DatePicker,RaisedButton,FlatButton,Paper,AutoComplete,IconButton} from "material-ui"
import muiThemeable from "material-ui/styles/muiThemeable";
import Add from "material-ui/svg-icons/content/add";
import Remove from "material-ui/svg-icons/content/remove";
import {MuiTheme} from "material-ui/styles";
import {stylesheet} from "./material.jss";
import {BaseFieldArrayProps} from "redux-form";
import {WrappedFieldArrayProps} from "redux-form/lib/FieldArray";
import {connect} from "react-redux";
import {ContentClear} from "material-ui/svg-icons";
import {SyntheticEvent} from "react";
const injectCSS = require('react-jss').default;

let {Field,FieldArray} =require("redux-form");

function NumberInput(props:CustomWidgetProps){
    return <TextField
        {...props.input as any}
        type="number"
        errorText={props.meta.error}
        id={props.input.name}
        className="full-width"
        disabled={props.disabled}
        style={{width:"100%"}}
        floatingLabelText={props.fieldSchema.label}
        value={Number(props.input.value)}
        hintText={props.fieldSchema.placeholder}
        onChange={(e)=>props.input.onChange(Number(e.target['value']))}
    />;
}

function DateInput(props:CustomWidgetProps){
    const DatePickerProps = {
        onChange:(e,value)=>{
            return props.input.onChange(value.toLocaleDateString().replace(/\//g,'-'));
        }
    };
    const parsedDate = Date.parse(props.input.value);

    if (isNaN(props.input.value) && !isNaN(parsedDate)) {
        DatePickerProps['value']=new Date(props.input.value);
    }

    return <DatePicker
        DateTimeFormat={Intl.DateTimeFormat as any}
        locale="zh-CN"
        errorText={props.meta.error}
        floatingLabelText={props.fieldSchema.label}
        autoOk={true}
        id={props.input.name}
        container="inline"
        mode="portrait"
        cancelLabel="取消"
        fullWidth={true}
        okLabel="确认"
        {...DatePickerProps}
        hintText={props.fieldSchema.placeholder}
        disabled={props.disabled}/>
}

function TextInput(props:CustomWidgetProps){
    return <TextField
        {...props.input as any}
        errorText={props.meta.error}
        required={props.required}
        type={props.type}
        id={props.input.name}
        className="full-width"
        style={{width:"100%"}}
        disabled={props.disabled}
        hintText={props.fieldSchema.placeholder}
        multiLine={props.fieldSchema.multiLine}
        floatingLabelText={props.fieldSchema.label}/>;
}
function CheckboxInput (props:CustomWidgetProps){
    const {onChange,onBlur,value,...rest} = props.input;
    rest['label']=props.fieldSchema.label;
    return <Checkbox
        {...rest as any}
        onBlur={e=>onBlur(value)}
        style={{width:"100%",margin:"32px 0 16px"}}
        disabled={props.disabled}
        onChange={undefined}
        onCheck={(e,v)=>onChange(v)}
        checked={Boolean(value)}
    />
}

function SelectInput(props:CustomWidgetProps){
    return <SelectField
        {...props.input as any}
        id={props.input.name}
        disabled={props.disabled}
        floatingLabelText={props.fieldSchema.label}
        fullWidth={true}
        errorText={props.meta.error}
        hintText={props.fieldSchema.placeholder}
        multiple={props.fieldSchema.multiple}
        onChange={(e,i,v)=>{
            e.target['value'] = v;
            props.input.onChange(e)
        }}
    >
        {
            (props.fieldSchema.options as Options).map((option)=><MenuItem className="option" key={option.value} value={option.value} primaryText={option.name} />)
        }
    </SelectField>;
}

const dataSourceConfig = {text:"name",value:"value"};

@injectCSS({
    autocomplete:{
        position:"relative",
        "&>.autocomplete-clear-button":{
            position:"absolute",
            top:"15px",
            right:0,
            opacity:0,
        },
        "&:hover>.autocomplete-clear-button":{
            opacity:1
        }
    }
})
class BaseAutoComplete extends React.PureComponent<{fieldSchema,fullResult?,input,meta,openOnFocus?,searchText,dataSource,onNewRequest?,onUpdateInput?,classes?},any>{
    render() {
        const {fieldSchema, input, meta, fullResult, openOnFocus, searchText, dataSource, onNewRequest, onUpdateInput,classes} = this.props;
        return <div className={classes.autocomplete}>
            <AutoComplete
                id={fieldSchema.name}
                maxSearchResults={fullResult ? undefined : 5}
                menuStyle={fullResult ? {maxHeight: "300px", overflowY: 'auto'} : undefined}
                fullWidth={true}
                openOnFocus={openOnFocus}
                hintText={fieldSchema.placeholder}
                errorText={meta.error}
                filter={AutoComplete.fuzzyFilter}
                dataSource={dataSource}
                dataSourceConfig={dataSourceConfig}
                floatingLabelText={fieldSchema.label}
                searchText={searchText}
                onNewRequest={onNewRequest}
                onUpdateInput={onUpdateInput}
            />
            {
                input.value!==null&&input.value!==undefined&&input.value!=="" ? <IconButton
                    style={{position:"absolute"}}
                    className="autocomplete-clear-button"
                    onTouchTap={() => input.onChange(fieldSchema.defaultValue || null)}
                >
                    <ContentClear />
                </IconButton> : null
            }
        </div>
    }
}

class AutoCompleteSelect extends React.Component<CustomWidgetProps,any>{
    onNewRequest=(value)=>{
        return this.props.input.onChange(value['value']);
    };
    render() {
        const {meta,input,fieldSchema} = this.props;
        const value = (fieldSchema.options as Options).find(x=>x.value === input.value);
        return <BaseAutoComplete
            fieldSchema={fieldSchema}
            input={input}
            meta={meta}
            openOnFocus
            searchText={value?value.name:""}
            dataSource={fieldSchema.options}
            onNewRequest={this.onNewRequest}
        />
    }
}

class AutoCompleteText extends React.Component<CustomWidgetProps,any>{
    onUpdateInput=name=>{
        const entry = (this.props.fieldSchema.options as Options).find(x=>x.name===name);
        return this.props.input.onChange(entry?entry.value:name);
    };
    render() {
        const {meta,input,fieldSchema} = this.props;
        return <BaseAutoComplete
            input={input}
            meta={meta}
            fieldSchema={fieldSchema}
            dataSource={fieldSchema.options}
            searchText={input.value}
            onUpdateInput={this.onUpdateInput}
        />;
    }
}

class AutoCompleteAsync extends React.PureComponent<CustomWidgetProps,any>{
    pendingUpdate;
    fetchingQuery;
    $isMounted;
    componentWillMount(){
        this.$isMounted=true;
    }
    componentWillUnmount(){
        this.$isMounted=false;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.input.value!==this.props.input.value)
            this.setState({
                searchText:this.findName(nextProps.input.value)
            })
    }
    findName(value){
        const entry = (this.state.dataSource as Options).find(x=>x.value === value);
        return entry?entry.name:"";
    }
    onUpdateInput=(name,dataSource,params?)=>{
        if(!params||params.source !== 'change')
            return;
        const throttle = this.props.fieldSchema['throttle']||400;
        this.setState({
            searchText:name
        });
        if(this.pendingUpdate)
            clearTimeout(this.pendingUpdate);
        this.pendingUpdate = setTimeout(()=>{
            this.fetchingQuery = name;
            const result = (this.props.fieldSchema.options as AsyncOption)(name);
            if(result instanceof Promise)
                result.then(options=>{
                    if(this.fetchingQuery === name && this.$isMounted)
                        this.setState({
                            dataSource:options
                        })
                });
            else this.setState({
                dataSource:result
            })
        },throttle);
    };
    onSelected=({value})=>{
        this.props.input.onChange(value)
    };
    state={
        searchText:"",
        dataSource:[]
    };
    render() {
        const {meta,input,fieldSchema} = this.props;
        return <BaseAutoComplete
            input={input}
            meta={meta}
            fullResult
            fieldSchema={fieldSchema}
            dataSource={this.state.dataSource}
            searchText={this.findName(input.value)}
            onUpdateInput={this.onUpdateInput}
            onNewRequest={this.onSelected}
        />;
    }
}


@muiThemeable()
class ArrayFieldRenderer extends React.Component<WrappedFieldArrayProps<any>&CustomWidgetProps,any>{
    render() {
        const props = this.props;
        const muiTheme: MuiTheme = props.muiTheme;
        return <div className="clearfix">
            {
                props.fields.map((name, i) => {
                    let children = props.fieldSchema.children;
                    if(props.fieldSchema.getChildren)
                        children = props.fieldSchema.getChildren(props.fields.get(i)).filter(x=>x);
                    return <Paper key={i} zDepth={0} style={{
                        padding: '15px',
                        margin: '15px 0',
                        borderTop: "2px solid " + props.muiTheme.palette.primary1Color,
                    }}>
                        <div className="pull-right">
                            <IconButton
                                style={{minWidth: '30px', height: "30px", color: props.muiTheme.palette.accent1Color}}
                                onTouchTap={() => props.fields.remove(i)}
                                tooltip="删除"
                            >
                                <Remove hoverColor={muiTheme.palette.accent1Color}/>
                            </IconButton>
                        </div>
                        <div>
                            {
                                children && children.map((field) => {
                                    const parsedKey = name + '.' + field.key;
                                    return <div key={parsedKey}>
                                        {props.renderField({
                                            ...field,
                                            parsedKey
                                        })}
                                    </div>;
                                })
                            }
                        </div>
                    </Paper>
                })
            }
            <div style={{textAlign: "center"}}>
                <IconButton
                    style={{marginBottom: '15px'}}
                    tooltip="添加" onTouchTap={() => props.fields.push({})}
                >
                    <Add hoverColor={muiTheme.palette.primary1Color}/>
                </IconButton>
            </div>
        </div>
    }
}

function TextAreaInput(props:CustomWidgetProps){
    return <TextField
        {...props.input as any}
        errorText={props.meta.error}
        required={props.required}
        type={props.type}
        id={props.input.name}
        className="full-width"
        style={{width:"100%"}}
        disabled={props.disabled}
        multiLine
        floatingLabelText={props.fieldSchema.label}/>;
}

addType('textarea',function({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={TextAreaInput} />
    </div>
});

addType("file",function({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={FileInput} />
    </div>
});

@muiThemeable()
class FileInput extends React.PureComponent<CustomWidgetProps&{
    muiTheme:MuiTheme
},any>{
    state={
        filename:this.props.fieldSchema.label
    };
    onChange=(e:SyntheticEvent<HTMLInputElement>)=>{
        const file = (e.target as HTMLInputElement).files[0];
        this.setState({
            filename:file.name
        });
        this.props.input.onChange(file);
    };
    render(){
        const {meta,muiTheme} = this.props;
        const hasError = Boolean(meta.error);
        return <RaisedButton
            backgroundColor={hasError?muiTheme.textField.errorColor:muiTheme.palette.primary1Color}
            style={{marginTop:28}}
            label={meta.error||this.state.filename}
            labelColor={"#FFFFFF"}
            containerElement="label"
            labelStyle={{
                whiteSpace:"nowrap",
                textOverflow:"ellipsis",
                overflow:"hidden"
            }}
        >
            <input type="file" style={{display:"none"}} onChange={this.onChange} />
        </RaisedButton>
    }
}

const ConnectedArrayFieldRenderer = connect((s,p:any)=>{
    return {
        form: s.form[p.meta.form],
        ...p
    }
})(ArrayFieldRenderer);

addType('number',function ({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={NumberInput} />
    </div>
});

const DefaultInput = function ({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={TextInput}/>
    </div>
};

addType("password",DefaultInput);
addType("email",DefaultInput);
addType('text',DefaultInput);

addType('checkbox',function ({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={CheckboxInput} />
    </div>
});

addType('select',function ({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={SelectInput} />
    </div>
});
addType('autocomplete',function({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={AutoCompleteSelect} />
    </div>
});
addType('autocomplete-text',function({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={AutoCompleteText} />
    </div>
});
addType("autocomplete-async",function({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={AutoCompleteAsync} />
    </div>
});

addType('date',function({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={DateInput} />
    </div>
});

addType("array",(props)=>{
    return <div>
        <label className="control-label">{props.fieldSchema.label}</label>
        <FieldArray name={props.fieldSchema.parsedKey}  component={props.fieldSchema.getChildren?ConnectedArrayFieldRenderer:ArrayFieldRenderer} props={props}/>
    </div>
});

addType('hidden',({fieldSchema,renderField,...rest})=>{
    return <div>
        <Field id={'rich-editor'+fieldSchema.label} name={fieldSchema.parsedKey} {...rest}  component={'input'} />
    </div>
});

setButton(muiThemeable()(function(props:any){
    switch (props.type) {
        case 'submit':
            return <RaisedButton
                className="raised-button"
                primary
                label={props.children}
                labelStyle={{padding: "0"}}
                style={{margin: "15px"}}
                onClick={props.onClick}
                disabled={props.disabled}
                type={props.type}
            />;
        default:
            return <RaisedButton
                backgroundColor="transparent"
                style={{
                    backgroundColor: "transparent",
                    margin: "15px"
                }}
                buttonStyle={{
                    border: props.disabled ? "none" : "1px solid " + props.muiTheme.palette.primary1Color
                }}
                labelColor={props.muiTheme.palette.primary1Color}
                label={props.children}
                labelStyle={{padding: "0"}}
                onClick={props.onClick}
                disabled={props.disabled}
                type={props.type}
            />
    }
}) as any);

const formModule = require('../index');
const JSSForm = formModule.ReduxSchemaForm;
formModule.ReduxSchemaForm =muiThemeable()
(injectCSS(stylesheet)(
    ({classes,sheet,...rest})=>{
        return <div className={classes.form}>
            <JSSForm {...rest} />
        </div>;
    }));