// 定义
var False = "False", True = "True";

var $ = function(objId)
{
	return document.getElementById(objId);
}

// 定义命名空间
var YQQChatRoom = new Object();
YQQChatRoom.pageMsgType = new Object();
YQQChatRoom.functionType = new Object();
YQQChatRoom.userInfo = new Object();
YQQChatRoom.controls = new Object();
YQQChatRoom.model = new Object();
YQQChatRoom.data = new Object();
YQQChatRoom.config = new Object();
YQQChatRoom.msgStyle = new Object();
YQQChatRoom.funcs = new Object();

// 一些常量
YQQChatRoom.config.dataReqPath = "datareq/qqchatroomreq.ashx";
YQQChatRoom.config.sendMsgUserColor = "blue";
YQQChatRoom.config.sendMsgToUserColor = "red";
YQQChatRoom.config.allPeopleStr = "所有人";
YQQChatRoom.config.viewDetailsStr = "查看 {0} 的详细信息";
YQQChatRoom.config.sysNotifyStr = "[系统公告]";
YQQChatRoom.config.sysNotifyColor = "red";
YQQChatRoom.config.getMsgTick = 1500;
YQQChatRoom.config.getUsersTick = 5000;
YQQChatRoom.config.sendMsgTick = 2000;
YQQChatRoom.config.sendTooFastStr = "您说话太快了，请坐下来喝杯茶，休息休息。";
YQQChatRoom.config.maxMsgLength = 400;
YQQChatRoom.config.msgTooLongStr = "一次发那么多字，口水多啊！想刷屏，没门！";
YQQChatRoom.config.secretStr = "[悄悄地]";
YQQChatRoom.config.secretToUserStr = "你";
YQQChatRoom.config.msgTypeFromStr = "A";
YQQChatRoom.config.msgTypeToStr = "B";
YQQChatRoom.config.msgTypeTimeStr = "(时间)";
YQQChatRoom.config.msgTypeMsgStr = "(消息)";
YQQChatRoom.config.topzIndex = 1;
YQQChatRoom.config.evenMsgBgColor = "#FFFFCC";
YQQChatRoom.config.evenMsg = false;
YQQChatRoom.config.maxMsgCount = 100;

// 定义消息枚举类型
YQQChatRoom.pageMsgType.loading = "images/loading.gif";
YQQChatRoom.pageMsgType.error = "images/error.gif";
YQQChatRoom.pageMsgType.success = "images/success.gif";

// 定义后台处理方法枚举类型
YQQChatRoom.functionType.userLogin = 0;
YQQChatRoom.functionType.getFaces = 1;
YQQChatRoom.functionType.getMessageTypes = 2;
YQQChatRoom.functionType.getPortraits = 3;
YQQChatRoom.functionType.getChatMessage = 4;
YQQChatRoom.functionType.sendMessage = 5;
YQQChatRoom.functionType.getMessageModel = 6;
YQQChatRoom.functionType.userLogout = 7;
YQQChatRoom.functionType.getOnlineUsers = 8;

// 处理页面载入
YQQChatRoom.funcs.onPageLoad = function()
{
	YQQChatRoom.controls.btnLoginSubmit = $("btnLoginSubmit");
	YQQChatRoom.controls.btnLoginRegister = $("btnLoginRegister");
	YQQChatRoom.controls.txtLoginUserName = $("txtLoginUserName");
	YQQChatRoom.controls.txtLoginPassword = $("txtLoginPassword");
	YQQChatRoom.controls.imgValidCode = $("imgValidCode");
	YQQChatRoom.controls.txtValidateCode = $("txtValidateCode");
	
	YQQChatRoom.controls.btnLoginSubmit.onclick = YQQChatRoom.funcs.userLogin;
	YQQChatRoom.controls.btnLoginRegister.onclick = YQQChatRoom.funcs.register;
	YQQChatRoom.controls.txtLoginUserName.focus();
	YQQChatRoom.controls.txtValidateCode.onkeypress = function()
	{
		if (window.event.keyCode == 13)
		{
			YQQChatRoom.funcs.userLogin();
		}
	}
	
	YQQChatRoom.controls.imgValidCode.onclick = function()
	{
		YQQChatRoom.controls.imgValidCode.src = "dataReq/QQValidateCode.ashx?" + YQQChatRoom.funcs.curTimeQueryStr();;
	}
}

// 跳转到注册页面
YQQChatRoom.funcs.register = function()
{
	document.URL = "register.aspx";
}

// 获取返回字符串
YQQChatRoom.data.dataReq = function()
{
	return YQQChatRoom.config.dataReqPath + "?" + YQQChatRoom.funcs.curTimeQueryStr();
}

// 封装一些Model
YQQChatRoom.model.messageInfo = function(messageId, userId, toUsersId, messageTypeId, isSecret, fontName, fontSize, bold, italic, underline, color, bgColor, content, sendTime)
{
	this.messageId = messageId;
	this.userId = userId;
	this.toUsersId = toUsersId;
	this.messageTypeId = messageTypeId;
	this.isSecret = isSecret;
	this.fontName = fontName;
	this.fontSize = fontSize;
	this.bold = bold;
	this.italic = italic;
	this.underline = underline;
	this.color = color;
	this.bgColor = bgColor;
	this.content = content;
	this.sendTime = sendTime;
}

YQQChatRoom.model.onlineUserInfo = function(userInfo, divItem, chkItem)
{
	this.userInfo = userInfo;
	this.divItem = divItem;
	this.chkItem = chkItem;
}

YQQChatRoom.model.userInfo = function(userId, userName, password, realName, nickName, birthday, gender, portraitId, hostAddr, hostName)
{
	this.userId = userId;
	this.userName = userName;
	this.password = password;
	this.realName = realName;
	this.nickName = nickName;
	this.birthday = birthday;
	this.gender = gender;
	this.portraitId = portraitId;
	this.hostAddr = hostAddr;
	this.hostName = hostName;
}

YQQChatRoom.model.faceInfo = function(faceId, faceName, description, iconPath)
{
	this.faceId = faceId;
	this.faceName = faceName;
	this.description = description;
	this.iconPath = iconPath;
}

YQQChatRoom.model.messageTypeInfo = function(messageTypeId, messageTypeName, isSystem, details)
{
	this.messageTypeId = messageTypeId;
	this.messageTypeName = messageTypeName;
	this.isSystem = isSystem;
	this.details = details;
}

YQQChatRoom.model.portraitInfo = function(portraitId, largeIconPath, smallIconPath)
{
	this.portraitId = portraitId;
	this.largeIconPath = largeIconPath;
	this.smallIconPath = smallIconPath;
}

YQQChatRoom.model.messageModelInfo = function(messageModelId, model)
{
	this.messageModelId = messageModelId;
	this.model = model;
}

// 用户登出
YQQChatRoom.funcs.userLogout = function()
{
	var xmlDom = new YQQChatRoom.XmlDom();
	
	// 生成请求字符串
	var xmlStr = YQQChatRoom.funcs.makeFullXmlStr(
		"functionType", YQQChatRoom.functionType.userLogout);
		
	xmlDom.open("post", YQQChatRoom.data.dataReq(), true);
	xmlDom.send(xmlStr);
	
	document.URL = "index.htm";
}

// 验证用户是否正确
YQQChatRoom.funcs.userLogin = function()
{
	var userName = YQQChatRoom.controls.txtLoginUserName.value;
	var password = YQQChatRoom.controls.txtLoginPassword.value;
	var validCode = YQQChatRoom.controls.txtValidateCode.value;
	
	YQQChatRoom.userInfo.userName = userName;
	YQQChatRoom.userInfo.password = password;
	YQQChatRoom.userInfo.validCode = validCode;
	
	// 判断密码是否为空
	if (!userName || !password)
	{
		YQQChatRoom.funcs.showPageMsg(YQQChatRoom.pageMsgType.error, "User name or password cannot be empty.");
		return;
	}
		
	var xmlDom = new YQQChatRoom.XmlDom();
	
	// 设置Loading
	YQQChatRoom.funcs.showPageMsg(YQQChatRoom.pageMsgType.loading, "Validating & Loading...");
	
	// 生成请求字符串
	var xmlStr = YQQChatRoom.funcs.makeFullXmlStr(
		"FunctionType", YQQChatRoom.functionType.userLogin,
		"ValidateCode", YQQChatRoom.userInfo.validCode);
		
	xmlDom.open("post", YQQChatRoom.data.dataReq(), true);
	xmlDom.onreadystatechange = function()
	{
		if (xmlDom.readyState == 4 || xmlDom.readyState == "complete")
		{
			var success = false;
			var xmlDoc = xmlDom.responseXML;
			if (xmlDoc.hasChildNodes)
			{
				// 获取根和返回的信息
				var docElem = xmlDoc.childNodes.item(0);
				var userInfo = new YQQChatRoom.model.userInfo(
					docElem.childNodes.item(0).text, 
					userName, 
					password,
					docElem.childNodes.item(1).text,
					docElem.childNodes.item(2).text,
					docElem.childNodes.item(3).text,
					docElem.childNodes.item(4).text,
					docElem.childNodes.item(5).text,
					docElem.childNodes.item(6).text,
					docElem.childNodes.item(7).text);
				
				YQQChatRoom.userInfo = userInfo;
				
				success = true;
			}
			
			// 判断执行是否成功
			if (success)
			{
				YQQChatRoom.funcs.loadChatRoom();
			}
			else
			{
				YQQChatRoom.funcs.showPageMsg(YQQChatRoom.pageMsgType.error, "Login Error.");	
			}
		}
	}
	xmlDom.send(xmlStr);
}

// 颜色选择器对象
YQQChatRoom.controls.colorPicker = function(objBinding, fn)
{
	// 绑定到对象源
	if (!objBinding || !fn || objBinding._colorPicker)
	{
		return null;
	}
	
	objBinding._colorPicker = this;
	objBinding.attachEvent("onclick", function()
	{
		var cp = objBinding._colorPicker;
		if (cp.isVisible)
		{
			cp.hide();
		}
		else
		{
			cp.show();
			
			var pos = new YQQChatRoom.controls.getObjectPos(objBinding);
			with (cp.divPanel.style)
			{
				left = pos.left + "px";
				top = (pos.top - cp.divPanel.offsetHeight) + "px";
			}
			pos = null;
		}
	});
	
	document.attachEvent("onclick", function()
	{
		var cp = objBinding._colorPicker;
		if (cp.isVisible)
		{
			var evt = window.event;
			if (evt.srcElement != objBinding && (!evt.srcElement._colorPicker || evt.srcElement._colorPicker != objBinding._colorPicker))
			{
				cp.hide();
				evt.returnValue = false;
				evt.cancelBubble = true;
			}
		}
	});
	
	// 定义系统已知颜色
	var knowColors = new Array("Transparent", "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenrod", "DarkGray", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DodgerBlue", "Firebrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "Goldenrod", "Gray", "Green", "GreenYellow", "Honeydew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenrodYellow", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquamarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenrod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen");
	
	this.divPanel = document.createElement("div");
	document.body.appendChild(this.divPanel);
	with (this.divPanel)
	{
		style.display = "none";
		style.position = "absolute";
	}
	this.isVisible = false;
	
	this.tblColorTable = document.createElement("table");
	with (this.tblColorTable)
	{
		cellPadding = "0px";
		cellSpacing = "1px";
		style.border = "solid 1px activecaption";
		style.backgroundColor = "white";
	}
	
	this.divPanel.appendChild(this.tblColorTable);
	this.tbyColorTable = document.createElement("tbody");
	this.tblColorTable.appendChild(this.tbyColorTable);
	
	// 以下以每行显示14格作为显示
	var cellIdx = 0;
	var tr;
	for (var n = 0; n < knowColors.length; n++)
	{
		var colorName = knowColors[n];
		
		if (cellIdx == 0)
		{
			tr = document.createElement("tr");
			this.tbyColorTable.appendChild(tr);
		}
		
		var td = document.createElement("td");
		td._colorName = colorName;
		td._colorPicker = this;
		td.title = colorName;
		tr.appendChild(td);
		
		with (td.style)
		{
			backgroundColor = colorName;
			width = "14px";
			height = "14px";
			cursor = "pointer";
		}
		
		cellIdx++;
		if (cellIdx > 13)
		{
			cellIdx = 0;
		}
		
		// 为颜色格添加事件
		td.onmouseover = function()
		{
			this.style.backgroundColor = "black";
		}
		
		td.onmouseout = function()
		{
			this.style.backgroundColor = this._colorName;
		}
		
		td.onclick = function()
		{
			fn.call(this._colorPicker, this, this._colorName);
			this._colorPicker.hide();
		}
	}
}

// 显示
YQQChatRoom.controls.colorPicker.prototype.show = function()
{
	this.isVisible = true;
	YQQChatRoom.config.topzIndex++;
	with (this.divPanel)
	{
		style.display = "block";
		style.zIndex = YQQChatRoom.config.topzIndex;
	}
}

// 隐藏
YQQChatRoom.controls.colorPicker.prototype.hide = function()
{
	this.isVisible = false;
	this.divPanel.style.display = "none";
}

// 表情选择器对象
YQQChatRoom.controls.facePicker = function(objBinding, fn)
{
	// 绑定到对象源
	if (!objBinding || !fn || objBinding._facePicker)
	{
		return null;
	}
	
	objBinding._facePicker = this;
	objBinding.attachEvent("onclick", function()
	{
		var fp = objBinding._facePicker;
		if (fp.isVisible)
		{
			fp.hide();
		}
		else
		{
			fp.show();
					
			var pos = new YQQChatRoom.controls.getObjectPos(objBinding);
			with (fp.divPanel.style)
			{
				left = pos.left + "px";
				top = (pos.top - fp.divPanel.offsetHeight) + "px";
			}
			pos = null;
		}
	});
	
	document.attachEvent("onclick", function()
	{
		var cp = objBinding._facePicker;
		if (cp.isVisible)
		{
			var evt = window.event;
			if (evt.srcElement != objBinding && (!evt.srcElement._facePicker || evt.srcElement._facePicker != objBinding._facePicker))
			{
				cp.hide();
				evt.returnValue = false;
				evt.cancelBubble = true;
			}
		}
	});
	
	this.divPanel = document.createElement("div");
	document.body.appendChild(this.divPanel);
	with (this.divPanel)
	{
		style.display = "none";
		style.position = "absolute";
	}
	this.isVisible = false;
	
	this.tblFaceTable = document.createElement("table");
	with (this.tblFaceTable)
	{
		cellPadding = "0px";
		cellSpacing = "1px";
		style.border = "solid 1px activecaption";
		style.backgroundColor = "white";
	}
	
	this.divPanel.appendChild(this.tblFaceTable);
	this.tbyFaceTable = document.createElement("tbody");
	this.tblFaceTable.appendChild(this.tbyFaceTable);
	
	// 以下以每行显示14格作为显示
	var faces = YQQChatRoom.data.faces;
	var cellIdx = 0;
	var tr;
	for (var n = 0; n < faces.length; n++)
	{
		var face = faces[n];
		
		if (cellIdx == 0)
		{
			tr = document.createElement("tr");
			this.tbyFaceTable.appendChild(tr);
		}
		
		var td = document.createElement("td");
		tr.appendChild(td);
		
		with (td)
		{
			className = "tdFaceIcon";
			title = face.description + " /" + face.faceName + ";";
			style.backgroundImage = "url(" + face.iconPath + ")";
			style.cursor = "pointer";
		}
		td._face = face;
		td._facePicker = this;
		
		// 为TD添加事件
		td.onmouseover = function()
		{
			this.style.backgroundColor = "activeborder";
		}
		
		td.onmouseout = function()
		{
			this.style.backgroundColor = "white";
		}
		
		td.onclick = function()
		{
			fn.call(this._facePicker, this, this._face);
			
			if (!window.event.shiftKey)
			{
				this._facePicker.hide();
			}
		}
		
		cellIdx++;
		if (cellIdx > 16)
		{
			cellIdx = 0;
		}
	}
}

// 显示
YQQChatRoom.controls.facePicker.prototype.show = function()
{
	this.isVisible = true;
	YQQChatRoom.config.topzIndex++;
	with (this.divPanel)
	{
		style.display = "block";
		style.zIndex = YQQChatRoom.config.topzIndex;
	}
}

// 隐藏
YQQChatRoom.controls.facePicker.prototype.hide = function()
{
	this.isVisible = false;
	this.divPanel.style.display = "none";
}

// 载入聊天室
YQQChatRoom.funcs.loadChatRoom = function()
{
	YQQChatRoom.funcs.showPageMsg(YQQChatRoom.pageMsgType.loading, "Chat Room Loading...");
	
	// 首先获得控件的引用
	YQQChatRoom.controls.divChatRoom = $("divChatRoom");
	YQQChatRoom.controls.divChatMessage = $("divChatMessage");
	YQQChatRoom.controls.txtSendMsg = $("txtSendMsg");
	YQQChatRoom.controls.btnSendMsg = $("btnSendMsg");
	YQQChatRoom.controls.btnLogout = $("btnLogout");
	YQQChatRoom.controls.btnModifyInfo = $("btnModifyInfo");
	YQQChatRoom.controls.divChatMessagePanel = $("divChatMessagePanel");
	YQQChatRoom.controls.divChatMessageTitle = $("divChatMessageTitle");
	YQQChatRoom.controls.divSendMsgPanel = $("divSendMsgPanel");
	YQQChatRoom.controls.divSendMsgTitle = $("divSendMsgTitle");
	YQQChatRoom.controls.selSendUsers = $("selSendUsers");
	YQQChatRoom.controls.selMsgTypes = $("selMsgTypes");
	YQQChatRoom.controls.selFonts = $("selFonts");
	YQQChatRoom.controls.selFontSize = $("selFontSize");
	YQQChatRoom.controls.divSendMsgBtns = $("divSendMsgBtns");
	YQQChatRoom.controls.divSendMsgFunc = $("divSendMsgFunc");
	YQQChatRoom.controls.divAffichePanel = $("divAffichePanel");
	YQQChatRoom.controls.divAfficheTitle = $("divAfficheTitle");
	YQQChatRoom.controls.divUsersListPanel = $("divUsersListPanel");
	YQQChatRoom.controls.divUsersListTitle = $("divUsersListTitle");
	YQQChatRoom.controls.divChatMessageContent = $("divChatMessageContent");
	YQQChatRoom.controls.divSendMsgContent = $("divSendMsgContent");
	YQQChatRoom.controls.divAfficheContent = $("divAfficheContent");
	YQQChatRoom.controls.divUsersListContent = $("divUsersListContent");
	YQQChatRoom.controls.ulSendMsgFunc = $("ulSendMsgFunc");
	YQQChatRoom.controls.imgSendMsgBold = $("imgSendMsgBold");
	YQQChatRoom.controls.imgSendMsgItalic = $("imgSendMsgItalic");
	YQQChatRoom.controls.imgSendMsgUnderLine = $("imgSendMsgUnderLine");
	YQQChatRoom.controls.imgFontColor = $("imgFontColor");
	YQQChatRoom.controls.imgFontBackColor = $("imgFontBackColor");
	YQQChatRoom.controls.imgSendMsgFace = $("imgSendMsgFace");
	YQQChatRoom.controls.chkSendMsgSecret = $("chkSendMsgSecret");
	YQQChatRoom.controls.lblOnlineCount = $("lblOnlineCount");
	
	YQQChatRoom.data.onlineUsers = new Array();
	
	// 绑定发送按钮
	YQQChatRoom.controls.btnSendMsg.onclick = YQQChatRoom.data.sendMessage;
	
	// 绑定登出按钮
	YQQChatRoom.controls.btnLogout.onclick = YQQChatRoom.funcs.userLogout;
	
	// 绑定密文复选框
	YQQChatRoom.msgStyle.isSecret = False;
	YQQChatRoom.controls.chkSendMsgSecret.onclick = function()
	{
		YQQChatRoom.msgStyle.isSecret = this.checked ? True : False;
		YQQChatRoom.controls.txtSendMsg.focus();
	}
	
	// 设置颜色绑定
	YQQChatRoom.msgStyle.foreColor = "black";
	YQQChatRoom.controls.cpForeColor = new YQQChatRoom.controls.colorPicker
	(
		YQQChatRoom.controls.imgFontColor, 
		function(sender, colorName)
		{
			YQQChatRoom.msgStyle.foreColor = colorName;
			YQQChatRoom.controls.txtSendMsg.style.color = colorName;
			YQQChatRoom.controls.txtSendMsg.focus();
		}
	);
	
	YQQChatRoom.msgStyle.bgColor = "transparent";
	YQQChatRoom.controls.cpBgColor = new YQQChatRoom.controls.colorPicker
	(
		YQQChatRoom.controls.imgFontBackColor, 
		function(sender, colorName)
		{
			YQQChatRoom.msgStyle.bgColor = colorName;
			YQQChatRoom.controls.txtSendMsg.style.backgroundColor = colorName;
			YQQChatRoom.controls.txtSendMsg.focus();
		}
	);
	
	// 设置消息类型
	YQQChatRoom.controls.selMsgTypes.onchange = function()
	{
		YQQChatRoom.msgStyle.msgType = this.options.item(this.selectedIndex)._msgType;
		YQQChatRoom.controls.txtSendMsg.focus();
	}
	
	// 设置字体绑定
	YQQChatRoom.msgStyle.fontFamily = YQQChatRoom.controls.txtSendMsg.style.fontFamily;
	YQQChatRoom.controls.selFonts.onchange = function()
	{
		var fontFamily = YQQChatRoom.funcs.getText(this.options.item(this.selectedIndex));
		YQQChatRoom.controls.txtSendMsg.style.fontFamily = fontFamily;
		YQQChatRoom.msgStyle.fontFamily = fontFamily;
		YQQChatRoom.controls.txtSendMsg.focus();
	}
	
	YQQChatRoom.msgStyle.fontSize = 10;
	YQQChatRoom.controls.selFontSize.onchange = function()
	{
		var fontSize = YQQChatRoom.funcs.getText(this.options.item(this.selectedIndex));
		YQQChatRoom.controls.txtSendMsg.style.fontSize = fontSize + "pt";
		YQQChatRoom.msgStyle.fontSize = fontSize;
		YQQChatRoom.controls.txtSendMsg.focus();
	}
	
	// 绑定Keyup
	YQQChatRoom.controls.txtSendMsg.onkeyup = function()
	{
		if (window.event.ctrlKey == true && window.event.keyCode == 13)
		{
			YQQChatRoom.data.sendMessage();
		}
	}
	
	// 设置功能按钮
	YQQChatRoom.msgStyle.bold = false;
	YQQChatRoom.msgStyle.italic = false;
	YQQChatRoom.msgStyle.underline = false;
	
	var liFuncs = YQQChatRoom.controls.ulSendMsgFunc.getElementsByTagName("li");
	for (var n = 0; n < liFuncs.length; n++)
	{
		var liFunc = liFuncs[n];
		if (liFunc.childNodes.length != 0)
		{
			var imgFunc = liFunc.childNodes.item(0);
			
			// 如果对应的子控件是图像
			if (imgFunc.tagName.toLowerCase() == "img")
			{
				// 处理鼠标在上面
				imgFunc.onmouseover = function()
				{
					if (!this._checked)
					{
						this.className += " imgSendFuncHover";
					}
				}
				
				// 处理鼠标出来
				imgFunc.onmouseout = function()
				{
					if (!this._checked)
					{
						this.className = this.className.replace(new RegExp(" imgSendFuncHover\\b"), "");
					}
				}
				
				// 处理鼠标点击
				imgFunc.onclick = function()
				{
					switch (this.id)
					{
						case "imgSendMsgBold":
							// 设置为粗体
							this._checked = !this._checked;
							
							YQQChatRoom.controls.txtSendMsg.style.fontWeight = this._checked ? "bold" : "normal";
							YQQChatRoom.msgStyle.bold = this._checked;
							YQQChatRoom.controls.txtSendMsg.focus();

							break;
						
						case "imgSendMsgItalic":
							// 设置为斜体
							this._checked = !this._checked;
							
							YQQChatRoom.controls.txtSendMsg.style.fontStyle = this._checked ? "italic" : "normal";
							YQQChatRoom.msgStyle.italic = this._checked;
							YQQChatRoom.controls.txtSendMsg.focus();

							break;
						
						case "imgSendMsgUnderLine":
							// 设置为下划线
							this._checked = !this._checked;
							
							YQQChatRoom.controls.txtSendMsg.style.textDecoration = this._checked ? "underline" : "none";
							YQQChatRoom.msgStyle.underline = this._checked;
							YQQChatRoom.controls.txtSendMsg.focus();

							break;
						
						case "imgFontColor":
							// 设置字体前景色
							break;
						
						case "imgFontBackColor":
							//字体背景色
							break;
							
						case "imgSendMsgFace":
							// 设置表情
							break;						
					}
					
					this.className = this._checked ? (this.className + " imgSendFuncChecked") : this.className.replace(new RegExp(" imgSendFuncChecked\\b"), "");
				}
			}
		}
	}
	
	var completedCount = 0;
	
	// 载入相关资源
	YQQChatRoom.data.getFaces(loadCallBack);
	YQQChatRoom.data.getMsgTypes(loadCallBack);
	YQQChatRoom.data.getPortraits(loadCallBack);
			
	// 成功则回调
	function loadCallBack(success)
	{
		completedCount++;
		
		if (completedCount == 3)
		{
			// 载入完成显示聊天室
			YQQChatRoom.controls.divLoginPanel = $("divLoginPanel");
			YQQChatRoom.controls.divLoginPanel.style.display = "none";
			
			// 设置显示用户信息
			document.body.attachEvent("onmousemove", YQQChatRoom.controls.showUserInfo);
			document.body.attachEvent("onclick", YQQChatRoom.controls.checkUserInfo);
			
			YQQChatRoom.controls.divChatRoom.style.display = "block";
			
			// 调整聊天室布局
			YQQChatRoom.controls.resize();
			document.body.attachEvent("onresize", YQQChatRoom.controls.resize);
			document.attachEvent("onresize", YQQChatRoom.controls.resize);
			window.attachEvent("onresize", YQQChatRoom.controls.resize);
			
			// 处理页面关闭
			window.attachEvent("onunload", YQQChatRoom.funcs.userLogout);
			
			YQQChatRoom.controls.txtSendMsg.focus();
			YQQChatRoom.funcs.hidePageMsg();
			
			// 开始获取聊天记录
			YQQChatRoom.data.lastMessageId = -1;
			YQQChatRoom.data.getChatMessage();
			YQQChatRoom.data.getOnlineUsers();
		}
	}
}

// 获取在线用户
YQQChatRoom.data.getOnlineUsers = function()
{
	var xmlDom = new YQQChatRoom.XmlDom();
	var xmlStr = YQQChatRoom.funcs.makeFullXmlStr(
		"functionType", YQQChatRoom.functionType.getOnlineUsers);
		
	xmlDom.open("post", YQQChatRoom.data.dataReq(), true);
	xmlDom.onreadystatechange = function()
	{
		if (xmlDom.readyState == 4 || xmlDom.readyState == "complete")
		{
			var success = false;
			var xmlDoc = xmlDom.responseXML;
			if (xmlDoc.hasChildNodes)
			{
				// 定义新的在线列表
				var newOnlineUsers = new Array();
				
				// 获取根和返回的信息
				var docElem = xmlDoc.childNodes.item(0);
				var onlineCount = docElem.childNodes.length;
				
				YQQChatRoom.funcs.setText(YQQChatRoom.controls.lblOnlineCount, onlineCount);
				
				for (var n = 0; n < onlineCount; n++)
				{
					// 生成用户信息
					var userNode = docElem.childNodes.item(n);
					var userInfo = new YQQChatRoom.model.userInfo(
						userNode.childNodes.item(0).text,
						userNode.childNodes.item(1).text,
						userNode.childNodes.item(2).text,
						userNode.childNodes.item(3).text,
						userNode.childNodes.item(4).text,
						userNode.childNodes.item(5).text,
						userNode.childNodes.item(6).text,
						userNode.childNodes.item(7).text,
						userNode.childNodes.item(8).text,
						userNode.childNodes.item(9).text
					);
					
					var userId = userInfo.userId;
					var onlineUserInfo = null;
					
					// 检查现有列表中没有的项，插入
					if (YQQChatRoom.data.onlineUsers[userId])
					{
						onlineUserInfo = YQQChatRoom.data.onlineUsers[userId];
					}
					else
					{
						// 添加条目到界面中
						var divItem = document.createElement("div");
						YQQChatRoom.controls.divUsersListContent.appendChild(divItem);
						
						var chkItemId = "chkUsersList" + userId;
						var chkItem = document.createElement("input");
						
						with (chkItem)
						{
							style.verticalAlign = "middle";
							type = "checkbox";
							id = chkItemId;
						}						
						divItem.appendChild(chkItem);
						
						var lblItem = YQQChatRoom.controls.makeUserButton(userInfo, divItem);
						var txtExp = document.createTextNode(" (" + userInfo.realName + ")");
						lblItem.appendChild(txtExp);
						lblItem.htmlFor = chkItemId;

						// 添加条目到列表中
						divItem._userInfo = userInfo;
						
						onlineUserInfo = new YQQChatRoom.model.onlineUserInfo(userInfo, divItem, chkItem);
						
						divItem._onlineUserInfo = onlineUserInfo;
						YQQChatRoom.data.onlineUsers[userId] = onlineUserInfo;					
					}
					
					// 在新项中也插入以便检查
					newOnlineUsers[userId] = onlineUserInfo;
				}
				
				// 检查新列表中没有的项，删除
				for (var n = 0; n < YQQChatRoom.data.onlineUsers.length; n++)
				{
					var onlineUserInfo = YQQChatRoom.data.onlineUsers[n];
					if (onlineUserInfo)
					{
						var userInfo = onlineUserInfo.userInfo;
						var userId = userInfo.userId;
						var divItem = onlineUserInfo.divItem;
						
						divItem.className = userId == YQQChatRoom.userInfo.userId ? "divItemCurrent" : "divItemNormal";
						
						// 没有元素
						if (!newOnlineUsers[userId])
						{
							YQQChatRoom.controls.divUsersListContent.removeChild(onlineUserInfo.divItem);
							YQQChatRoom.data.onlineUsers[n] = null;
							onlineUserInfo = null;
						}
					}
				}
			}
		}
	}
	xmlDom.send(xmlStr);
}

// 选择用户信息
YQQChatRoom.controls.checkUserInfo = function()
{
	var lblUserInfo = window.event.srcElement;
	if (lblUserInfo.tagName.toLowerCase() == "label" && lblUserInfo && lblUserInfo._userInfo)
	{
		if (!lblUserInfo.parentElement._onlineUserInfo)
		{
			// 遍历所有在线人，将CheckBox取消选择
			for (var n = 0; n < YQQChatRoom.data.onlineUsers.length; n++)
			{
				var onlineUser = YQQChatRoom.data.onlineUsers[n];
				if (onlineUser)
				{
					var selUserId = lblUserInfo._userInfo.userId;
					var userId = onlineUser.userInfo.userId;
					
					onlineUser.chkItem.checked = selUserId == userId;
				}
			}
		}
		
		YQQChatRoom.controls.selSendUsers.selectedIndex = 1;
		YQQChatRoom.controls.txtSendMsg.focus();
	}
}

// 显示用户信息
YQQChatRoom.controls.showUserInfo = function()
{
	var lblUserInfo = window.event.srcElement;
	if (lblUserInfo && lblUserInfo.tagName.toLowerCase() == "label" && lblUserInfo._userInfo && !lblUserInfo._ulUserInfo)
	{
		var userInfo = lblUserInfo._userInfo;
		var ulUserInfo;
		
		lblUserInfo.attachEvent("onmouseover", function()
		{
			// 获取位置
			var pos = new YQQChatRoom.controls.getObjectPos(lblUserInfo);
			
			// 创建UL显示
			ulUserInfo = document.createElement("ul");
			document.body.appendChild(ulUserInfo);
			ulUserInfo.className = "ulUserInfo";
			lblUserInfo._ulUserInfo = ulUserInfo;
			
			YQQChatRoom.topzIndex++;
			with (ulUserInfo.style)
			{
				left = ((pos.right > document.documentElement.clientWidth - 150) ? 
					(pos.left - ulUserInfo.offsetWidth ) :
					(pos.right + 8)) + "px";
				top = pos.top + "px";
				zIndex = YQQChatRoom.topzIndex;
			}
			
			// 头像
			var liPortrait = document.createElement("li");
			ulUserInfo.appendChild(liPortrait);
			
			var portrait = YQQChatRoom.data.portraits[userInfo.portraitId];		
			var imgPortrait = document.createElement("img");
			imgPortrait.src = portrait.largeIconPath;
			liPortrait.appendChild(imgPortrait);
			
			// username
			var liUserName = document.createElement("li");
			ulUserInfo.appendChild(liUserName);
			YQQChatRoom.funcs.setText(liUserName, "User Name: " + userInfo.userName);
			
			// realname
			var liRealName = document.createElement("li");
			ulUserInfo.appendChild(liRealName);
			YQQChatRoom.funcs.setText(liRealName, "Real Name: " + userInfo.realName);
			
			// gender
			var liGender = document.createElement("li");
			ulUserInfo.appendChild(liGender);
			YQQChatRoom.funcs.setText(liGender, "Gender: " + (userInfo.gender == True ? "Male" : "Female"));
			
			// nickname
			var liNickName = document.createElement("li");
			ulUserInfo.appendChild(liNickName);
			YQQChatRoom.funcs.setText(liNickName, "Nick Name: " + userInfo.nickName);
			
			// birthday
			var liBirthday = document.createElement("li");
			ulUserInfo.appendChild(liBirthday);
			YQQChatRoom.funcs.setText(liBirthday, "Birthday: " + userInfo.birthday.substr(0, userInfo.birthday.indexOf(" ") - 1));
			
			// ip
			var liIpAddr = document.createElement("li");
			ulUserInfo.appendChild(liIpAddr);
			YQQChatRoom.funcs.setText(liIpAddr, "IP Address: " + userInfo.hostAddr);
			
			// hostname
			var liHostName = document.createElement("li");
			ulUserInfo.appendChild(liHostName);
			YQQChatRoom.funcs.setText(liHostName, "Host Name: " + userInfo.hostName);
			
			pos = null;
		});
		
		// 鼠标移出删除元素
		lblUserInfo.attachEvent("onmouseout", function()
		{
			if (ulUserInfo)
			{
				document.body.removeChild(ulUserInfo);
				ulUserInfo = null;
				lblUserInfo._ulUserInfo = null;
			}
		});
	}
}

// 获取控件位置
YQQChatRoom.controls.getObjectPos = function(obj, parent)
{
    if (obj)
    {
        var leftPos = 0;
        var topPos = 0;
        var curObject = obj;
    	
        while (curObject != parent && curObject)
        {
            leftPos += curObject.offsetLeft - curObject.scrollLeft;
            topPos += curObject.offsetTop - curObject.scrollTop;

            var borderLeftWidth = parseInt(curObject.currentStyle.borderLeftWidth);
            var borderTopWidth = parseInt(curObject.currentStyle.borderTopWidth);
            var paddingLeft = parseInt(curObject.currentStyle.paddingLeft);
            var paddingTop = parseInt(curObject.currentStyle.paddingTop);
            var marginLeft = parseInt(curObject.currentStyle.marginLeft);
            var marginTop = parseInt(curObject.currentStyle.marginTop);
                
            leftPos += 
                isNaN(borderLeftWidth) ? 0 : parseInt(borderLeftWidth) + 
                isNaN(paddingLeft) ? 0 : parseInt(paddingLeft) + 
                isNaN(marginLeft) ? 0 : parseInt(marginLeft);
					
            topPos += 
                isNaN(borderTopWidth) ? 0 : parseInt(borderTopWidth) +
                isNaN(paddingTop) ? 0 : parseInt(paddingTop) +
                isNaN(marginTop) ? 0 : parseInt(marginTop);
                
			curObject = curObject.offsetParent;
        }
        
        this.left = leftPos;
        this.top = topPos;        
        this.width = obj.offsetWidth;
        this.height = obj.offsetHeight;
        this.right = leftPos + this.width;
        this.bottom = topPos + this.height;
    }
}

// 自动调整滚动条位置
YQQChatRoom.controls.scrollMsgList = function()
{
	with (YQQChatRoom.controls.divChatMessageContent.style)
	{
		try
		{
			width = ((YQQChatRoom.controls.divChatMessagePanel.clientWidth) - 16) + "px";
			height = (YQQChatRoom.controls.divChatMessagePanel.clientHeight - YQQChatRoom.controls.divChatMessageContent.offsetTop - 16) + "px";
		}
		catch(e) {}
	}

	with (YQQChatRoom.controls.divChatMessage)
	{
		// 改变子控件的宽度
		for (var n = 0; n < childNodes.length; n++)
		{
			var msgItem = childNodes.item(n);
			try
			{
				msgItem.style.width = (clientWidth - 8) + "px";
			}
			catch(e) {}
		}
		
		// 是滚动到最下方
		var srlHeight = scrollHeight;
		var height = YQQChatRoom.controls.divChatMessageContent.offsetHeight;
		
		if (srlHeight > height)
		{
			YQQChatRoom.controls.divChatMessageContent.scrollTop =  srlHeight - height + 16;
		}
	}
}

// 窗体改变大小
YQQChatRoom.controls.resize = function()
{
	var docWidth = document.documentElement.clientWidth;
	var docHeight = document.documentElement.clientHeight;
		
	// 聊天消息面板
	with (YQQChatRoom.controls.divChatMessagePanel.style)
	{
		left = "4px";
		top = "4px";
		
		try
		{
			width = (docWidth - 230) + "px";
			height = (docHeight - 200) + "px";
		}
		catch(e) {}
	}
	
	with (YQQChatRoom.controls.divChatMessageContent.style)
	{
		try
		{
			width = (docWidth - 246) + "px";
			height = (docHeight - 216 - YQQChatRoom.controls.divChatMessageContent.offsetTop) + "px";
		}
		catch(e) {}
	}
	YQQChatRoom.controls.scrollMsgList();
	
	// 发送消息面板
	with (YQQChatRoom.controls.divSendMsgPanel.style)
	{
		left = "4px";
		top = (docHeight - 190) + "px";
		
		try
		{
			width = (docWidth - 230) + "px";
			height = "184px";
		}
		catch(e) {}
	}
	
	with (YQQChatRoom.controls.txtSendMsg.style)
	{
		try
		{
			width = (docWidth - 244) + "px";
			height = (122 - YQQChatRoom.controls.divSendMsgFunc.offsetHeight) + "px";
		}
		catch(e){}
	}
	
	// 公告面板
	with (YQQChatRoom.controls.divAffichePanel.style)
	{
		left = (docWidth - 220) + "px";
		top = "4px";
		
		try
		{
			width = "215px";
			height = "180px";
		}
		catch(e) {}
	}
	
	// 在线用户列表
	with (YQQChatRoom.controls.divUsersListPanel.style)
	{
		left = (docWidth - 220) + "px";
		top = "190px";
		
		try
		{
			width = "215px";
			height = (docHeight - 196) + "px";
		}
		catch(e) {}
	}
	
	with (YQQChatRoom.controls.divUsersListContent.style)
	{
		try
		{
			width = "199px";
			height = (docHeight - 236) + "px";
		}
		catch(e) {}
	}
}

// 显示系统检查消息
YQQChatRoom.data.sendSysMessage = function(text)
{
	var divMsgItem = document.createElement("div");
	with (divMsgItem.style)
	{
		color = YQQChatRoom.config.sysNotifyColor;
		padding = "4px";
		fontWeight = "bold";
	}
	
	var imgErr = document.createElement("img");
	imgErr.src = "images/error.gif";
	imgErr.className = "imgMsgFace";
	divMsgItem.appendChild(imgErr);	
	
	var txtNode = document.createTextNode(text);
	divMsgItem.appendChild(txtNode);
	
	// 显示系统消息
	YQQChatRoom.controls.divChatMessage.appendChild(divMsgItem);	
	YQQChatRoom.controls.scrollMsgList();
}

// 发送消息
YQQChatRoom.data.sendMessage = function()
{
	// 首先检查是否在发送时间内
	var curTime = new Date();
	if (Math.abs(curTime - YQQChatRoom.data.lastSendTime) < YQQChatRoom.config.sendMsgTick)
	{
		YQQChatRoom.data.sendSysMessage(YQQChatRoom.config.sendTooFastStr);
		YQQChatRoom.controls.txtSendMsg.focus();
		return;
	}
	
	// 发送消息
	var msgContent = YQQChatRoom.funcs.getText(YQQChatRoom.controls.txtSendMsg);
	if (YQQChatRoom.funcs.trimString(msgContent) != "" || YQQChatRoom.data.msgTypes[YQQChatRoom.msgStyle.msgType.messageTypeId].details.toLowerCase().indexOf("/msg;") < 0)
	{
		// 显示说话太长
		if (msgContent.length > YQQChatRoom.config.maxMsgLength)
		{
			YQQChatRoom.data.sendSysMessage(YQQChatRoom.config.msgTooLongStr);
			YQQChatRoom.controls.txtSendMsg.focus();
			return;
		}
	
		YQQChatRoom.controls.txtSendMsg.disabled = true;
		YQQChatRoom.controls.btnSendMsg.disabled = true;
		
		// 首先清空定时器
		if (YQQChatRoom.data.getChatMsgHandler)
		{
			window.clearTimeout(YQQChatRoom.data.getChatMsgHandler);
		}
		
		// 构造发送到IDs
		var toUsersId = "";
		if (YQQChatRoom.controls.selSendUsers.selectedIndex == 1)
		{
			for (var n = 0; n < YQQChatRoom.data.onlineUsers.length; n++)
			{
				var onlineUser = YQQChatRoom.data.onlineUsers[n];
				if (onlineUser)
				{
					var chkItem = onlineUser.chkItem;
					var userInfo = onlineUser.userInfo;
					
					if (chkItem.checked)
					{
						toUsersId += userInfo.userId + ",";
					}
				}
			}
		}
		
		// 设置发送请求字符串
		var xmlStr = YQQChatRoom.funcs.makeFullXmlStr(
			"functionType", YQQChatRoom.functionType.sendMessage, 
			"ToUsersId", toUsersId,
			"MessageTypeId", YQQChatRoom.msgStyle.msgType.messageTypeId, 
			"IsSecret", YQQChatRoom.msgStyle.isSecret, 
			"FontName", YQQChatRoom.msgStyle.fontFamily, 
			"FontSize", YQQChatRoom.msgStyle.fontSize, 
			"Bold", YQQChatRoom.msgStyle.bold,
			"Italic", YQQChatRoom.msgStyle.italic,
			"Underline", YQQChatRoom.msgStyle.underline,
			"Color", YQQChatRoom.msgStyle.foreColor, 
			"BgColor", YQQChatRoom.msgStyle.bgColor, 
			"Content", escape(msgContent)); 
		
		var xmlDom = new YQQChatRoom.XmlDom();
		xmlDom.open("post", YQQChatRoom.data.dataReq(), true);
		xmlDom.onreadystatechange = function()
		{
			if (xmlDom.readyState == 4 || xmlDom.readyState == "complete")
			{
				var success = false;
				var xmlDoc = xmlDom.responseXML;
				if (xmlDoc.hasChildNodes)
				{
					// 获取根和返回的信息
					var docElem = xmlDoc.childNodes.item(0);
					var insertResult = parseInt(docElem.childNodes.item(0).text);
				}
				
				// 更新控件信息
				YQQChatRoom.controls.btnSendMsg.disabled = false;
				YQQChatRoom.controls.txtSendMsg.disabled = false;
				YQQChatRoom.funcs.setText(YQQChatRoom.controls.txtSendMsg, "");
				
				// 重新获取数据
				YQQChatRoom.data.getChatMessage();
				
				// 设置时间
				YQQChatRoom.data.lastSendTime = new Date();
				YQQChatRoom.controls.txtSendMsg.focus();
			}
		}
		xmlDom.send(xmlStr);
	}
}

// 接受消息
YQQChatRoom.data.getChatMessage = function()
{
	var xmlDom = new YQQChatRoom.XmlDom();
	var xmlStr = YQQChatRoom.funcs.makeFullXmlStr(
		"functionType", YQQChatRoom.functionType.getChatMessage, 
		"MessageId", YQQChatRoom.data.lastMessageId);
		
	xmlDom.open("post", YQQChatRoom.data.dataReq(), true);
	xmlDom.onreadystatechange = function()
	{
		if (xmlDom.readyState == 4 || xmlDom.readyState == "complete")
		{
			var success = false;
			var xmlDoc = xmlDom.responseXML;
			if (xmlDoc.hasChildNodes)
			{
				// 获取根和返回的信息
				var docElem = xmlDoc.childNodes.item(0);
				
				// 获取最大列表并获取消息列表
				YQQChatRoom.data.lastMessageId = parseInt(docElem.childNodes.item(0).text);
				
				if (docElem.childNodes.length > 1)
				{
					var msgsNode = docElem.childNodes.item(1);
					for (var n = 0; n < msgsNode.childNodes.length; n++)
					{
						var msgNode = msgsNode.childNodes.item(n);
						
						// 发送用户信息、接收用户信息、信息内容
						var userInfoNode = msgNode.childNodes.item(0);
						var toUsersInfoNode = msgNode.childNodes.item(1);
						var msgInfoNode = msgNode.childNodes.item(2);
						
						// 构造发送用户对象
						var userInfo = new YQQChatRoom.model.userInfo(
							userInfoNode.childNodes.item(0).text,
							userInfoNode.childNodes.item(1).text,
							userInfoNode.childNodes.item(2).text,
							userInfoNode.childNodes.item(3).text,
							userInfoNode.childNodes.item(4).text,
							userInfoNode.childNodes.item(5).text,
							userInfoNode.childNodes.item(6).text,
							userInfoNode.childNodes.item(7).text,
							userInfoNode.childNodes.item(8).text,
							userInfoNode.childNodes.item(9).text);
							
						// 构造接收用户数组
						var toUsersInfo = new Array();
						for (var m = 0; m < toUsersInfoNode.childNodes.length; m++)
						{
							var toUserInfoNode = toUsersInfoNode.childNodes.item(m);
							var toUserInfo = new YQQChatRoom.model.userInfo(
								toUserInfoNode.childNodes.item(0).text,
								toUserInfoNode.childNodes.item(1).text,
								toUserInfoNode.childNodes.item(2).text,
								toUserInfoNode.childNodes.item(3).text,
								toUserInfoNode.childNodes.item(4).text,
								toUserInfoNode.childNodes.item(5).text,
								toUserInfoNode.childNodes.item(6).text,
								toUserInfoNode.childNodes.item(7).text,
								toUserInfoNode.childNodes.item(8).text,
								toUserInfoNode.childNodes.item(9).text);
							
							toUsersInfo[m] = toUserInfo;
						}
						
						// 构造消息对象
						var msgInfo = new YQQChatRoom.model.messageInfo(
							msgInfoNode.childNodes.item(0).text,
							msgInfoNode.childNodes.item(1).text,
							msgInfoNode.childNodes.item(2).text,
							msgInfoNode.childNodes.item(3).text,
							msgInfoNode.childNodes.item(4).text,
							msgInfoNode.childNodes.item(5).text,
							msgInfoNode.childNodes.item(6).text,
							msgInfoNode.childNodes.item(7).text,
							msgInfoNode.childNodes.item(8).text,
							msgInfoNode.childNodes.item(9).text,
							msgInfoNode.childNodes.item(10).text,
							msgInfoNode.childNodes.item(11).text,
							unescape(msgInfoNode.childNodes.item(12).text),
							msgInfoNode.childNodes.item(13).text);
						
						// 构造显示出来的div并将信息保存在Div里
						var divMsgItem = document.createElement("div");
						divMsgItem._msgInfo = msgInfo;
						divMsgItem._userInfo = userInfo;
						divMsgItem._toUsersInfo = toUsersInfo;
						
						// 设置偶数行背景色
						divMsgItem.style.backgroundColor = YQQChatRoom.config.evenMsg ? YQQChatRoom.config.evenMsgBgColor : divMsgItem.style.backgroundColor;
						divMsgItem.style.padding = "2px 0px 2px 0px";
										
						YQQChatRoom.config.evenMsg = !YQQChatRoom.config.evenMsg;				
						
						YQQChatRoom.controls.divChatMessage.appendChild(divMsgItem);
						
						// 判断显示的消息数是否超出定值
						var msgLstCount = YQQChatRoom.controls.divChatMessage.childNodes.length;
						if (msgLstCount > YQQChatRoom.config.maxMsgCount)
						{
							for (var rn = 0; rn < msgLstCount - YQQChatRoom.config.maxMsgCount; rn++)
							{
								// 删除多于的消息记录
								YQQChatRoom.controls.divChatMessage.removeChild(YQQChatRoom.controls.divChatMessage.childNodes.item(1));
							}
						}
						
						// 添加箭头
						var arrowImg = document.createElement("img");
						arrowImg.src = ((msgInfo.toUsersId.indexOf(YQQChatRoom.userInfo.userId + ",") >= 0) ? "images/arrowself.gif" : "images/arrow.gif");
						arrowImg.className = "imgMsgPortrait";
						divMsgItem.appendChild(arrowImg);
						
						// 分析并生成输出消息类型
						var msgTypeId;
						
						// 判断是否自言自语，修改消息类型
						msgTypeId = (userInfo.userId + ",") == msgInfo.toUsersId ? 4 : msgInfo.messageTypeId;
						
						// 判断是否需要刷新在线用户
						if (msgTypeId == 1 || msgTypeId == 2)
						{
							YQQChatRoom.data.getOnlineUsers();
						}
						
						var msgType = YQQChatRoom.data.msgTypes[msgTypeId];
						var msgTypeStr = msgType.details;
						var startIdx = 0;
						
						// 判断是否系统公告
						if (msgType.isSystem == True)
						{
							var sysNotifyNode = document.createTextNode(YQQChatRoom.config.sysNotifyStr);
							divMsgItem.appendChild(sysNotifyNode);
							divMsgItem.style.color = YQQChatRoom.config.sysNotifyColor;
							divMsgItem.style.fontWeight = "bold";
						}
						
						// 判断是否悄悄话
						if (msgInfo.isSecret == True)
						{
							var secretNode = document.createTextNode(YQQChatRoom.config.secretStr);
							divMsgItem.appendChild(secretNode);
							divMsgItem.style.color = YQQChatRoom.config.sysNotifyColor;
							divMsgItem.style.fontWeight = "bold";
						}
						
						while (true)
						{
							// 获取斜杠
							var slashIdx = msgTypeStr.indexOf("/", startIdx);
							
							// 如果有"/"
							if (slashIdx != -1)
							{
								// 如果斜杠不在第一个
								if (slashIdx != 0)
								{
									// 添加文本标记
									var textValue = msgTypeStr.substr(startIdx, slashIdx - startIdx);
									var msgTextNode = document.createTextNode(textValue);
									divMsgItem.appendChild(msgTextNode);
									
									startIdx += textValue.length;
								}
								
								// 判断消息类型
								if (msgTypeStr.substr(slashIdx, 6).toLowerCase() == "/from;")
								{
									// 添加发送人标记
									var msgUserLabel = YQQChatRoom.controls.makeUserButton(userInfo, divMsgItem);
									msgUserLabel._msgInfo = msgInfo;
									
									// 累加起始位置
									startIdx += 6;
								} 
								else if (msgTypeStr.substr(slashIdx, 6).toLowerCase() == "/time;")
								{
									// 发送时间
									var timeStr = msgInfo.sendTime;
									timeStr = "(" + timeStr.substr(timeStr.indexOf(" ") + 1) + ")"
									
									var timeNode = document.createTextNode(timeStr);
									divMsgItem.appendChild(timeNode);
									
									// 累加起始位置
									startIdx += 6;
								}
								else if (msgTypeStr.substr(slashIdx, 4).toLowerCase() == "/to;")
								{
									// 发送给所有人
									if (toUsersInfo.length == 0 || msgInfo.isSecret == True)
									{
										var msgToUserLabel = document.createElement("label");
										
										// 如果为密文且不为自己发的，显示“你”，否则"显示所有人"
										var text = (msgInfo.isSecret == True && YQQChatRoom.userInfo.userId != msgInfo.userId) ? YQQChatRoom.config.secretToUserStr : YQQChatRoom.config.allPeopleStr;
										
										YQQChatRoom.funcs.setText(msgToUserLabel, text);
										divMsgItem.appendChild(msgToUserLabel);
									}
									else
									{
										var toUsersCount = toUsersInfo.length;
										for (var tu = 0; tu < toUsersCount; tu++)
										{
											var toUserInfo = toUsersInfo[tu];
											
											// 添加接受人标记
											YQQChatRoom.controls.makeUserButton(toUserInfo, divMsgItem);
											
											// 添加逗号
											if (tu != toUsersCount - 1)
											{
												var toUserSplit = document.createTextNode(", ");
												divMsgItem.appendChild(toUserSplit);
											}
										}
									}
										
									// 累加起始位置
									startIdx += 4;
								}
								else if (msgTypeStr.substr(slashIdx, 5).toLowerCase() == "/msg;")
								{
									// 处理接受消息
									var divMsgText = document.createElement("div");
									
									divMsgItem.appendChild(divMsgText);
									
									// 处理样式
									divMsgText.className = "divMsgText";
									with (divMsgText.style)
									{
										color = msgInfo.color;
										fontFamily = msgInfo.fontName;
										fontSize = msgInfo.fontSize + "pt";
										backgroundColor = msgInfo.bgColor;
										fontWeight = msgInfo.bold == True ? "bold" : "normal";
										textDecoration = msgInfo.underline == True ? "underline" : "none";
										fontStyle = msgInfo.italic == True ? "italic" : "normal";
									}
									
									// 添加发送人标记
									var msgText = msgInfo.content;
									var msgStartIdx = 0;
									while (true)
									{
										// 分离斜杠和分号
										var msgSlashIdx = msgText.indexOf("/", msgStartIdx);
										var msgSemiIdx = msgText.indexOf(";", msgSlashIdx);
										
										if (msgSlashIdx != -1 && msgSemiIdx != -1)
										{
											if (msgSlashIdx != 0)
											{
												var textValue = msgText.substr(msgStartIdx, msgSlashIdx - msgStartIdx);
												var lblText = document.createElement("label");
												
												YQQChatRoom.funcs.setText(lblText, textValue);
												divMsgText.appendChild(lblText);
												
												msgStartIdx += textValue.length;
											}
											
											// 分离表情名并创建Image
											var faceName = msgText.substr(msgSlashIdx + 1, msgSemiIdx - msgSlashIdx - 1);
											var faceInfo = YQQChatRoom.data.faces[faceName];
											
											if (faceInfo)
											{
												var faceImg = document.createElement("img");
												faceImg.alt = faceInfo.description;
												faceImg.title = faceInfo.description;
												faceImg.src = faceInfo.iconPath;
												faceImg.className = "imgMsgFace";
												
												divMsgText.appendChild(faceImg);
											}
											
											msgStartIdx = msgSemiIdx +1;
										}
										else
										{
											var textValue = msgText.substr(msgStartIdx, msgText.length - msgStartIdx + 1);
											var lblText = document.createElement("label");
											
											YQQChatRoom.funcs.setText(lblText, textValue);
											divMsgText.appendChild(lblText);
											
											break;
										}
									}
									
									// 累加起始位置
									startIdx += 5;
								}
							}
							else
							{
								// 如果找到了结尾
								var textValue = msgTypeStr.substr(startIdx, msgTypeStr.length - startIdx + 1);
								var msgTextNode = document.createTextNode(textValue);
								divMsgItem.appendChild(msgTextNode);
								
								break;
							}
						}
						
						// 设置自动滚动
						YQQChatRoom.controls.scrollMsgList();
					}
				}
				
				// 设置回发时间
				if (YQQChatRoom.data.getChatMsgHandler)
				{
					window.clearTimeout(YQQChatRoom.data.getChatMsgHandler);
				}
				YQQChatRoom.data.getChatMsgHandler = window.setTimeout(YQQChatRoom.data.getChatMessage, YQQChatRoom.config.getMsgTick);
			}
		}
	}
	xmlDom.send(xmlStr);
}

// 生成用户按钮
YQQChatRoom.controls.makeUserButton = function(userInfo, parent)
{
	// 添加头像
	var headImg = document.createElement("img");
	headImg.src = YQQChatRoom.data.portraits[userInfo.portraitId].smallIconPath;
	headImg.className = "imgMsgPortrait";
	parent.appendChild(headImg);
							
	// 添加标签
	var lbl = document.createElement("label");
	
	lbl.style.color = YQQChatRoom.config.sendMsgUserColor;
	lbl.style.cursor = "pointer";
	lbl._userInfo = userInfo;
	YQQChatRoom.funcs.setText(lbl, userInfo.nickName);
	parent.appendChild(lbl);
	
	return lbl;
}

// 载入头像类型
YQQChatRoom.data.getPortraits = function(loadCallBack)
{
	YQQChatRoom.data.portraits = new Array();
	
	var xmlDom = new YQQChatRoom.XmlDom();
	var xmlStr = YQQChatRoom.funcs.makeFullXmlStr(
		"functionType", YQQChatRoom.functionType.getPortraits);
	
	xmlDom.open("post", YQQChatRoom.data.dataReq(), true);
	xmlDom.onreadystatechange = function()
	{
		if (xmlDom.readyState == 4 || xmlDom.readyState == "complete")
		{
			var success = false;
			var xmlDoc = xmlDom.responseXML;
			if (xmlDoc.hasChildNodes)
			{
				// 获取根和返回的信息
				var docElem = xmlDoc.childNodes.item(0);
				for (var n = 0; n < docElem.childNodes.length; n++)
				{
					// 获取表情信息并添加到数组里
					var portraitDoc = docElem.childNodes.item(n);
					var portraitInfo = new YQQChatRoom.model.portraitInfo(
						portraitDoc.childNodes.item(0).text,
						portraitDoc.childNodes.item(1).text,
						portraitDoc.childNodes.item(2).text);
					YQQChatRoom.data.portraits[portraitInfo.portraitId] = portraitInfo;
				}
				
				success = true;
			}
			
			// 回调
			if (loadCallBack)
			{
				loadCallBack(success);
			}
		}
	}
	xmlDom.send(xmlStr);
}

// 载入消息模板
YQQChatRoom.data.getMsgModels = function(loadCallBack)
{
	YQQChatRoom.data.msgTypes = new Array();
	
	var xmlDom = new YQQChatRoom.XmlDom();
	var xmlStr = YQQChatRoom.funcs.makeFullXmlStr(
		"functionType", YQQChatRoom.functionType.getMessageModel);
		
	xmlDom.open("post", YQQChatRoom.data.dataReq(), true);
	xmlDom.onreadystatechange = function()
	{
		if (xmlDom.readyState == 4 || xmlDom.readyState == "complete")
		{
			var success = false;
			var xmlDoc = xmlDom.responseXML;
			if (xmlDoc.hasChildNodes)
			{
				// 获取根和返回的信息
				var docElem = xmlDoc.childNodes.item(0);
				for (var n = 0; n < docElem.childNodes.length; n++)
				{
					// 获取表情信息并添加到数组里
					var msgTypeDoc = docElem.childNodes.item(n);
					var msgTypeInfo = new YQQChatRoom.model.messageTypeInfo(
						msgTypeDoc.childNodes.item(0).text,
						msgTypeDoc.childNodes.item(1).text,
						msgTypeDoc.childNodes.item(2).text,
						msgTypeDoc.childNodes.item(3).text);
					YQQChatRoom.data.msgTypes[msgTypeInfo.messageTypeName] = msgTypeInfo;
				}
				
				success = true;
			}
			
			// 回调
			if (loadCallBack)
			{
				loadCallBack(success);
			}
		}
	}
	xmlDom.send(xmlStr);
}

// 载入消息类型
YQQChatRoom.data.getMsgTypes = function(loadCallBack)
{
	YQQChatRoom.data.msgTypes = new Array();
	
	var xmlDom = new YQQChatRoom.XmlDom();
	var xmlStr = YQQChatRoom.funcs.makeFullXmlStr(
		"functionType", YQQChatRoom.functionType.getMessageTypes);
		
	xmlDom.open("post", YQQChatRoom.data.dataReq(), true);
	xmlDom.onreadystatechange = function()
	{
		if (xmlDom.readyState == 4 || xmlDom.readyState == "complete")
		{
			var success = false;
			var xmlDoc = xmlDom.responseXML;
			if (xmlDoc.hasChildNodes)
			{
				var firstItem = true;
				
				// 获取根和返回的信息
				var docElem = xmlDoc.childNodes.item(0);
				for (var n = 0; n < docElem.childNodes.length; n++)
				{
					// 获取表情信息并添加到数组里
					var msgTypeDoc = docElem.childNodes.item(n);
					var msgTypeInfo = new YQQChatRoom.model.messageTypeInfo(
						msgTypeDoc.childNodes.item(0).text,
						msgTypeDoc.childNodes.item(1).text,
						msgTypeDoc.childNodes.item(2).text,
						msgTypeDoc.childNodes.item(3).text);
						
					YQQChatRoom.data.msgTypes[msgTypeInfo.messageTypeId] = msgTypeInfo;
					
					// 判断是否是系统
					if (msgTypeInfo.isSystem == False)
					{
						// 将聊天模板添加到数据库中
						var optMsgType = document.createElement("option");
						optMsgType._msgType = msgTypeInfo;
						optMsgType.value = msgTypeInfo;
						
						/*var detailTitle = msgTypeInfo.details;
						detailTitle = detailTitle.replace(/\/time;/g, YQQChatRoom.config.msgTypeTimeStr);
						detailTitle = detailTitle.replace(/\/from;/g, YQQChatRoom.config.msgTypeFromStr);
						detailTitle = detailTitle.replace(/\/to;/g, YQQChatRoom.config.msgTypeToStr);
						detailTitle = detailTitle.replace(/\/msg;/g, YQQChatRoom.config.msgTypeMsgStr);
						
						optMsgType.title = detailTitle;*/
						
						YQQChatRoom.funcs.setText(optMsgType, msgTypeInfo.messageTypeName);
						YQQChatRoom.controls.selMsgTypes.appendChild(optMsgType);
						
						// 记载第一个
						if (firstItem)
						{
							YQQChatRoom.msgStyle.msgType = msgTypeInfo;
							firstItem = false;
						}
					}
				}
				
				success = true;
			}
			
			// 回调
			if (loadCallBack)
			{
				loadCallBack(success);
			}
		}
	}
	xmlDom.send(xmlStr);
}

// 载入所有表情
YQQChatRoom.data.getFaces = function(loadCallBack)
{
	YQQChatRoom.data.faces = new Array();
	
	var xmlDom = new YQQChatRoom.XmlDom();
	var xmlStr = YQQChatRoom.funcs.makeFullXmlStr(
		"functionType", YQQChatRoom.functionType.getFaces);
		
	xmlDom.open("post", YQQChatRoom.data.dataReq(), true);
	xmlDom.onreadystatechange = function()
	{
		if (xmlDom.readyState == 4 || xmlDom.readyState == "complete")
		{
			var success = false;
			var xmlDoc = xmlDom.responseXML;
			if (xmlDoc.hasChildNodes)
			{
				// 获取根和返回的信息
				var docElem = xmlDoc.childNodes.item(0);
				for (var n = 0; n < docElem.childNodes.length; n++)
				{
					// 获取表情信息并添加到数组里
					var faceDoc = docElem.childNodes.item(n);
					var faceInfo = new YQQChatRoom.model.faceInfo(
						faceDoc.childNodes.item(0).text,
						faceDoc.childNodes.item(1).text,
						faceDoc.childNodes.item(2).text,
						faceDoc.childNodes.item(3).text);
					YQQChatRoom.data.faces[faceInfo.faceName] = faceInfo;
					YQQChatRoom.data.faces[n] = faceInfo;
				}
				
				YQQChatRoom.controls.fpFace = new YQQChatRoom.controls.facePicker
				(
					YQQChatRoom.controls.imgSendMsgFace,
					function(sender, face)
					{
						YQQChatRoom.controls.txtSendMsg.focus();
						document.selection.createRange().text += "/" + face.faceName + ";";
					}
				);
				
				success = true;
			}
			
			// 回调
			if (loadCallBack)
			{
				loadCallBack(success);
			}
		}
	}
	xmlDom.send(xmlStr);
}

// 生成包括用户密码的XmlStr
YQQChatRoom.funcs.makeFullXmlStr = function()
{
	var xmlStr = "";
	for (var n = 0; n < arguments.length / 2; n++)
	{
		var xmlName = YQQChatRoom.funcs.makeFullXmlStr.arguments[n * 2];
		var xmlValue = YQQChatRoom.funcs.makeFullXmlStr.arguments[n * 2 + 1];
		xmlStr += "<" + xmlName + ">" + xmlValue + "</" + xmlName + ">";
	}

	xmlStr = "<DocumentElement><UserName>" + YQQChatRoom.userInfo.userName + "</UserName><Password>" + YQQChatRoom.userInfo.password + "</Password>" + xmlStr + "</DocumentElement>";
	return xmlStr;
}

// 生成时间字符串
YQQChatRoom.funcs.curTimeQueryStr = function()
{
	var date = new Date();
	return "t=" + date.getDate() + date.getTime() + date.getMilliseconds();
}

// 自动生成Xml字符串
YQQChatRoom.funcs.makeXmlStr = function()
{
	var xmlStr = "";
	for (var n = 0; n < arguments.length / 2; n++)
	{
		var xmlName = YQQChatRoom.funcs.makeXmlStr.arguments[n * 2];
		var xmlValue = YQQChatRoom.funcs.makeXmlStr.arguments[n * 2 + 1];
		xmlStr += "<" + xmlName + ">" + xmlValue + "</" + xmlName + ">";
	}
	
	return xmlStr;
}

// 消除字符串的空格
YQQChatRoom.funcs.trimString = function(text)
{
	return text.replace(/(^\s*)|(\s*$)/g, '');
}

// 显示页面消息
YQQChatRoom.funcs.showPageMsg = function(pageMsgType, text)
{
	YQQChatRoom.controls.divPageMsgPanel = $("divPageMsgPanel");
	var imgPageMsg = $("imgPageMsg");
	var lblPageMsg = $("lblPageMsg");
	
	imgPageMsg.src = pageMsgType;
	YQQChatRoom.funcs.setText(lblPageMsg, text);
	YQQChatRoom.controls.divPageMsgPanel.style.display = "block";
}

// 隐藏页面消息
YQQChatRoom.funcs.hidePageMsg = function()
{
	YQQChatRoom.controls.divPageMsgPanel.style.display = "none";
}

// 设置控件文本
YQQChatRoom.funcs.setText = function(obj, text, isOverWrite)
{
	isOverWrite = isOverWrite == null ? true : isOverWrite;
	
	if (obj)
	{
		if (isOverWrite)
		{
			switch (obj.tagName.toLowerCase())
			{
				case "input", "textarea":
					obj.value = text;
					break;
					
				default: 
					if (obj.textContent)
					{
						obj.textContent = text;
					}
					else
					{
						obj.innerText = text;
					}
					
					break;
			}
		}
		else
		{
			switch (obj.tagName.toLowerCase())
			{
				case "input", "textarea":
					obj.value += text;
					break;
					
				default: 
					if (obj.textContent)
					{
						obj.textContent += text;
					}
					else
					{
						obj.innerText += text;
					}
					
					break;
			}
		}
	}
}

// 获取控件文本
YQQChatRoom.funcs.getText = function(obj)
{
	if (obj)
	{
		switch (obj.tagName.toLowerCase())
		{
			case "input", "textarea":
				return obj.value;
				
			default: 
				if (obj.textContent)
				{
					return obj.textContent;
				}
				else
				{
					return obj.innerText;
				}
		}
	}
}

// XmlDom
YQQChatRoom.XmlDom = function()
{
/*	if (window.ActiveXObject)
	{
		var arrSignatures = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"];
		
		for (var i = 0; i < arrSignatures.length; i++)
		{
			try
			{
				var oXmlDom = new ActiveXObject(arrSignatures[i]);
				return oXmlDom;
			}
			catch (oError) {}
		}
	}
	else if (document.implementation && document.implementation.createDocument)
	{
		var oXmlDom = document.implementation.createDocument("", "", null);
		oXmlDom.addEventListener("load", function()
			{
				this.__changeReadyState__(4);
			}, false);
		return oXmlDom;
	}*/
	
    var req;
    if (window.ActiveXObject && !window.XMLHttpRequest)
	{
        try
		{
			req = new ActiveXObject("Msxml2.XMLHTTP.6.0");
		}
        catch (e)
		{
            try
			{
				req = new ActiveXObject("Msxml2.XMLHTTP.4.0");
			}
            catch (e1)
			{
                try
				{
					req = new ActiveXObject("Msxml2.XMLHTTP.3.0");
				}
                catch (e2)
				{
                    try
					{
						req = new ActiveXObject("Microsoft.XMLHTTP");
					}
                    catch (e3)
					{
						req = null;
					}
                }
            }
        }
    }
    else
	{
		req = new XMLHttpRequest();
	}
	
    return req;
}

window.onload = YQQChatRoom.funcs.onPageLoad;