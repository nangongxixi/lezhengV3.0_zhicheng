/**
 * Created by icarus on 2017/4/28.
 */
/** common.js By Beginner Emain:zheng_jinfan@126.com HomePage:http://www.zhengjinfan.cn */
layui.define(['layer', 'form'], function (exports) {
    "use strict";

    var $ = layui.jquery,
        form = layui.form();

    var formInStorage = {
        init: function (opt) {
            save(opt);
            read(opt)
        }
    };

    function read(opt) {
        var el = opt.formElem,
            data = JSON.parse(localStorage.getItem(opt.formSession)) || {};

        var forms = $(el);

        if (data['undefined']) {
            delete data['undefined']
        }

        for (var a in data) {
            if (forms.find("[name='" + a + "']")[0]) {
                var type = forms.find("[name='" + a + "']")[0].localName;
            }
            ;

            if (type === 'input') {
                type = forms.find("input[name='" + a + "']").attr('type')
            }

            //下拉框读取操作
            if (type === 'select') {
                var elem = $("[name='" + a + "']"),
                    text = '';
                elem.val(data[a]);
                elem.next().find("dd").each(function (i, e) {
                    if ($(e).attr('lay-value') === data[a]) {
                        $(e).addClass('layui-this');
                        text = $(e).text()
                    }
                });
                elem.next().find("input").val(text)
            }

            if (type === 'textarea') {
                forms.find("textarea[name='" + a + "']").val(data[a])
            }

            if (type === 'text') {
                forms.find("input[name='" + a + "']").val(data[a])
            }

            if (type === 'radio') {
                var radio = forms.find("input[name='" + a + "']");
                radio.next().removeClass('layui-form-radioed');
                radio.next().children('i').html('&#xe63f;').removeClass('layui-anim-scaleSpring');
                radio.attr("checked", false).each(function (i, e) {
                    if ($(e).val() === data[a]) {
                        $(e).prop("checked", true);
                        $(e).next().addClass('layui-form-radioed');
                        $(e).next().children('i').html('&#xe643;').addClass('layui-anim-scaleSpring');
                    }
                });
            }

            if (type === 'checkbox') {
                forms.find("input[name='" + a + "']").attr('checked', '');
                forms.find("input[name='" + a + "']").next().addClass('layui-form-checked')
            }
        }
    }

    function save(opt) {
        var el = opt.formElem,
            formData = opt.formSession;
        var storage = JSON.parse(localStorage.getItem(formData)) || {};
        $('input').trigger('input propertychange');
        $(el).on('keyup blur', 'input[type=text]', function () {
           // console.log($(this).attr('name'));
          //  console.log($(this).val());
            setVal($(this).attr('name'), $(this).val());
        });

        $(el).on('keyup', 'textarea', function () {
            setVal($(this).attr('name'), $(this).val());
        });

        form.on('select', function (data) {
            setVal(data.elem.name, data.value)
        });

        form.on('radio', function (data) {
            setVal(data.elem.name, data.value)
        });

        form.on('checkbox', function (data) {
            //console.log(data.elem.checked)
            if (data.elem.checked === false) {
                delete storage[data.elem.name];
                localStorage.setItem(formData, JSON.stringify(storage));
            } else {
                setVal(data.elem.name, data.value)
            }
            if (data.elem.name === 'checkAll') {
                var all = $("[name='checkAll']").siblings('.layui-input-block').find('input');
                if (data.elem.checked === false) {
                    all.each(function (i, e) {
                        $(e).removeAttr('checked');
                        $(e).next().removeClass('layui-form-checked');
                        delete storage[$(e).attr('name')];
                    });
                    localStorage.setItem(formData, JSON.stringify(storage));
                } else {
                    all.each(function (i, e) {
                        $(e).prop('checked', true);
                        $(e).next().addClass('layui-form-checked');
                        setVal($(e).attr('name'), data.value)
                    });
                }
            }
        });

        form.on('switch', function (data) {
            if (data.elem.checked === false) {
                delete storage[data.elem.name];
                localStorage.setItem(formData, JSON.stringify(storage));
            } else {
                setVal(data.elem.name, data.value)
            }

        });

        //保存数据到localStorage
        function setVal(name, val) {
          // var storage = JSON.parse(localStorage.getItem(formData));  //更新输入
           // console.log(storage)
            storage[name] = val;
            var data = JSON.stringify(storage);
            localStorage.setItem(formData, data);
           // console.log(storage)
           // console.log(localStorage)
        }
    }

    exports('formInStorage', formInStorage);
});
