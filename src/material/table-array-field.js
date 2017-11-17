"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Dialog_1 = require("material-ui/Dialog");
var React = require("react");
var redux_form_1 = require("redux-form");
var field_1 = require("../field");
var reselect_1 = require("reselect");
var dataSourceConfig = { text: "name", value: "value" };
var Grid = require("ag-grid-material-preset").Grid;
var render_fields_1 = require("../render-fields");
var readCSV = function (e, columns) {
    var files = e.target.files;
    return new Promise(function (resolve, reject) {
        Array.from(files).forEach(function (file) {
            if (file.type !== 'text/csv')
                return alert("必须导入csv文件");
            var fileReader = new FileReader();
            fileReader.onload = function () {
                var str = fileReader.result;
                require("csv-parse")(str, {
                    auto_parse: true,
                    auto_parse_date: false,
                    columns: columns,
                    skip_empty_lines: true,
                    trim: true
                }, function (err, chunks) {
                    err ? alert(err) : resolve(chunks);
                });
            };
            fileReader.onerror = reject;
            fileReader.readAsText(file);
        });
    });
};
var TableArrayField = (function (_super) {
    tslib_1.__extends(TableArrayField, _super);
    function TableArrayField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selector = reselect_1.createSelector(function (s) { return s.fieldSchema.children; }, function (oldSchema) {
            return oldSchema.map(function (x) { return (tslib_1.__assign({}, x, { hide: false })); });
        });
        _this.actions = [
            {
                name: "添加",
                call: function () {
                    _this.setState({
                        editedIndex: _this.props.fields.length
                    });
                    _this.props.fields.push(_this.props.fieldSchema.defaultValue || {});
                },
                isStatic: true
            },
            {
                name: "前移",
                call: function (t, e, x) {
                    _this.props.fields.swap(x.rowIndex, x.rowIndex - 1);
                },
                enabled: function (t, x) {
                    return x.rowIndex > 0;
                }
            },
            {
                name: "后移",
                call: function (t, e, x) {
                    _this.props.fields.swap(x.rowIndex, x.rowIndex + 1);
                },
                enabled: function (t, x) {
                    return x.rowIndex < _this.props.fields.length - 1;
                }
            },
            {
                name: "编辑",
                call: function (t, e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this.api.forEachNode(function (x) { return x.data === t && _this.setState({
                        editedIndex: x.rowIndex
                    }, function () {
                        window.dispatchEvent(new Event("resize"));
                    }); });
                }
            },
            {
                name: "删除",
                call: function (t, e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this.api.forEachNode(function (x) { return x.data === t && _this.props.fields.remove(x.rowIndex); });
                }
            },
            {
                name: "导出",
                call: function () {
                    try {
                        var content = (_this.props.fieldSchema.disableFixSeparatorForExcel ? "" : "sep=,\n") + _this.api.getDataAsCsv();
                        // for Excel, we need \ufeff at the start
                        // http://stackoverflow.com/questions/17879198/adding-utf-8-bom-to-string-blob
                        var blobObject = new Blob(["\ufeff", content], {
                            type: "text/csv"
                        });
                        // Internet Explorer
                        if (window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(blobObject, _this.props.fieldSchema.label);
                        }
                        else {
                            // Chrome
                            var downloadLink = document.createElement("a");
                            downloadLink.href = window.URL.createObjectURL(blobObject);
                            downloadLink.download = _this.props.fieldSchema.label;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                },
                isStatic: true
            }, {
                name: "导入",
                call: function (data) {
                    try {
                        var id = _this.props.meta.form + "fjorandomstring";
                        var input_1 = document.querySelector("input#" + id);
                        if (!input_1) {
                            input_1 = document.createElement("input");
                            input_1.id = id;
                            input_1.type = 'file';
                            input_1.style.display = "none";
                            document.body.appendChild(input_1);
                        }
                        input_1.onchange = function (e) {
                            readCSV(e, function (labels) {
                                return labels.map(function (label) {
                                    var item = _this.props.fieldSchema.children.find(function (x) { return x.label === String(label).trim(); });
                                    return item ? item.key : null;
                                });
                            }).then(function (data) {
                                data.forEach(_this.props.fields.push);
                                document.body.removeChild(input_1);
                            });
                        };
                        input_1.click();
                    }
                    catch (e) {
                        console.error(e);
                    }
                },
                isStatic: true
            }
        ];
        _this.state = {
            editedIndex: -1
        };
        _this.bindGridApi = function (api) { return _this.api = api; };
        _this.closeDialog = function () { return _this.setState({ editedIndex: -1 }); };
        return _this;
    }
    TableArrayField.prototype.render = function () {
        var value = this.props.fields.getAll() || empty;
        var schema = this.selector(this.props);
        return React.createElement("div", null,
            React.createElement(Grid, { data: value, schema: schema, overlayNoRowsTemplate: "<div style=\"font-size:30px\">" + "" + "</div>", height: 300, actions: this.actions, gridApi: this.bindGridApi }),
            React.createElement(Dialog_1.default, { autoScrollBodyContent: true, open: this.state.editedIndex >= 0, onRequestClose: this.closeDialog }, this.state.editedIndex < 0 ? null : render_fields_1.renderFields(this.props.meta.form, this.props.fieldSchema.children, this.props.keyPath + "[" + this.state.editedIndex + "]")));
    };
    return TableArrayField;
}(React.PureComponent));
var empty = [];
field_1.addTypeWithWrapper("table-array", function (props) {
    return React.createElement("div", { style: { paddingTop: 25 } },
        React.createElement("label", { className: "control-label" }, props.fieldSchema.label),
        React.createElement(redux_form_1.FieldArray, { name: props.keyPath, rerenderOnEveryChange: true, component: TableArrayField, props: props }));
});
//# sourceMappingURL=table-array-field.js.map