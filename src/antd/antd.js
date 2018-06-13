"use strict";
/**
 * Created by Administrator on 2017/8/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var field_1 = require("../field");
var _a = require("redux-form"), Field = _a.Field, FieldArray = _a.FieldArray;
var antd_1 = require("antd");
var RadioGroup = antd_1.Radio.Group;
var antd_2 = require("antd");
var TextArea = antd_2.Input.TextArea;
var RangePicker = antd_2.DatePicker.RangePicker;
var util_1 = require("util");
var Option = antd_2.Select.Option;
var render_fields_1 = require("../render-fields");
var buttons_1 = require("../buttons");
var PropTypes = require("prop-types");
var rc_select_1 = require("rc-select");
var moment = require("moment");
rc_select_1.default.propTypes['value'] = PropTypes.any;
Option.propTypes['value'] = PropTypes.any;
antd_2.Select.propTypes['value'] = PropTypes.any;
var convertValueToString = function (Comp) { return function (props) {
    var onChange = !props.onChange ? undefined : function (value) {
        props.onChange();
    };
    return React.createElement(Comp, tslib_1.__assign({}, props, { value: String(props.value) }));
}; };
var errorStyle = { color: "red" };
function TextInput(props) {
    var componentProps = field_1.getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement("div", null, props.fieldSchema.label),
        React.createElement(antd_2.Input, tslib_1.__assign({ type: props.type, id: props.input.name, className: "full-width", style: { width: "100%" }, name: props.input.name, onBlur: props.input.onBlur, value: props.input.value, onChange: props.input.onChange }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var SelectInput = /** @class */ (function (_super) {
    tslib_1.__extends(SelectInput, _super);
    function SelectInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            options: null
        };
        _this.unmounted = false;
        return _this;
    }
    SelectInput.prototype.reload = function (props) {
        var _this = this;
        var rawOptions = props.fieldSchema.options;
        if (typeof rawOptions === 'function') {
            if (!rawOptions.length)
                rawOptions().then(function (options) { return !_this.unmounted && _this.setState({
                    options: options
                }); });
        }
        else if (rawOptions instanceof Array)
            this.setState({
                options: props.fieldSchema.options
            });
    };
    SelectInput.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.fieldSchema.options !== this.props.fieldSchema.options)
            this.reload(nextProps);
    };
    SelectInput.prototype.componentWillUnmount = function () {
        this.unmounted = true;
    };
    SelectInput.prototype.componentWillMount = function () {
        this.reload(this.props);
    };
    SelectInput.prototype.render = function () {
        var _a = this.props, fieldSchema = _a.fieldSchema, input = _a.input, meta = _a.meta;
        var componentProps = field_1.getComponentProps(fieldSchema);
        return React.createElement("div", null,
            React.createElement("label", null, fieldSchema.label),
            React.createElement(antd_2.Select, tslib_1.__assign({ showSearch: true, style: { width: "100%" }, optionFilterProp: "children", value: fieldSchema.multiple || fieldSchema.mode === "multiple" ? (util_1.isArray(input.value) ? input.value : []) : input.value, onChange: function (value) { return input.onChange(value); }, filterOption: function (input, option) {
                    return option["props"].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                } }, componentProps), this.state.options ? this.state.options.map(function (option) {
                var name = option.name, value = option.value, rest = tslib_1.__rest(option, ["name", "value"]);
                return React.createElement(Option, tslib_1.__assign({ key: name, value: value }, rest), name);
            }) : null),
            React.createElement("div", { style: errorStyle }, meta.error));
    };
    return SelectInput;
}(React.Component));
function CheckboxInput(props) {
    var componentProps = field_1.getComponentProps(props.fieldSchema);
    return React.createElement("div", { style: { width: "100%" } },
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(antd_1.Checkbox, tslib_1.__assign({ onChange: function (e) { return props.input.onChange(e.target["checked"]); }, checked: Boolean(props.input.value) }, componentProps)));
}
function DateTimeInput(props) {
    var value = props.input.value ? moment(props.input.value) : undefined;
    var componentProps = field_1.getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(antd_2.DatePicker, tslib_1.__assign({ showTime: true, format: "YYYY-MM-DD HH:mm:ss", defaultValue: value, style: { width: "100%" }, onChange: function (value, dateString) { return props.input.onChange(dateString); } }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
function DateInput(props) {
    var value = null;
    if (props.input.value) {
        if (!(props.input.value instanceof moment))
            value = moment(props.input.value);
    }
    var componentProps = field_1.getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(antd_2.DatePicker, tslib_1.__assign({ key: props.fieldSchema.name, value: value, disabled: props.disabled, style: { width: "100%" }, onChange: function (date, dateString) { props.input.onChange(dateString); } }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var DateTimeRangeInput = /** @class */ (function (_super) {
    tslib_1.__extends(DateTimeRangeInput, _super);
    function DateTimeRangeInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateTimeRangeInput.prototype.render = function () {
        var _this = this;
        var value = this.props.input.value && JSON.parse(this.props.input.value);
        var componentProps = field_1.getComponentProps(this.props.fieldSchema);
        return React.createElement("div", null,
            React.createElement("label", null, this.props.fieldSchema.label),
            React.createElement(RangePicker, tslib_1.__assign({ showTime: { format: 'HH:mm:ss' }, format: "YYYY-MM-DD HH:mm:ss", placeholder: ['开始时间', '结束时间'], defaultValue: [(value && value[0] && moment(value[0])) || moment(), (value && value[1] && moment(value[1])) || moment()], onChange: function (dates, dataStrings) {
                    _this.props.input.onChange(dataStrings);
                } }, componentProps)),
            React.createElement("div", { style: errorStyle }, this.props.meta.error));
    };
    return DateTimeRangeInput;
}(React.Component));
function NumberInput(props) {
    var required = {
        required: props.required
    };
    var componentProps = field_1.getComponentProps(props.fieldSchema);
    return React.createElement("div", { style: { width: "100%" } },
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(antd_1.InputNumber, tslib_1.__assign({ onBlur: props.input.onBlur }, required, { style: { width: "100%" }, id: props.input.name, min: 0, disabled: props.disabled, value: isNaN(parseFloat(props.input.value)) ? 0 : parseFloat(props.input.value), onChange: function (value) {
                if (isNaN(parseFloat(value))) {
                    props.input.onChange(0);
                }
                else {
                    props.input.onChange(parseFloat(value));
                }
            } }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var AutoCompleteSelect = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteSelect, _super);
    function AutoCompleteSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoCompleteSelect.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        var componentProps = field_1.getComponentProps(fieldSchema);
        var value = fieldSchema.options.find(function (x) { return x.value === input.value; });
        return React.createElement("div", { style: { width: "100%" } },
            React.createElement("label", null, fieldSchema.label),
            React.createElement(antd_1.AutoComplete, tslib_1.__assign({ dataSource: (this.state.options || []).map(function (itm) { return ({ value: itm.value, text: itm.name }); }), style: { width: "100%" }, onSelect: function (value) { return input.onChange(value); } }, componentProps)),
            React.createElement("div", { style: errorStyle }, this.props.meta.error));
    };
    return AutoCompleteSelect;
}(SelectInput));
var FileInput = /** @class */ (function (_super) {
    tslib_1.__extends(FileInput, _super);
    function FileInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (info) {
            _this.props.input.onChange(info.fileList.map(function (file) {
                if (file.response && file.response.url) {
                    file.url = file.response.url;
                }
                return tslib_1.__assign({}, file);
            }).filter(function (file) {
                if (file.response && file.response.url) {
                    return file.status === "done";
                }
                return true;
            }));
        };
        _this.customRequest = function (_a) {
            var onSuccess = _a.onSuccess, onError = _a.onError, onProgress = _a.onProgress, data = _a.data, file = _a.file, filename = _a.filename;
            if (!_this.props.fieldSchema.onFileChange) {
                setTimeout(function () {
                    onProgress({ percent: 100 });
                    onSuccess(filename, null);
                }, 1);
            }
            else {
                _this.props.fieldSchema.onFileChange(file).then(function (previewUrl) {
                    onProgress({ percent: 100 });
                    onSuccess(previewUrl, null);
                }, function (err) { return onError(err); });
            }
        };
        return _this;
    }
    FileInput.prototype.render = function () {
        var componentProps = field_1.getComponentProps(this.props.fieldSchema);
        return React.createElement("div", { style: { width: "100%" } },
            React.createElement(antd_1.Upload, tslib_1.__assign({ fileList: this.props.input.value || [], multiple: true, onChange: this.onChange, customRequest: this.customRequest }, componentProps),
                React.createElement(antd_1.Button, null,
                    React.createElement(antd_1.Icon, { type: "upload" }),
                    " ",
                    this.props.fieldSchema.label)));
    };
    return FileInput;
}(React.Component));
var SelectRadio = /** @class */ (function (_super) {
    tslib_1.__extends(SelectRadio, _super);
    function SelectRadio() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectRadio.prototype.render = function () {
        var props = this.props;
        var componentProps = field_1.getComponentProps(props.fieldSchema);
        return React.createElement("div", null,
            React.createElement("label", { style: { paddingLeft: 0 } }, props.fieldSchema.label),
            React.createElement(RadioGroup, tslib_1.__assign({ disabled: props.disabled, value: this.props.input.value || false, onChange: function (v) { return props.input.onChange(v); } }, componentProps), this.state.options ? this.state.options.map(function (option) { return (React.createElement(antd_1.Radio, { style: {
                    width: "auto",
                    flex: 1,
                    whiteSpace: "nowrap",
                    margin: "0 15px 0 0"
                }, key: option.value, value: option.value }, option.name)); }) : null),
            React.createElement("p", { style: errorStyle }, props.meta.error));
    };
    SelectRadio = tslib_1.__decorate([
        field_1.addType("radio")
    ], SelectRadio);
    return SelectRadio;
}(SelectInput));
var DateRangeInput = /** @class */ (function (_super) {
    tslib_1.__extends(DateRangeInput, _super);
    function DateRangeInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateRangeInput.prototype.render = function () {
        var _this = this;
        var dateFormat = 'YYYY-MM-DD';
        var value = this.props.input.value;
        var from = value ? value[0] : undefined;
        var to = value ? value[1] : undefined;
        var componentProps = field_1.getComponentProps(this.props.fieldSchema);
        return React.createElement("div", null,
            React.createElement(RangePicker, tslib_1.__assign({ defaultValue: [from ? moment(from, dateFormat) : undefined, to ? moment(to, dateFormat) : undefined], disabled: this.props.disabled, format: dateFormat, onChange: function (date, dateStrings) { _this.props.input.onChange(dateStrings); } }, componentProps)));
    };
    return DateRangeInput;
}(React.Component));
function TextareaInput(props) {
    var componentProps = field_1.getComponentProps(props.fieldSchema);
    return React.createElement("div", { style: { paddingBottom: 15 } },
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(TextArea, tslib_1.__assign({ value: props.input.value, onChange: function (value) { return props.input.onChange(value); }, autosize: { minRows: 4, maxRows: 8 } }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var AutoCompleteAsync = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteAsync, _super);
    function AutoCompleteAsync() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var throttle = _this.props.fieldSchema['throttle'] || 400;
            _this.setState({
                searchText: name
            });
            if (_this.pendingUpdate)
                clearTimeout(_this.pendingUpdate);
            _this.pendingUpdate = setTimeout(function () {
                _this.fetchingQuery = name;
                var result = _this.props.fieldSchema.options(name, _this.props);
                if (result instanceof Promise)
                    result.then(function (options) {
                        if (_this.fetchingQuery === name && _this.$isMounted)
                            _this.setState({
                                dataSource: options.map(function (itm) { return ({ text: itm.name, value: itm.value }); })
                            });
                    });
                else
                    _this.setState({
                        dataSource: result.map(function (itm) { return ({ text: itm.name, value: itm.value }); })
                    });
            }, throttle);
        };
        _this.onSelected = function (_a) {
            var value = _a.value;
            _this.props.input.onChange(value);
        };
        _this.state = {
            searchText: "",
            dataSource: []
        };
        return _this;
    }
    AutoCompleteAsync.prototype.componentWillMount = function () {
        this.$isMounted = true;
    };
    AutoCompleteAsync.prototype.componentWillUnmount = function () {
        this.$isMounted = false;
    };
    AutoCompleteAsync.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.input.value !== this.props.input.value)
            this.setState({
                searchText: this.findName(nextProps.input.value)
            });
    };
    AutoCompleteAsync.prototype.findName = function (value) {
        var entry = this.state.dataSource.find(function (x) { return x.value === value; });
        return entry ? entry.name : value;
    };
    AutoCompleteAsync.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        return React.createElement("div", null,
            React.createElement("label", null, fieldSchema.label),
            React.createElement(antd_1.AutoComplete, { dataSource: this.state.dataSource, style: { width: "100%" }, onSelect: function (value) { return input.onChange(value); }, disabled: this.props.disabled, onSearch: this.onUpdateInput, filterOption: true }),
            React.createElement("div", { style: errorStyle }, meta.error));
    };
    return AutoCompleteAsync;
}(React.Component));
var AutoCompleteText = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteText, _super);
    function AutoCompleteText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var entry = _this.props.fieldSchema.options.find(function (x) { return x.name === name; });
            return _this.props.input.onChange(entry ? entry.value : name);
        };
        return _this;
    }
    AutoCompleteText.prototype.render = function () {
        var _a = this.props, input = _a.input, meta = _a.meta, fieldSchema = _a.fieldSchema;
        return React.createElement("div", null,
            React.createElement("label", null, fieldSchema.label),
            React.createElement(antd_1.AutoComplete, { dataSource: fieldSchema.options.map(function (itm) { return ({ text: itm.name, value: itm.value }); }), onSearch: this.onUpdateInput, onSelect: function (value) { return input.onChange(value); }, filterOption: true }),
            React.createElement("div", { style: errorStyle }, meta.error));
    };
    return AutoCompleteText;
}(React.Component));
var ArrayFieldRenderer = /** @class */ (function (_super) {
    tslib_1.__extends(ArrayFieldRenderer, _super);
    function ArrayFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayFieldRenderer.prototype.render = function () {
        var props = this.props;
        return React.createElement("div", { className: "clearfix array-field-container" },
            props.fields.map(function (name, i) {
                var children = props.fieldSchema.children;
                if (props.fieldSchema.getChildren)
                    children = props.fieldSchema.getChildren(props.fields.get(i)).filter(function (x) { return x; });
                return React.createElement("div", { key: i, className: "array-field-child" },
                    React.createElement("div", { className: "delete-button" },
                        React.createElement(antd_1.Tooltip, { placement: "topLeft", title: "删除", arrowPointAtCenter: true },
                            React.createElement(antd_1.Icon, { type: "minus", className: "icon-minus", style: { cursor: "pointer" }, onClick: function () { return props.fields.remove(i); } }))),
                    render_fields_1.renderFields(props.meta.form, children, props.keyPath + "[" + i + "]"));
            }),
            React.createElement("div", { className: "add-button" },
                React.createElement(antd_1.Tooltip, { placement: "topLeft", title: "添加", arrowPointAtCenter: true },
                    React.createElement(antd_1.Icon, { type: "plus", className: "icon-plus", style: { cursor: "pointer" }, onClick: function () { return props.fields.push(); } }))));
    };
    return ArrayFieldRenderer;
}(React.Component));
field_1.addType('text', TextInput);
field_1.addType('select', SelectInput);
field_1.addType('checkbox', CheckboxInput);
field_1.addType('date', DateInput);
field_1.addType('autocomplete-text', AutoCompleteText);
field_1.addType('datetime', DateTimeInput);
field_1.addType('datetimeRange', DateTimeRangeInput);
field_1.addType('number', NumberInput);
field_1.addType('autocomplete', AutoCompleteSelect);
field_1.addType("file", FileInput);
field_1.addType("dateRange", DateRangeInput);
field_1.addType("textarea", TextareaInput);
field_1.addType("password", TextInput);
field_1.addType("email", TextInput);
field_1.addType('text', TextInput);
field_1.addTypeWithWrapper("array", function (props) {
    return React.createElement("div", null,
        React.createElement("label", { className: "control-label" }, props.fieldSchema.label),
        React.createElement(FieldArray, { name: props.keyPath, rerenderOnEveryChange: Boolean(props.fieldSchema.getChildren), component: ArrayFieldRenderer, props: props }));
});
field_1.addType("autocomplete-async", AutoCompleteAsync);
buttons_1.setButton(function (props) {
    switch (props.type) {
        case 'submit':
            return React.createElement(antd_1.Button, { className: "raised-button", style: { margin: "15px" }, onClick: props.onClick, disabled: props.disabled, type: props.type, htmlType: props.type }, props.children);
        case "button":
            return React.createElement(antd_1.Button, { style: {
                    backgroundColor: "transparent",
                    margin: "15px"
                }, onClick: props.onClick, disabled: props.disabled, type: props.type, htmlType: props.type }, props.children);
        default:
            return null;
    }
});
//# sourceMappingURL=antd.js.map