/** common.js By Beginner Emain:zheng_jinfan@126.com HomePage:http://www.zhengjinfan.cn */
layui.define(['layer', 'element'], function (exports) {
    "use strict";

    var $ = layui.jquery,
        element = layui.element(),
        layer = layui.layer;

    var common = {
        apiUrl: 'http://192.168.0.249:8080/',
        //apiUrl: 'http://192.168.0.187/',
        //apiUrl: 'http://192.168.0.192/',
       //apiUrl: 'http://112.74.194.118:8077/',
        //获取url中的id参数值
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r !== null)
                return unescape(r[2]);
            return null;
        },
        init: function () {
            //表格全选
            $(document).on('ifChanged', '.table_selected_all', function (event) {
                var $input = $(this).parents('.site-table').find('input:not([disabled])');
                $input.iCheck(event.currentTarget.checked ? 'check' : 'uncheck');
                console.log(event.currentTarget.checked);
            });
            $(document).on('change', '.input-self', function () {
                var $checked = $(this).parents('.site-table').find('input:checked.input-self'),
                    $uncheck = $(this).parents('.site-table').find('input.input-self');
                if ($uncheck.length === $checked.length) {
                    $(this).parents('.site-table').find('.icheckbox_flat-green').addClass('checked');
                } else {
                    $(this).parents('.site-table').find('.icheckbox_flat-green').removeClass('checked');
                }
            });
            //复选框的全选
            $('input').iCheck({
                checkboxClass: 'icheckbox_flat-green'
            });
            console.log('inited!');
        },
        encode: function (strUni) {
            // use regular expressions & String.replace callback function for better efficiency
            // than procedural approaches
            var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
                function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
                })
                .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
                function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
                });
            return strUtf;
        },
        saveTabIndex: function (tabIndex) {
            //根据保存的下标值显示当前的选项卡
            var index = localStorage.getItem(tabIndex) || 0; //当前元素的下标
            $(".layui-tab-title").children().eq(index).addClass("layui-this").siblings().removeClass("layui-this");
            $(".layui-tab-content").children().eq(index).addClass("layui-show").siblings().removeClass("layui-show");

            //保存选项卡下标值（避免回退刷新）
            element.on('tab(' + tabIndex + ')', function (data) {
                localStorage.setItem(tabIndex, data.index);
            });
        },
        //时间选择器
        layTime: function layTime() {
            var num = $('input[name="begintime"]').length + 1;//时间选择器个数+1
            //时间选择控件
            var start = {
                min: '2009-06-16 23:59:59'
                , max: '2099-06-16 23:59:59'
                , istoday: false
                , choose: function (datas) {
                    end.min = datas; //开始日选好后，重置结束日的最小日期
                    end.start = datas; //将结束日的初始值设定为开始日
                }
            };
            var end = {
                min: laydate.now()
                , max: '2099-06-16 23:59:59'
                , istoday: false
                , choose: function (datas) {
                    start.max = datas; //结束日选好后，重置开始日的最大日期
                }
            };
            for (var j = 1; j < num; j++) {
                document.getElementById('LAY_demorange_s' + j).onclick = function () {
                    start.elem = this;
                    laydate(start);
                };
                document.getElementById('LAY_demorange_e' + j).onclick = function () {
                    end.elem = this
                    laydate(end);
                };
            }
        },
        //调用模版 { "orderHandleId":模版ID，"data":接口返回的数据 }
        renderTpl: function (orderHandleId, data) {
            var tplid = document.getElementById('orderHandle' + orderHandleId),
                viewid = document.getElementById('items-list' + orderHandleId);
            var getTpl = tplid.innerHTML;
            layui.laytpl(getTpl).render(data, function (html) {
                viewid.innerHTML = html;
                element.init();
            });
        },
        //添加，修改、查询 { "APIname":接口名称，"orderHandleId":模版ID，"page":当前页, "dataArr":放在body的json数组 }
        getJsonData: function (APIname, orderHandleId, dataArr) {
            var apiUrll = this.apiUrl;
            if (orderHandleId == '') {
                //添加，修改时
                var getData;
                $.ajax({
                    url: apiUrll + APIname,
                    type: "post",
                    dataType: "json",
                    data: dataArr,
                    async: false,
                    success: function (returnJSONN) {
                        getData = returnJSONN;
                    }
                });
                return getData;
            } else {
                var getData;
                //查询数据，映射模版时
                $.ajax({
                    url: apiUrll + APIname,
                    type: "post",
                    dataType: "json",
                    data: dataArr,
                    async: false,
                    success: function (data) {
                        common.renderTpl(orderHandleId, data);
                        getData = data;
                        layui.laypage({
                            cont: 'page' + orderHandleId,
                            pages: data.totalpages, //总页数
                            groups: 5, //连续显示分页数
                            counts: data.count,
                            skip: true,
                            jump: function (obj, first) {
                                //得到了当前页，用于向服务端请求对应数据
                                if (!first) {
                                    if (dataArr.pageindex) {
                                        dataArr["pageindex"] = obj.curr;
                                    } else {
                                        dataArr["page"] = obj.curr;
                                    }
                                    // var dataArr.pageindex = obj.curr;
                                    $.ajax({
                                        url: apiUrll + APIname,
                                        type: "post",
                                        dataType: "json",
                                        async: false,
                                        data: dataArr,
                                        success: function (data) {
                                            //$("#items-list"+orderHandleId).html('');
                                            common.renderTpl(orderHandleId, data);
                                            getData = data;
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
                return getData;
            }

        }
    };
    exports('common', common);
});
