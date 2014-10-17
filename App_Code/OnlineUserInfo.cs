using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

[Serializable]
/// <summary>
/// LoginUserInfo 的摘要说明
/// </summary>
public class OnlineUserInfo
{
	private int _userId;

	public int UserId
	{
		get { return _userId; }
		set { _userId = value; }
	}
	private string _hostAddress;

	public string HostAddress
	{
		get { return _hostAddress; }
		set { _hostAddress = value; }
	}
	private string _hostName;

	public string HostName
	{
		get { return _hostName; }
		set { _hostName = value; }
	}

	public OnlineUserInfo( int userId, string hostAddr, string hostName )
	{
		_userId = userId;
		_hostAddress = hostAddr;
		_hostName = hostName;
	}
}
