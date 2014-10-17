using System;
using System.Collections.Generic;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

/// <summary>
/// LoginUser 的摘要说明
/// </summary>
public class OnlineUser
{
	//private static readonly OnlineUser _onlineUser = new OnlineUser();

	private OnlineUser()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//
	}

	/// <summary>
	/// 初始化在线人数列表
	/// </summary>
	/// <param name="application"></param>
	public static void InitOnlineUserList( HttpContext context )
	{
		InitOnlineUserList( context.Application );
	}

	/// <summary>
	/// 初始化在线人数列表
	/// </summary>
	/// <param name="application"></param>
	public static void InitOnlineUserList( HttpApplicationState application )
	{
		Dictionary<int, OnlineUserInfo> onlineUsers = new Dictionary<int, OnlineUserInfo>();
		application[ "OnlineUsers" ] = onlineUsers;
	}

	/// <summary>
	/// 用户登录
	/// </summary>
	/// <param name="context"></param>
	/// <param name="userId"></param>
	/// <param name="hostAddr"></param>
	/// <param name="hostName"></param>
	public static void UserLogin( HttpContext context, int userId, string hostAddr, string hostName )
	{
		UserLogin( context.Application, userId, hostAddr, hostName );
	}

	/// <summary>
	/// 用户登录
	/// </summary>
	/// <param name="userId"></param>
	/// <param name="hostAddr"></param>
	/// <param name="hostName"></param>
	public static void UserLogin( HttpApplicationState application, int userId, string hostAddr, string hostName )
	{
		OnlineUserInfo userInfo = new OnlineUserInfo( userId, hostAddr, hostName );
		UserLogin( application, userInfo );
	}

	/// <summary>
	/// 用户登录
	/// </summary>
	/// <param name="context"></param>
	/// <param name="userInfo"></param>
	public static void UserLogin( HttpContext context, OnlineUserInfo userInfo )
	{
		UserLogin( context.Application, userInfo );
	}

	/// <summary>
	/// 用户登录
	/// </summary>
	/// <param name="userInfo"></param>
	public static void UserLogin( HttpApplicationState application, OnlineUserInfo userInfo )
	{
		Dictionary<int, OnlineUserInfo> onlineUsers = GetOnlineUsers( application );

		// 尝试获取指定的在线用户
		OnlineUserInfo getUserInfo = null;
		bool hasUser = onlineUsers.TryGetValue( userInfo.UserId, out getUserInfo );

		if ( hasUser )
		{
			onlineUsers[ userInfo.UserId ] = userInfo;
		}
		else
		{
			onlineUsers.Add( userInfo.UserId, userInfo );
		}
	}

	/// <summary>
	/// 用户登出
	/// </summary>
	/// <param name="application"></param>
	/// <param name="userInfo"></param>
	/// <returns></returns>
	public static bool UserLogout( HttpContext context, OnlineUserInfo userInfo )
	{
		return UserLogout( context.Application, userInfo );
	}

	/// <summary>
	/// 用户登出
	/// </summary>
	/// <param name="userInfo"></param>
	public static bool UserLogout( HttpApplicationState application, OnlineUserInfo userInfo )
	{
		return UserLogout( application, userInfo.UserId );
	}

	/// <summary>
	/// 用户登出
	/// </summary>
	/// <param name="application"></param>
	/// <param name="userId"></param>
	/// <returns></returns>
	public static bool UserLogout( HttpContext context, int userId )
	{
		return UserLogout( context.Application, userId );
	}

	/// <summary>
	/// 用户登出
	/// </summary>
	/// <param name="userId"></param>
	public static bool UserLogout( HttpApplicationState application, int userId )
	{
		Dictionary<int, OnlineUserInfo> onlineUsers = GetOnlineUsers( application );
		
		return onlineUsers.Remove( userId );
	}

	/// <summary>
	/// 获取用户信息
	/// </summary>
	/// <param name="context"></param>
	/// <param name="userId"></param>
	/// <returns></returns>
	public static OnlineUserInfo GetUserInfo( HttpContext context, int userId )
	{
		return GetUserInfo( context.Application, userId );
	}

	/// <summary>
	/// 获取用户信息
	/// </summary>
	/// <param name="application"></param>
	/// <param name="userId"></param>
	/// <returns></returns>
	public static OnlineUserInfo GetUserInfo( HttpApplicationState application, int userId )
	{
		Dictionary<int, OnlineUserInfo> onlineUsers = GetOnlineUsers( application );
		OnlineUserInfo userInfo = null;
		onlineUsers.TryGetValue( userId, out userInfo );

		return userInfo;
	}

	/// <summary>
	/// 获取所有在线人数
	/// </summary>
	/// <param name="context"></param>
	/// <returns></returns>
	public static Dictionary<int, OnlineUserInfo> GetOnlineUsers( HttpContext context )
	{
		return GetOnlineUsers( context.Application );
	}

	/// <summary>
	/// 获取所有在线人数
	/// </summary>
	/// <returns></returns>
	public static Dictionary<int, OnlineUserInfo> GetOnlineUsers( HttpApplicationState application )
	{
		return ( Dictionary<int, OnlineUserInfo> )application[ "OnlineUsers" ];
	}
}
