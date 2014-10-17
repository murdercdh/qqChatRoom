<%@ WebHandler Language="C#" Class="ValidateCode" %>

using System;
using System.Web;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Web.SessionState;

public class ValidateCode : IHttpHandler, IRequiresSessionState
{
	public void ProcessRequest( HttpContext context )
	{
		string code;
		byte[] bytes = GenerateImage( out code );

		context.Session[ "ValidateCode" ] = code;
		context.Response.ContentType = "image/gif";
		context.Response.BinaryWrite( bytes );
		context.Response.End();
	}

	private readonly int IMAGE_WIDTH = 80;
	private readonly int IMAGE_HEIGHT = 24;

	/// <summary>
	/// 生成验证码
	/// </summary>
	/// <param name="code">验证码</param>
	/// <returns></returns>
	private byte[] GenerateImage( out string code )
	{
		code = string.Empty;
		Bitmap bitmap = new Bitmap( IMAGE_WIDTH, IMAGE_HEIGHT );
		Graphics gs = Graphics.FromImage( bitmap );
		gs.Clear( Color.White );

		LinearGradientBrush brush = new LinearGradientBrush(
			new Rectangle( 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT ), Color.Blue, Color.Red, 45 );

		Pen pen = new Pen( brush );
		gs.DrawRectangle( pen, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT );

		Random rand = new Random( DateTime.Now.Millisecond );

		// 画干扰线
		for ( int i = 0; i < 4; i++ )
		{
			int x1 = rand.Next( 0, IMAGE_WIDTH );
			int x2 = rand.Next( 0, IMAGE_WIDTH );
			int y1 = rand.Next( 0, IMAGE_HEIGHT / 2 );
			int y2 = rand.Next( IMAGE_HEIGHT / 2, IMAGE_HEIGHT );
			int r = rand.Next( 256 );
			int g = rand.Next( 256 );
			int b = rand.Next( 256 );
			
			Pen newPen = new Pen( Color.FromArgb( r, g, b ) );
			
			gs.DrawLine( newPen, x1, y1, x2, y2 );
		}
		
		// 画验证码
		Font font = new Font( "Verdana", 13, FontStyle.Bold );
		for ( int i = 0; i < 4; i++ )
		{
			char ch = ( char )rand.Next( ( int )'A', ( int )'Z' + 1 );
			int x1 = i * 18 + rand.Next( 3 );
			int y1 = 3 + rand.Next( -3, 4 );
			
			gs.DrawString( ch.ToString(), font, brush, x1, y1 );
			code += ch;
		}

		// 画干扰点
		for ( int i = 0; i < 200; i++ )
		{
			int x = rand.Next( IMAGE_WIDTH );
			int y = rand.Next( IMAGE_HEIGHT );
			int r = rand.Next( 256 );
			int g = rand.Next( 256 );
			int b = rand.Next( 256 );
			
			bitmap.SetPixel( x, y, Color.FromArgb( r, g, b ) );
		}

		MemoryStream ms = new MemoryStream();
		bitmap.Save( ms, ImageFormat.Gif );

		return ms.ToArray();
	}

	public bool IsReusable
	{
		get
		{
			return false;
		}
	}

}