<%@ WebHandler Language="C#" Class="QQChatRoomReq" %>

using System;
using System.Web;
using System.Xml;
using System.Data;
using System.Text;
using System.Web.SessionState;
using QQChatRoomTableAdapters;

public enum FunctionType
{
	UserLogin,
	GetFaces,
	GetMessageTypes,
	GetPortraits,
	GetChatMessages,
	SendMessage,
	GetMessageModel,
	UserLogout,
	GetOnlineUsers
}

public class QQChatRoomReq : IHttpHandler, IRequiresSessionState
{
	private QQChatRoom.UserRow _userInfo = null;
	private HttpContext _context = null;

	public HttpContext Context
	{
		get { return _context; }
		set { _context = value; }
	}

	public void ProcessRequest( HttpContext context )
	{
		_context = context;
		string responseStr = string.Empty;

		// 判断是否有传入的值
		if ( context.Request.InputStream.Length > 0 )
		{
			// 获取传入的信息
			XmlDocument xmlDoc = new XmlDocument();
			xmlDoc.Load( context.Request.InputStream );

			// 第一个节点存放用户名
			string userName = xmlDoc.DocumentElement.ChildNodes[ 0 ].InnerText;

			// 第二个节点存放密码
			string password = xmlDoc.DocumentElement.ChildNodes[ 1 ].InnerText;

			// 第三个节点存放功能类型
			FunctionType funcType = ( FunctionType )Convert.ToInt32( xmlDoc.DocumentElement.ChildNodes[ 2 ].InnerText );

			// 获取对应的用户信息
			UserTableAdapter userTableAdapter = new UserTableAdapter();
			QQChatRoom.UserDataTable userDataTable = userTableAdapter.GetDataByUserNamePassword( userName, password );

			if ( userDataTable.Rows.Count != 0 )
			{
				_userInfo = ( QQChatRoom.UserRow )userDataTable.Rows[ 0 ];

				// 根据功能类型判断
				switch ( funcType )
				{
					case FunctionType.UserLogin:
						responseStr = UserLogin();
						break;

					case FunctionType.GetFaces:
						responseStr = GetFaces();
						break;

					case FunctionType.GetMessageTypes:
						responseStr = GetMessageTypes();
						break;

					case FunctionType.GetPortraits:
						responseStr = GetPortraits();
						break;

					case FunctionType.GetChatMessages:
						// 第四个节点存放MessageId
						int messageId = Convert.ToInt32( xmlDoc.DocumentElement.ChildNodes[ 3 ].InnerText );
						responseStr = GetChatMessage( messageId );

						break;

					case FunctionType.SendMessage:
						// 第四个节点存放ToUsersId
						string toUsersId = xmlDoc.DocumentElement.ChildNodes[ 3 ].InnerText;

						// 第五个节点存放MessageTypeId
						int msgTypeId = Convert.ToInt32( xmlDoc.DocumentElement.ChildNodes[ 4 ].InnerText );

						// 第六个节点存放IsSecret
						bool isSecret = Convert.ToBoolean( xmlDoc.DocumentElement.ChildNodes[ 5 ].InnerText );

						// 第七个节点存放FontName
						string fontName = xmlDoc.DocumentElement.ChildNodes[ 6 ].InnerText;

						// 第八个节点存放FontSize
						int fontSize = Convert.ToInt32( xmlDoc.DocumentElement.ChildNodes[ 7 ].InnerText );

						// 第九个节点存放Bold
						bool bold = Convert.ToBoolean( xmlDoc.DocumentElement.ChildNodes[ 8 ].InnerText );

						// 第十个节点存放Italic
						bool italic = Convert.ToBoolean( xmlDoc.DocumentElement.ChildNodes[ 9 ].InnerText );

						// 第十一个节点存放Underline
						bool underline = Convert.ToBoolean( xmlDoc.DocumentElement.ChildNodes[ 10 ].InnerText );

						// 第十二个节点存放Color
						string color = xmlDoc.DocumentElement.ChildNodes[ 11 ].InnerText;

						// 第十三个节点存放BgColor
						string bgColor = xmlDoc.DocumentElement.ChildNodes[ 12 ].InnerText;

						// 第十四个节点存放Content
						string content = xmlDoc.DocumentElement.ChildNodes[ 13 ].InnerText;

						// SendTime要获取服务器的当前时间
						DateTime sendTime = DateTime.Now;

						responseStr = SendMessage( toUsersId, msgTypeId, isSecret, fontName, fontSize, bold, italic, underline, color, bgColor, content, sendTime );

						break;

					case FunctionType.UserLogout:
						responseStr = UserLogout();
						break;

					case FunctionType.GetOnlineUsers:
						responseStr = GetOnlineUsers();
						break;

					default:
						break;
				}
			}
		}

		// 写入输出流
		context.Response.ClearContent();
		context.Response.ContentType = "text/xml";
		context.Response.Write( responseStr );
		context.Response.End();
	}

	/// <summary>
	/// 获取在线人数
	/// </summary>
	/// <returns></returns>
	private string GetOnlineUsers()
	{
		StringBuilder sb = new StringBuilder();
		
		// 遍历所有在线人
		foreach ( OnlineUserInfo userInfo in OnlineUser.GetOnlineUsers( Context.Application ).Values )
		{
			sb.Append( "<OnlineUser>" );
			sb.Append( GetUserInfo( userInfo.UserId ) );
			sb.Append( "</OnlineUser>" );
		}

		return MakeFullXmlStr( sb.ToString() );
	}

	/// <summary>
	/// 用户登出
	/// </summary>
	/// <returns></returns>
	private string UserLogout()
	{
		// 从在线人数中删除
		bool result = OnlineUser.UserLogout( Context, _userInfo.User_Id );

		// 向数据库写入用户登出
		MessageTableAdapter msgTableAdapter = new MessageTableAdapter();
		msgTableAdapter.Insert( _userInfo.User_Id, string.Empty, 2, false, "Verdana", 8, true, false, true, "red", "transparent", string.Empty, DateTime.Now );

		return MakeFullXmlStr( new string[] { "LogoutResult", result.ToString() } );
	}

	/// <summary>
	/// 发送信息
	/// </summary>
	/// <param name="toUsersId"></param>
	/// <param name="msgTypeId"></param>
	/// <param name="isSecret"></param>
	/// <param name="fontName"></param>
	/// <param name="fontSize"></param>
	/// <param name="color"></param>
	/// <param name="bgColor"></param>
	/// <param name="content"></param>
	/// <param name="sendTime"></param>
	/// <returns></returns>
	private string SendMessage( string toUsersId, int msgTypeId, bool isSecret, string fontName, int fontSize, bool bold, bool italic, bool underline, string color, string bgColor, string content, DateTime sendTime )
	{
		MessageTableAdapter msgTableAdapter = new MessageTableAdapter();

		// 执行插入操作
		int result = msgTableAdapter.Insert( _userInfo.User_Id, toUsersId, msgTypeId, isSecret, fontName, fontSize, bold, italic, underline, color, bgColor, content, sendTime );

		return MakeFullXmlStr( new string[] { "InsertResult", result.ToString() } );
	}

	/// <summary>
	/// 根据用户索引和消息索引获得聊天记录
	/// </summary>
	/// <param name="userId"></param>
	/// <param name="messageId"></param>
	/// <returns></returns>
	private string GetChatMessage( int messageId )
	{
		MessageTableAdapter msgTableAdapter = new MessageTableAdapter();
		StringBuilder sb = new StringBuilder();
		int maxMessageId = ( int )msgTableAdapter.ScalarQueryMaxMessageId();

		// 添加最后一条记录
		sb.Append( "<MaxMessageId>" + maxMessageId.ToString() + "</MaxMessageId><Messages>" );

		// 如果为第一次获取只返回最后一条MessageId
		if ( messageId != -1 )
		{
			QQChatRoom.MessageDataTable msgDataTable = msgTableAdapter.GetDataByUserIdMessageId( _userInfo.User_Id, messageId );
			foreach ( QQChatRoom.MessageRow msgRow in msgDataTable.Rows )
			{
				// 添加发送者信息
				sb.Append( "<Message><User>" + GetUserInfo( msgRow.User_Id ) + "</User>" );

				// 添加接收者信息
				sb.Append( "<ToUsers>" );

				// 如果不为空才能发送
				if ( !string.IsNullOrEmpty( msgRow.ToUsers_Id ) )
				{
					string toUsersIdString = msgRow.ToUsers_Id.Substring( msgRow.ToUsers_Id.Length - 1 ) == "," ? msgRow.ToUsers_Id.Substring( 0, msgRow.ToUsers_Id.Length - 1 ) : msgRow.ToUsers_Id;
					string[] toUsersId = toUsersIdString.Split( ',' );

					foreach ( string toUserId in toUsersId )
					{
						sb.Append( "<ToUser>" + GetUserInfo( Convert.ToInt32( toUserId ) ) + "</ToUser>" );
					}
				}

				sb.Append( "</ToUsers>" );

				// 添加消息内容
				sb.Append( "<MessageInfo>" + MakeXmlStr( new string[] {
					"MessageId", msgRow.Message_Id.ToString(),
					"UserId", msgRow.User_Id.ToString(),
					"ToUsersId", msgRow.ToUsers_Id,
					"MessageTypeId", msgRow.MessageType_Id.ToString(),
					"IsSecret", msgRow.IsSecret.ToString(),
					"FontName", msgRow.FontName,
					"FontSize", msgRow.FontSize.ToString(),
					"Bold", msgRow.Bold.ToString(),
					"Italic", msgRow.Italic.ToString(),
					"Underline", msgRow.Underline.ToString(),
					"Color", msgRow.Color,
					"BgColor", msgRow.BgColor,
					"Content", msgRow.Content,
					"SendTime", msgRow.SendTime.ToString()} ) +
					"</MessageInfo>" );

				// 添加结束标记
				sb.Append( "</Message>" );
			}
		}

		sb.Append( "</Messages>" );

		return MakeFullXmlStr( sb.ToString() );
	}

	/// <summary>
	/// 根据用户Id获取用户
	/// </summary>
	/// <param name="userId"></param>
	/// <returns></returns>
	private string GetUserInfo( int userId )
	{
		// 从在线人数获取
		OnlineUserInfo userInfo = OnlineUser.GetUserInfo( Context.Application, userId );

		string ipAddr = string.Empty;
		string hostName = string.Empty;
		if ( userInfo == null )
		{
			ipAddr = "Unknown";
			hostName = "Unknown";
		}
		else
		{
			ipAddr = userInfo.HostAddress;
			hostName = userInfo.HostName;
		}

		// 从数据库中获取
		UserTableAdapter userTableAdapter = new UserTableAdapter();
		QQChatRoom.UserDataTable userDataTable = userTableAdapter.GetDataByUserId( userId );

		if ( userDataTable.Rows.Count == 0 )
		{
			return string.Empty;
		}

		QQChatRoom.UserRow userRow = ( QQChatRoom.UserRow )userDataTable.Rows[ 0 ];

		string result = MakeXmlStr( new string[] { 
			"UserId", userId.ToString(), 
			"UserName", userRow.User_Name, 
			"Password", userRow.Password, 
			"RealName", userRow.RealName, 
			"NickName", userRow.NickName, 
			"Birthday", userRow.Birthday.ToShortDateString(), 
			"Gender", userRow.Gender.ToString(), 
			"Portrait", userRow.Portrait_Id.ToString(), 
			"HostAddress", ipAddr, 
			"HostName", hostName } );

		return result;
	}

	/// <summary>
	/// 获取头像列表
	/// </summary>
	/// <returns></returns>
	private string GetPortraits()
	{
		PortraitTableAdapter portraitTableAdapter = new PortraitTableAdapter();
		QQChatRoom.PortraitDataTable portraitDataTable = portraitTableAdapter.GetData();
		StringBuilder sb = new StringBuilder();

		foreach ( QQChatRoom.PortraitRow portraitRow in portraitDataTable.Rows )
		{
			sb.Append( "<Portrait>" + MakeXmlStr( new string[] { 
				"PortraitId", portraitRow.Portrait_Id.ToString(), 
				"LargeIconPath", portraitRow.LargeIconPath, 
				"SmallIconPath", portraitRow.SmallIconPath } ) +
				"</Portrait>" );
		}

		return MakeFullXmlStr( sb.ToString() );
	}

	/// <summary>
	/// 获取消息列表
	/// </summary>
	/// <returns></returns>
	private string GetMessageTypes()
	{
		MessageTypeTableAdapter msgTypeTableAdapter = new MessageTypeTableAdapter();
		QQChatRoom.MessageTypeDataTable msgTypeDataTable = msgTypeTableAdapter.GetData();
		StringBuilder sb = new StringBuilder();

		foreach ( QQChatRoom.MessageTypeRow msgTypeRow in msgTypeDataTable.Rows )
		{
			sb.Append( "<MessageType>" + MakeXmlStr( new string[] { 
				"MessageTypeId", msgTypeRow.MessageType_Id.ToString(), 
				"MessageTypeName", msgTypeRow.MessageType_Name, 
				"IsSystem", msgTypeRow.IsSystem.ToString(), 
				"Details", msgTypeRow.Details } ) +
				"</MessageType>" );
		}
		string result = MakeFullXmlStr( sb.ToString() );

		return result;
	}

	/// <summary>
	/// 获取表情列表
	/// </summary>
	/// <returns></returns>
	private string GetFaces()
	{
		FaceTableAdapter faceTableAdapter = new FaceTableAdapter();
		QQChatRoom.FaceDataTable faceDataTable = faceTableAdapter.GetData();
		StringBuilder sb = new StringBuilder();

		foreach ( QQChatRoom.FaceRow faceRow in faceDataTable.Rows )
		{
			sb.Append( "<Face>" + MakeXmlStr( new string[] { 
				"FaceId", faceRow.Face_Id.ToString(), 
				"FaceName", faceRow.Face_Name, 
				"Description", faceRow.Description, 
				"IconPath", faceRow.IconPath } ) +
				"</Face>" );
		}
		string result = MakeFullXmlStr( sb.ToString() );

		return result;
	}

	/// <summary>
	/// 用户登录
	/// </summary>
	private string UserLogin()
	{
		string result = string.Empty;
		if ( _userInfo != null )
		{
			// 判断是否已经登录
			//if ( OnlineUser.GetUserInfo( Context.Application, _userInfo.User_Id ) != null )
			//{
			//    return result;
			//}
			
			// 用户登录记录
			string ipAddr = Context.Request.UserHostAddress;
			string hostName = Context.Request.UserHostName;

			result = MakeFullXmlStr( new string[] { 
				"UserId", _userInfo.User_Id.ToString(), 
				"RealName", _userInfo.RealName, 
				"NickName", _userInfo.NickName, 
				"Birthday", _userInfo.Birthday.ToShortDateString(), 
				"Gender", _userInfo.Gender.ToString(), 
				"Portrait", _userInfo.Portrait_Id.ToString(), 
				"HostAddress", ipAddr, 
				"HostName", hostName } );

			// 向数据库写入用户登录
			MessageTableAdapter msgTableAdapter = new MessageTableAdapter();
			msgTableAdapter.Insert( _userInfo.User_Id, string.Empty, 1, false, "Verdana", 8, true, false, true, "red", "transparent", string.Empty, DateTime.Now );

			// 添加到在线人数列表
			OnlineUser.UserLogin( Context.Application, _userInfo.User_Id, ipAddr, hostName );
		}

		return result;
	}

	/// <summary>
	/// 生成完整的Xml字符串
	/// </summary>
	/// <param name="xmlStr"></param>
	/// <returns></returns>
	public string MakeFullXmlStr( string[] arguments )
	{
		return MakeFullXmlStr( MakeXmlStr( arguments ) );
	}

	/// <summary>
	/// 生成完整的Xml字符串
	/// </summary>
	/// <param name="xmlStr"></param>
	/// <returns></returns>
	public string MakeFullXmlStr( string xmlStr )
	{
		return "<DocumentElement>" + xmlStr + "</DocumentElement>";
	}

	/// <summary>
	/// 生成Xml字符串
	/// </summary>
	/// <param name="arguments"></param>
	/// <returns></returns>
	public string MakeXmlStr( string[] arguments )
	{
		string xmlStr = string.Empty;
		for ( int n = 0; n < arguments.Length / 2; n++ )
		{
			string xmlName = arguments[ n * 2 ];
			string xmlValue = arguments[ n * 2 + 1 ];
			xmlStr += "<" + xmlName + ">" + xmlValue + "</" + xmlName + ">";
		}

		return xmlStr;
	}

	public bool IsReusable
	{
		get
		{
			return true;
		}
	}

}