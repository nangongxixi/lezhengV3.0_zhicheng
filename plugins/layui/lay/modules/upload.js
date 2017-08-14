/*!
 @Title: layui.upload 单文件上传 - 全浏览器兼容版
 @Author: 贤心
 @License：MIT
 */



/** layui-v1.0.9_rls MIT License By http://www.layui.com */
/*
 ;
 layui.define("layer", function (e) {
 "use strict";
 var a = layui.jquery, t = layui.layer, i = (layui.device(), "layui-upload-enter"), n = "layui-upload-iframe", r = {
 icon: 2,
 shift: 6
 }, o = {file: "文件", video: "视频", audio: "音频"}, s = function (e) {
 this.options = e
 };
 s.prototype.init = function () {
 var e = this, t = e.options, r = a("body"), s = a(t.elem || ".layui-upload-file"), u = a('<iframe id="' + n + '" class="' + n + '" name="' + n + '"></iframe>');
 return a("#" + n)[0] || r.append(u), s.each(function (r, s) {
 s = a(s);
 var u = '<form target="' + n + '" method="' + (t.method || "post") + '" key="set-mine" enctype="multipart/form-data" action="' + (t.url || "") + '"></form>', l = s.attr("lay-type") || t.type;
 t.unwrap || (u = '<div class="layui-box layui-upload-button">' + u + '<span class="layui-upload-icon"><i class="layui-icon">&#xe608;</i>' + (s.attr("lay-title") || t.title || "上传" + (o[l] || "图片")) + "</span></div>"), u = a(u), t.unwrap || u.on("dragover", function (e) {
 e.preventDefault(), a(this).addClass(i)
 }).on("dragleave", function () {
 a(this).removeClass(i)
 }).on("drop", function () {
 a(this).removeClass(i)
 }), s.parent("form").attr("target") === n && (t.unwrap ? s.unwrap() : (s.parent().next().remove(), s.unwrap().unwrap())), s.wrap(u), s.off("change").on("change", function () {
 e.action(this, l)
 })
 })
 }, s.prototype.action = function (e, i) {
 var o = this, s = o.options, u = e.value, l = a(e), p = l.attr("lay-ext") || s.ext || "";
 if (u) {
 switch (i) {
 case"file":
 if (p && !RegExp("\\w\\.(" + p + ")$", "i").test(escape(u)))return t.msg("不支持该文件格式", r), e.value = "";
 break;
 case"video":
 if (!RegExp("\\w\\.(" + (p || "avi|mp4|wma|rmvb|rm|flash|3gp|flv") + ")$", "i").test(escape(u)))return t.msg("不支持该视频格式", r), e.value = "";
 break;
 case"audio":
 if (!RegExp("\\w\\.(" + (p || "mp3|wav|mid") + ")$", "i").test(escape(u)))return t.msg("不支持该音频格式", r), e.value = "";
 break;
 default:
 if (!RegExp("\\w\\.(" + (p || "jpg|png|gif|bmp|jpeg") + ")$", "i").test(escape(u)))return t.msg("不支持该图片格式", r), e.value = ""
 }
 s.before && s.before(e), l.parent().submit();
 var c = a("#" + n), f = setInterval(function () {
 var a;
 try {
 a = c.contents().find("body").text()
 } catch (i) {
 t.msg("上传接口存在跨域", r), clearInterval(f)
 }
 if (a) {
 clearInterval(f), c.contents().find("body").html("");
 try {
 a = JSON.parse(a)
 } catch (i) {
 return a = {}, t.msg("请对上传接口返回JSON字符", r)
 }
 "function" == typeof s.success && s.success(a, e)
 }
 }, 30);
 e.value = ""
 }
 }, e("upload", function (e) {
 var a = new s(e = e || {});
 a.init()
 })
 });
 */


layui.define('layer', function (exports) {
    "use strict";

    var $ = layui.jquery;
    var layer = layui.layer;
    var device = layui.device();

    var elemDragEnter = 'layui-upload-enter';
    var elemIframe = 'layui-upload-iframe';

    var msgConf = {
        icon: 2
        , shift: 6
    }, fileType = {
        file: '文件'
        , video: '视频'
        , audio: '音频'
    };

    var Upload = function (options) {
        this.options = options;
    };

    //初始化渲染
    Upload.prototype.init = function () {
        var that = this, options = that.options;
        var body = $('body'), elem = $(options.elem || '.layui-upload-file');
        var iframe = $('<iframe id="' + elemIframe + '" class="' + elemIframe + '" name="' + elemIframe + '"></iframe>');
        var limitSize = options.limitSize || null;

        //插入iframe
        $('#' + elemIframe)[0] || body.append(iframe);

        return elem.each(function (index, item) {
            item = $(item);
            var form = '<form target="' + elemIframe + '" method="' + (options.method || 'post') + '" key="set-mine" enctype="multipart/form-data" action="' + (options.url || '') + '"></form>';
            var type = item.attr('lay-type') || options.type; //获取文件类型
            //包裹ui元素
            if (!options.unwrap) {
                form = '<div class="layui-box layui-upload-button">' + form + '<span class="layui-upload-icon"><i class="layui-icon">&#xe608;</i>' + (
                        item.attr('lay-title') || options.title || ('上传' + (fileType[type] || '图片') )
                    ) + '</span></div>';
            }

            form = $(form);

            //拖拽支持
            if (!options.unwrap) {
                form.on('dragover', function (e) {
                    e.preventDefault();
                    $(this).addClass(elemDragEnter);
                }).on('dragleave', function () {
                    $(this).removeClass(elemDragEnter);
                }).on('drop', function () {
                    $(this).removeClass(elemDragEnter);
                });
            }

            //如果已经实例化，则移除包裹元素
            if (item.parent('form').attr('target') === elemIframe) {
                if (options.unwrap) {
                    item.unwrap();
                } else {
                    item.parent().next().remove();
                    item.unwrap().unwrap();
                }
            }
            ;

            //包裹元素
            item.wrap(form);

            //触发上传
            item.off('change').on('change', function () {
                that.action(this, type, limitSize);
            });
        });
    };

    //提交上传
    Upload.prototype.action = function (input, type, limitSize) {
        var that = this, options = that.options, val = input.value;
        var item = $(input), ext = item.attr('lay-ext') || options.ext || ''; //获取支持上传的文件扩展名;

        if (!val) {
            return;
        }
        ;

        //校验文件
        switch (type) {
            case 'file': //一般文件
                if (ext && !RegExp('\\w\\.(' + ext + ')$', 'i').test(escape(val))) {
                    layer.msg('不支持该文件格式', msgConf);
                    return input.value = '';
                }
                break;
            case 'video': //视频文件
                if (!RegExp('\\w\\.(' + (ext || 'avi|mp4|wma|rmvb|rm|flash|3gp|flv') + ')$', 'i').test(escape(val))) {
                    layer.msg('不支持该视频格式', msgConf);
                    return input.value = '';
                }
                break;
            case 'audio': //音频文件
                if (!RegExp('\\w\\.(' + (ext || 'mp3|wav|mid') + ')$', 'i').test(escape(val))) {
                    layer.msg('不支持该音频格式', msgConf);
                    return input.value = '';
                }
                break;
            default: //图片文件
                if (!RegExp('\\w\\.(' + (ext || 'jpg|png|gif|bmp|jpeg') + ')$', 'i').test(escape(val))) {
                    layer.msg('不支持该图片格式', msgConf);
                    return input.value = '';
                }
                break;
        }

        //判断文件大小
        if (limitSize) {
            var fileSize = input.files[0].size
            if (fileSize > limitSize) {
                layer.msg('文件过大', msgConf);
                return input.value = '';
            }
        }


        options.before && options.before(input);
        item.parent().submit();

        var iframe = $('#' + elemIframe), timer = setInterval(function () {
            var res;
            try {
                res = iframe.contentWindow.document.body;
            } catch (e) {
                layer.msg('上传接口存在跨域', msgConf);
                clearInterval(timer);
            }
            if (res) {
                clearInterval(timer);
                iframe.contents().find('body').html('');
                try {
                    res = JSON.parse(res);
                } catch (e) {
                    res = {};
                    return layer.msg('请对上传接口返回JSON字符', msgConf);
                }
                typeof options.success === 'function' && options.success(res, input);
            }
        }, 30);

        input.value = '';
    };

    //暴露接口
    exports('upload', function (options) {
        var upload = new Upload(options = options || {});
        upload.init();
    });
});
