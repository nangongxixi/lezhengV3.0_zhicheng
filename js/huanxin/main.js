//创建链接
var conn = new WebIM.connection({
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: WebIM.config.isAutoLogin,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions
});


//页面初始加载
$(function () {
    //页面加载的时候，清除所有input框里面的值
    //$("#hideFriends").val();
    //$("#hideClass").val("t1");	
    //隐藏注册界面
    $("#imgdiv").hide();
    $("#main").addClass("hide");
    $("#myRegister").addClass("hide");
    //键盘事件。点击Enter直接登录
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            //要做的事情
            login();
        }
    };

    //添加消息回调
    conn.listen({
        //连接成功回调
        onOpened: function (message) {
            // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
            // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
            // 则无需调用conn.setPresence();
            console.log(message);
            console.log("连接成功");
            conn.setPresence();
            console.log("设置上线状态");
            $("#userinfo").html($("#userName").val());
            $("#mylogin").addClass("hide");
            $("#main").removeClass("hide");//显示比聊天框
            getFriends();
        },
        //连接关闭回调
        onClosed: function (message) {
            console.log(message);
            console.log("连接成功");
            conn.setPresence();
            console.log("设置上线状态");
            $("#userinfo").html($("#userName").val());
            $("#mylogin").addClass("hide");
            $("#main").removeClass("hide");//显示比聊天框
            getFriends();

            // alert("您已经掉线,请重新进入");
            //$("#imgdiv").hide();
            //$("#main").addClass("hide");
            //$("#myRegister").addClass("hide");
            //$("#mylogin").removeClass("hide");
            //console.log("连接关闭");

        },
        //收到文本消息
        onTextMessage: function (message) {
            var div = document.getElementById('content');
            div.scrollTop = div.scrollHeight;
            console.log(message);
            var myData = message.data;
            parseEmoji(myData, message.from, "get")
        },

    });
})

//注册
function register() {
    var huanxinUser = $("#hideFriends").attr("fanzhe");
    window.Demo = {
        groupType: 'groupchat'
    };
    Demo.conn = new WebIM.connection({
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
        https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
        url: WebIM.config.xmppURL,
        isAutoLogin: false,
        heartBeatWait: WebIM.config.heartBeatWait,
        autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
        autoReconnectInterval: WebIM.config.autoReconnectInterval
    });
    var options = {
        username: huanxinUser,
        password: huanxinUser,
        nickname: huanxinUser,
        appKey: "sczmgk#lezheng",
        success: function () {
            //alert("注册成功");            
        },
        error: function (errorInfo) {
            //alert("注册失败");
        },
        apiUrl: WebIM.config.apiURL
    };
    WebIM.utils.registerUser(options);
}

//添加好友
function addFriends() {
    var huanxinUser = $("#hideFriends").attr("fanzhe");
    var addFriends = function () {
        conn.subscribe({
            to: huanxinUser,
            // Demo里面接收方没有展现出来这个message，在status字段里面
            message: '加个好友呗!'
        });
    };
}
;

//点击登录
function login() {
    var huanxinUser = $("#hideFriends").attr("fanzhe");
    var options = {
        apiUrl: WebIM.config.apiURL,
        user: huanxinUser,
        pwd: huanxinUser,
        appKey: "sczmgk#lezheng"
    };
    conn.open(options);
}

//拉取历史聊天记录
function getCord() {
    var url = $("#content").attr("headpic");
    var url1 = $("#content").attr("headpic1");
    if (!url1) {
        url = "/public/home/img/toux.png";
    } else {
        url = url + url1;
    }
    $.ajax({
        type: "GET",
        url: "../index/GetCordAction",
        success: function (msg) {
            //alert(msg);
            var data = JSON.parse(msg);
            data = data.reverse();
            //alert(data.serialnumber);
            for (var i = 0; i < data.length; i++) {
                if (data[i].serialnumber == 4) {
                    $("#content").append("<li><div class='touxiangLeft'></div><p class='titleLeft'></p><p class='filenameLeft'>" + data[i].content + "</p><br></li>");
                } else {
                    $("#content").append("<li><div class='touxiangRight'></div><p class='titleRight'></p><p class='filenameRight''>" + data[i].content + "</p><br/><div class='clearFloat'></div></li>");
                    $(".touxiangRight").css("background-image", "url(" + url + ")");
                }
            }
            //保持滚动条底部
            $(window).resize(function () {
                $("#content").scrollTop($("#content").height());
                $('#content').scrollTop($('#content')[0].scrollHeight);
            });


        }
    });
}


//获取好友列表
function getFriends() {
    var friends = new Array();
    var da = "";
    conn.getRoster({
        success: function success(roster) {
            //查询一遍黑名单，如果好友中有和黑名单一样的，则不显示
            var curroster;
            for (var i in roster) {
                var ros = roster[i];
                if (ros.subscription === 'both' || ros.subscription === 'from' || ros.subscription === 'to') {
                    var friend = friends[i];
                    var txt = "<tr><th><div id='friendslist'></div></th><th class='oId' align='left'><span class='friendsName' onclick='chat()'>"
                        + ros.name
                        + "</span></th></tr>";
                    da += txt;
                }
            }
            if (da.length <= 0) {
                da = "<tr><th>暂无好友</th></tr>"
            }
            $("#myfriends").html(da);
        }
    });
}

//点击好友聊天
function chat() {
    var friends = $("#hideFriends").val();//选择的好友
    createNewTab(friends);//创建聊天的tab
    $("#from").html(friends);
}
//发送消息
function sendMessage() {
    //得到上传的是文件还是图片
    var pic = $("#pic").val();
    var myFile = $("#myFile").val();
    var url;
    if ($("#hideFriends").val() == "") {
        alert("请选择好友");
        return;
    }
    if ($("#message").val() == "" && pic == "" && myFile == "") {
        alert("消息不能为空");
        return;
    }

    // 单聊发送文本消息
    if ($("#message").val() != "") {
        var doctor = $("#hideFriends").val();
        var huanxinUser = $("#hideFriends").attr("fanzhe");
        var id = WebIM.connection.prototype.getUniqueId();// 生成本地消息id
        var msg = new WebIM.message('txt', id);     // 创建文本消息		
        //把聊天信息存入自己的数据库（[“患者“——〉”医生“]以便拉取聊天记录）
        /*
         {   
         "sessionid":261,
         "padding":"",  
         "chatmessage":"fdsafsd",
         "type":3,
         "sendnumber":"3", 
         "userid":8,			
         "openid":"868349024020382",
         "chatsender":"zifuchuan",
         "chatreceiver":"test25"
         }
         */
        var chatmessage = $("#message").val();

        $.ajax({
            type: "POST",
            url: "http://www.joygov.com:8010/api/wx/robot/question",
            data: {
                "openid": huanxinUser,
                "question": chatmessage
            },
            success: function (msg) {
                parseEmoji(chatmessage, huanxinUser, "post");
                parseEmoji(msg, huanxinUser, "get");
                $("#message").val("");
            }
        });
        //------------------------------- end -------------------------------


    }
}

//发送消息的时候解析表情
function parseEmoji(str, from, type) {
    //如果发送消息的人不是同一个人
    //var url = "/public/home/img/jiantou.png";
    var url = $("#content").attr("headpic");
    var url1 = $("#content").attr("headpic1");
    if (!url1) {
        url = "../../upload/logo.png";
    } else {
        url = url + url1;
    }
    if (type == "get") {//background-color:#87CEFA;
        //把聊天信息存入自己的数据库（[”医生“]——〉[“患者“]以便拉取聊天记录）
        var doctor = $("#hideFriends").val();
        var huanxinUser = $("#hideFriends").attr("fanzhe");
        $.ajax({
            type: "POST",
            url: "http://www.joygov.com:8010/api/wx/robot/question",
            data: {
                "openid": huanxinUser,
                "question": str
            },
            success: function (msg) {
                console.log(msg);
            }
        });
        //------------------------------- end -------------------------------

        if ($("#hideFriends").val() != "" && $("#hideFriends").val() != from) {
            createNewTab(from);
            var hideClass = "t1";
            $("#hideFriends").val();
            //alert("消息来自不同的人");
            $("." + hideClass).append("<li><div class='touxiangLeft'></div><p class='titleLeft'></p><p class='filenameLeft'>" + str + "</p><br></li>");
            //保持滚动条底部           
            $("#lb").scrollTop($("#content").height());
            $('#content').scrollTop($('#content')[0].scrollHeight);
        } else {
            createNewTab(from);
            var hideClass = "t1";
            $("#hideFriends").val();
            //alert("消息来自相同的人");
            $("." + hideClass).append("<li><div class='touxiangLeft'></div><p class='titleLeft'></p><p class='filenameLeft'>" + str + "</p><br></li>");
            //保持滚动条底部           
            $("#lb").scrollTop($("#content").height());
            $('#content').scrollTop($('#content')[0].scrollHeight);
        }
    } else {
        var hideClass = "t1";
        //当前的 
        $("." + hideClass).append("<li><div class='touxiangRight'></div><p class='titleRight'></p><p class='filenameRight''>" + str + "</p><br/><div class='clearFloat'></div></li>");
        //$("."+hideClass).append("<div class='touxiangRight'></div><p class='titleRight'></p><p class='filenameRight''>"+str+"</p><br/>");
        $(".touxiangRight").css("background-image", "url(" + url + ")");

        $("#lb").scrollTop($("#content").height());
        $('#content').scrollTop($('#content')[0].scrollHeight);
    }
}
/*根据不同人发送来的消息从而加载不同的聊天界面*/
var i = 0;
var className;
var contentName;
var idName;
var flag;
function createNewTab(fromUser) {
    //如果该联系人已经存在了，那么就不创建tab了
    i++;
    className = "t" + i;
    var lis = $("ul").find("li");
    if (lis.length > 0) {
        lis.each(function () {
            var idname = $(this).attr('id');
            if (fromUser == idname) {
                flag = false;
                var divClass = $(this).find("a").prop("name").split(".")[1];//显示内容
                $("#hideClass").val(divClass);
                return false;//跳出整个each遍历    return true  跳出当前each
            } else {
                flag = true;
            }
        })
        if (flag) {
            $("#hideClass").val("t1");
            $("#hideFriends").val();
            /*标题------聊天人*/
            $(".tabs").append("<li id='" + fromUser + "'><a href='#' name='." + className + "' onclick='show(this)'>" + fromUser + "</a></li>");
            /*内容------消息记录*/
            $("#content").append("<div class='" + className + "' style='display: none'></div>");
            if (i == 1) {
                $("." + className + ":first").show();
            }
        }
    } else {
        $("#hideClass").val("t1");
        $("#hideFriends").val();
        /*标题------聊天人*/
        $(".tabs").append("<li id='" + fromUser + "'><a href='#' name='." + className + "' onclick='show(this)'>" + fromUser + "</a></li><div style='width: 10px;height: 10px;;background-color: #00BFFF;float: left'></div>");
        /*内容------消息记录*/
        $("#content").append("<div class='" + className + "' style='display: none'></div>");
        if (i == 1) {
            $("." + className + ":first").show();
        }
    }
}
