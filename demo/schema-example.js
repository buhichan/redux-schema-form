"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var arrayFieldChildren = [
    {
        key: "array-child",
        label: "嵌套字段#1",
        type: "text"
    },
    {
        key: "currency",
        label: "货币",
        type: "text",
        hide: true,
        listens: [
            {
                to: function (keyPath) {
                    return [keyPath + ".array-child"];
                },
                then: function (_a) {
                    var p = _a[0];
                    console.log(arguments);
                    return {
                        hide: !p
                    };
                }
            }
        ]
    }
];
function wait(s) {
    return new Promise(function (resolve) {
        setTimeout(resolve, s * 1000);
    });
}
exports.schema2 = [
    {
        key: "1",
        type: 'select',
        label: "1",
        options: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wait(1)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, [
                                {
                                    name: "宕机",
                                    value: "宕机",
                                }, {
                                    name: "误告",
                                    value: "误告",
                                },
                            ]];
                }
            });
        }); }
    }, {
        key: "2",
        type: 'select',
        label: "2",
        options: [],
        listens: [
            {
                to: ["1"],
                then: function (_a) {
                    var v = _a[0];
                    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, wait(0)];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/, {
                                            options: v === "宕机" ? [
                                                {
                                                    name: "宕机1",
                                                    value: "宕机1",
                                                },
                                                {
                                                    name: "宕机2",
                                                    value: "宕机2",
                                                },
                                            ] : [
                                                {
                                                    name: "误告1",
                                                    value: "误告1",
                                                },
                                                {
                                                    name: "误告2",
                                                    value: "误告2",
                                                },
                                            ]
                                        }];
                            }
                        });
                    });
                }
            }
        ]
    },
];
exports.schema = [
    {
        key: "text",
        type: "text",
        placeholder: "一般的文本,带验证",
        label: "文本属性",
    }, {
        key: 'select1',
        type: "select",
        label: "单选",
        placeholder: "一般的单选",
        required: true,
        options: [
            {
                name: "苹果",
                value: "apple"
            },
            {
                name: "梨子",
                value: "pear"
            }, {
                name: "哈哈",
                value: 0
            }
        ],
    }, {
        key: 'select-long-list',
        type: "select",
        label: "单选",
        mode: "multiple",
        placeholder: "long list single selection",
        maxOptionCount: 10,
        options: new Array(2000).fill(0).map(function (_, i) { return ({ name: "\u9009\u9879" + i, value: "option-" + i }); })
    }, {
        key: "checkbox",
        type: "checkbox",
        label: "勾选",
        placeholder: "一般的checkbox",
        required: true,
        disabled: true
    }, {
        key: "mulSel",
        type: "select",
        multiple: true,
        placeholder: "一般的多选",
        label: "多选",
        options: [
            {
                name: "苹果",
                value: "apple"
            },
            {
                name: "梨子",
                value: "pear"
            }
        ]
    }, {
        key: "datetime",
        type: "datetime",
        label: "datetime",
        listens: [
            {
                to: ["text"],
                then: function (v) { return ({
                    placeholder: v
                }); }
            }
        ]
    }, {
        key: "fileIsMultiple",
        type: "checkbox",
        label: "file input is multiple"
    }, {
        key: "file",
        type: "file",
        label: "文件",
        multiple: true,
        placeholder: "placeholder",
        // validate:(v:File|string)=>{
        //     if(v instanceof File && !v.type.startsWith('image/'))
        //         return "只能上传图片"
        //     return undefined
        // },
        onFileChange: function (_) {
            return new Promise(function (r) {
                setTimeout(function () {
                    r("/fake/url");
                }, 3000);
            });
        },
        listens: [{
                to: ['fileIsMultiple'],
                then: function (_a) {
                    var multiple = _a[0];
                    return ({ multiple: multiple });
                }
            }]
    }, {
        key: "file-file",
        type: "file",
        label: "文件(不上传) (single)",
        multiple: false,
        parse: function (fileList) {
            if (fileList && fileList.length > 1)
                return [fileList[1]];
            return fileList;
        },
        placeholder: "placeholder"
    }, {
        key: "ajax_select",
        type: "select",
        label: "单选(async)",
        options: function () {
            return fetch("options.json").then(function (res) { return res.json(); });
        }
    }, {
        key: "group1",
        type: "group",
        label: "组",
        children: [
            {
                type: "number",
                key: "phone",
                placeholder: "placeholder",
                // validate:v=>{
                //     if(v>900)
                //         return "最大900"
                //     return undefined
                // },
                label: "手机号",
                listens: [
                    {
                        to: ["checkbox"],
                        then: function (_a) {
                            var v = _a[0];
                            return ({ hide: v });
                        }
                    }
                ]
            }
        ]
    }, {
        key: "conditional1",
        type: "text",
        label: "当单选框为梨子的时候，隐藏",
        placeholder: "placeholder",
        listens: [
            {
                to: ["select1"],
                then: function (_a) {
                    var v = _a[0];
                    return ({ hide: v === 'pear', value: null });
                }
            }
        ]
    }, {
        key: "nest.1",
        type: "text",
        label: "nest",
        placeholder: "placeholder",
        style: {
            border: "1px dotted #23f0ff"
        }
    }, {
        key: "nest.2",
        type: "group",
        label: "组2",
        placeholder: "placeholder",
        children: [
            {
                type: 'date',
                key: "nested[0]",
                label: "日期"
            }, {
                key: "email",
                type: "email",
                fullWidth: true,
                label: "email with validation",
            },
        ]
    }, {
        key: "dependant_lv1",
        type: "select",
        label: "有依赖的单选lv1",
        placeholder: "placeholder",
        options: [
            {
                name: "植物",
                value: "plant"
            },
            {
                name: "动物",
                value: "animal"
            }
        ]
    }, {
        key: "dependant_lv2",
        type: "select",
        label: "有依赖的单选lv2",
        placeholder: "placeholder",
        listens: [
            {
                to: ["dependant_lv1"],
                then: function (_a) {
                    var v = _a[0];
                    return {
                        hide: !v,
                        options: v === 'animal' ? [
                            {
                                name: "狗",
                                value: "dog"
                            }, {
                                name: "猫",
                                value: "cat"
                            }
                        ] : v === 'plant' ? [
                            {
                                name: "苹果",
                                value: "apple"
                            },
                            {
                                name: "梨子",
                                value: "pear"
                            }
                        ] : []
                    };
                }
            }
        ],
        options: [],
        hide: true
    }, {
        key: "dependant_lv3",
        type: "select",
        label: "有依赖的单选lv3",
        placeholder: "placeholder",
        options: [],
        hide: true,
        listens: [{
                to: ["dependant_lv2"],
                then: function (_a) {
                    var v = _a[0];
                    return ({
                        options: v === 'cat' ? [
                            { name: 'kitten', value: 'kitten' }, { name: 'cat', value: 'cat' }, { name: 'kitty', value: 'kitty' }
                        ] :
                            v === 'dog' ?
                                [{ name: 'dogg1', value: "dogg1" }, { name: 'doggy', value: 'doggy' }, { name: 'puppy', value: 'puppy' }] :
                                [],
                        value: null,
                        hide: !(v === 'cat' || v === 'dog')
                    });
                }
            }]
    }, {
        key: "array",
        type: "array",
        placeholder: "placeholder",
        label: "Array(当select是梨子的时候会少一个child)",
        defaultValue: (_a = {},
            _a['array-child'] = "default-value foo",
            _a),
        listens: [
            {
                to: ["select1"],
                then: function (_a) {
                    var v = _a[0];
                    return {
                        children: v === 'pear' ? [
                            {
                                key: "array-child",
                                label: "array-child",
                                type: "text"
                            }
                        ] : [
                            {
                                key: "array-child",
                                label: "array-child",
                                type: "text"
                            }, {
                                key: "haha",
                                label: "dynamic-child",
                                type: "text"
                            }
                        ]
                    };
                }
            },
        ],
        children: []
    }, {
        key: "dynamic-array-alter",
        type: "array",
        label: "dynamic-array(使用listens)",
        children: arrayFieldChildren
    }, {
        key: "test-component",
        type: function (props) {
            var value = props.value, onChange = props.onChange, schema = props.schema;
            return React.createElement("div", null,
                React.createElement("label", { htmlFor: schema.key },
                    schema.label,
                    React.createElement("input", { type: "color", value: value, onChange: onChange })));
        },
        label: "type也可以是组件"
    },
    {
        key: "autocomplete1",
        type: "autocomplete",
        label: "自动完成(select)",
        placeholder: "placeholder",
        maxOptionCount: 5,
        options: new Array(1000).fill(0).map(function (_, i) { return ({ name: String(i), value: String(i) }); })
    },
    {
        key: "autocomplete2",
        type: "autocomplete-async",
        label: "自动完成(async options)",
        placeholder: "placeholder",
        options: function (t) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (/^\d+$/.test(t))
                    return [2 /*return*/, new Array(1000).fill(0).map(function (_, i) { return ({ name: String(i), value: "value-" + i }); })];
                else
                    return [2 /*return*/, [{ name: "0", value: 0 }]];
                return [2 /*return*/];
            });
        }); }
    }, {
        key: "textarea",
        type: "textarea",
        label: "textarea",
        placeholder: "placeholder"
    }, {
        key: "radio",
        type: "radio",
        label: "radio",
        placeholder: "placeholder",
        options: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        { name: "yes", value: true },
                        { name: "no", value: false },
                    ]];
            });
        }); }
    }, {
        key: "multiple-listen",
        label: "多重监听",
        placeholder: "placeholder",
        type: "text",
        listens: [{
                to: ["radio", 'text'],
                then: function (props) {
                    console.log(props);
                }
            }]
    }, {
        key: "virtual group, key does not count as key path",
        label: "some text",
        type: "virtual-group",
        children: [],
        listens: [{
                to: ["text"],
                then: function (_a) {
                    var v = _a[0];
                    return {
                        children: [
                            {
                                key: "text",
                                label: v,
                                type: 'text'
                            }
                        ]
                    };
                }
            }]
    }, {
        key: "select()",
        label: "select with option group",
        type: 'select',
        maxOptionCount: 10,
        options: new Array(1000).fill(0).map(function (x, i) {
            return {
                name: "数字:" + i + "",
                value: i,
                group: Math.pow(i % 10, 2) + "",
            };
        })
    }
];
//# sourceMappingURL=schema-example.js.map