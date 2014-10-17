
colorPicker = function(objBinding, fn)
{
	// 绑定到对象源
	if (!objBinding || !fn || objBinding._colorPicker)
	{
		return null;
	}
	
	objBinding._colorPicker = this;
	objBinding.attachEvent("onclick", function()
	{
		if (objBinding._colorPicker.isVisible)
		{
			objBinding._colorPicker.hide();
		}
		else
		{
			objBinding._colorPicker.show();
		}
	});
	
	document.attachEvent("onclick", function()
	{
		var cp = objBinding._colorPicker;
		if (cp.isVisible)
		{
			var evt = window.event;
			if (evt.srcElement != objBinding && evt.srcElement.offsetParent != cp.tblColorTable)
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
	this.divPanel.style.display = "none";
	this.isVisible = false;
	
	this.tblColorTable = document.createElement("table");
	with (this.tblColorTable)
	{
		cellPadding = "0px";
		cellSpacing = "1px";
		style.border = "solid 1px activecaption";
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
			width = "12px";
			height = "12px";
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
colorPicker.prototype.show = function()
{
	this.isVisible = true;
	this.divPanel.style.display = "block";
}

// 隐藏
colorPicker.prototype.hide = function()
{
	this.isVisible = false;
	this.divPanel.style.display = "none";
}

function showcolor()
{
	var cp = new colorPicker(document.getElementById("txtColors"), showColorName);
	if (cp)
	{
		document.body.appendChild(cp.divPanel);
	}
}

function showColorName(sender, colorName)
{
	document.title = colorName;
}