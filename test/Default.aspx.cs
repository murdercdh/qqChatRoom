using System;
using System.Data;
using System.Drawing;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Reflection;
using System.Web.SessionState;

public partial class test_Default : System.Web.UI.Page
{
	protected void Page_Load( object sender, EventArgs e )
	{
		//this.Page.Application

		PropertyInfo[] propInfos = typeof( Color ).GetProperties();

		string txtColors = string.Empty;
		foreach ( PropertyInfo propInfo in propInfos )
		{
			string colorName = propInfo.Name;
			//txt.BackColor = Color.FromName(colorName);

			try
			{
				KnownColor kc = ( KnownColor )Enum.Parse( typeof( KnownColor ), colorName );

				txtColors += "\"" + propInfo.Name + "\", ";
				txt.BackColor = Color.FromName( colorName );
			}
			catch { }
		}

		txt.Text = txtColors;
	}
}
