/** index.js By Beginner Emain:zheng_jinfan@126.com HomePage:http://www.zhengjinfan.cn */

var tab;

layui.config({
    base: 'js/',
    version: new Date().getTime()
}).use(['element', 'layer', 'navbar', 'tab'], function () {
    var element = layui.element(),
        $ = layui.jquery,
        layer = layui.layer,
        navbar = layui.navbar();
    tab = layui.tab({
        elem: '.admin-nav-card' //设置选项卡容器
        ,
        //maxSetting: {
        //	max: 5,
        //	tipMsg: '只能开5个哇，不能再开了。真的。'
        //},
        contextMenu: true,
        onSwitch: function (data) {
            console.log(data.id); //当前Tab的Id
            console.log(data.index); //得到当前Tab的所在下标
            console.log(data.elem); //得到当前的Tab大容器

            console.log(tab.getCurrentTabId())
        }
    });
    //iframe自适应
    $(window).on('resize', function () {
        var $content = $('.admin-nav-card .layui-tab-content');
        $content.height($(this).height() - 147);
        $content.find('iframe').each(function () {
            $(this).height($content.height());
        });
    }).resize();


    //设置navbar
    navbar.set({
        spreadOne: true,
        elem: '#admin-navbar-side',
        cached: true,
        data: navs
        /*cached:true,
         url: 'datas/nav.json'*/
    });
    //渲染navbar
    navbar.render();
    //监听点击事件
    navbar.on('click(side)', function (data) {
        tab.tabAdd(data.field);
    });

    $('.admin-side-toggle').on('click', function () {
        var sideWidth = $('#admin-side').width();
        if (sideWidth === 200) {
            $('#admin-body').animate({
                left: '0'
            }); //admin-footer
            $('#admin-footer').animate({
                left: '0'
            });
            $('#admin-side').animate({
                width: '0'
            });
        } else {
            $('#admin-body').animate({
                left: '200px'
            });
            $('#admin-footer').animate({
                left: '200px'
            });
            $('#admin-side').animate({
                width: '200px'
            });
        }
    });
    $('.admin-side-full').on('click', function () {
        var docElm = document.documentElement;
        //W3C
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        layer.msg('按Esc即可退出全屏');
    });


    //锁屏
    $(document).on('keydown', function () {
        var e = window.event;
        if (e.keyCode === 76 && e.altKey) {
            //alert("你按下了alt+l");
            lock($, layer);
        }
    });
    $('#lock').on('click', function () {
        lock($, layer);
    });

    //个人信息
    $('.js_userinfo').on('click', function () {
        layer.open({
            title: '个人信息',
            type: 1,
            area: ['700px', '600px'],
            shadeClose: true,
            content: $('#userinfo-temp').html(),
            shade: [0.9, '#393D49']
        })
        //给个人信息赋值
        var user = JSON.parse(localStorage.getItem('user'));
        if (user.imgurl) {
            $("#imgdd").attr("src",user.imgurl)
        }
        $(".username").html(user.username);
        $("#staffmumber").html(user.staffmumber);
        $("#staffname").html(user.staffname);
        if (parseInt(user.gender) == 0) {
            $("#gender").html('女');
        } else {
            $("#gender").html('男');
        }
        $("#idcardno").html(user.idcardno);
        $("#userphone").html(user.userphone);
        $.post('http://192.168.0.249:8080/api/bossApi/role/roleList', function (data) {
            for (var i = 0; data.data.length; i++) {
                if (data.data[i].roleid == user.roleid) {
                    $("#roleid").html(data.data[i].name);
                }
            }
        })
        $("#createtime").html(user.createtime);
    });

    // 修改手机号
    $(document).on('click', '.js_changeTel', function () {
        layer.open({
            title: '修改手机号',
            type: 1,
            area: ['500px', '250px'],
            shadeClose: true,
            content: $('#changeTel-temp').html(),
            shade: [0.9, '#393D49'],
            btn: ['提交', '取消'],
            btn1: function (index, layero) {
                layer.close(index)
            }
        })
    });

    // 修改密码
    $(document).on('click', '.js_changePsd', function () {
        var user = JSON.parse(localStorage.getItem('user'));
        layer.open({
            title: '修改密码',
            type: 1,
            area: ['400px', '350px'],
            shadeClose: true,
            content: $('#changePsd-temp').html(),
            shade: [0.9, '#393D49'],
            btn: ['提交', '取消'],
            success:function(){
                if(user){
                    $("#userdd").html(user.username);
                }else{
                    layer.msg('必须登录后才能操作！');
                }
            },
            btn1: function (index, layero) {
                var oldpwd = document.getElementsByName('new_tel')[0].value;
                var newpwd = document.getElementsByName('new_tel')[1].value;
                var repwd = document.getElementsByName('new_tel')[2].value;
                var uid = user.staffid;
                if (oldpwd.length<6 || newpwd.length <6) {
                    layer.msg('密码长度必须大于6位', {icon: 2, time: 1500});
                    return false;
                }
                if (oldpwd == '' || newpwd == '') {
                    layer.msg('必须输入原密码，新密码', {icon: 2, time: 1500});
                    return false;
                }
                if (oldpwd != user.password) {
                    layer.msg('原密码错误', {icon: 2, time: 1500});
                    return false;
                } else {
                    if (newpwd != repwd) {
                        layer.msg('新密码两次输入不一致', {icon: 2, time: 1500});
                        return false;
                    }
                    //请求修改密码的接口
                    var repwddata = {"staffid": uid, "password": oldpwd, "newpassword": newpwd};
                    //console.log(repwddata);
                    $.post('http://192.168.0.249:8080/api/bossApi/users/staffChangePW', repwddata, function (data) {
                        //console.log(data);
                        if (data.code == 1) {
                            layer.msg('操作成功', {icon: 1, time: 1500}, function () {
                                localStorage.clear();
                                location.href = "login.html";
                            });
                        }else{
                            layer.msg(data.msg, {icon: 2, time: 1500});
                        }
                    })
                }
            }
        })
    });

    //手机设备的简单适配
    var treeMobile = $('.site-tree-mobile'),
        shadeMobile = $('.site-mobile-shade');
    treeMobile.on('click', function () {
        $('body').addClass('site-mobile');
    });
    shadeMobile.on('click', function () {
        $('body').removeClass('site-mobile');
    });
});

var isShowLock = false;

function lock($, layer) {
    if (isShowLock)
        return;
    //自定页
    layer.open({
        title: false,
        type: 1,
        closeBtn: 0,
        anim: 6,
        content: $('#lock-temp').html(),
        shade: [0.9, '#393D49'],
        success: function (layero, lockIndex) {
            isShowLock = true;
            //给显示用户名赋值
            layero.find('div#lockUserName').text('admin');
            layero.find('input[name=lockPwd]').on('focus', function () {
                var $this = $(this);
                if ($this.val() === '输入密码解锁..') {
                    $this.val('').attr('type', 'password');
                }
            })
                .on('blur', function () {
                    var $this = $(this);
                    if ($this.val() === '' || $this.length === 0) {
                        $this.attr('type', 'text').val('输入密码解锁..');
                    }
                });
            //在此处可以写一个请求到服务端删除相关身份认证，因为考虑到如果浏览器被强制刷新的时候，身份验证还存在的情况
            //do something...
            //e.g.
            /*
             $.post(url,params,callback,'json');
             */
            //绑定解锁按钮的点击事件
            layero.find('button#unlock').on('click', function () {
                var $lockBox = $('div#lock-box');

                var userName = $lockBox.find('div#lockUserName').text();
                var pwd = $lockBox.find('input[name=lockPwd]').val();
                if (pwd === '输入密码解锁..' || pwd.length === 0) {
                    layer.msg('请输入密码..', {
                        icon: 2,
                        time: 1000
                    });
                    return;
                }
                unlock(userName, pwd);
            });
            /**
             * 解锁操作方法
             * @param {String} 用户名
             * @param {String} 密码
             */
            var unlock = function (un, pwd) {
                //这里可以使用ajax方法解锁
                /*$.post('api/xx',{username:un,password:pwd},function(data){
                 //验证成功
                 if(data.success){
                 //关闭锁屏层
                 layer.close(lockIndex);
                 }else{
                 layer.msg('密码输入错误..',{icon:2,time:1000});
                 }
                 },'json');
                 */
                isShowLock = false;
                //演示：默认输入密码都算成功
                //关闭锁屏层
                layer.close(lockIndex);
            };
        }
    });
};
