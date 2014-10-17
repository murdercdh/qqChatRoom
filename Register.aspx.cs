using System;
using System.Data;
using System.Drawing;
using System.Data.SqlClient;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Runtime.Serialization;

public partial class Register : System.Web.UI.Page
{
	protected override void OnInit( EventArgs e )
	{
		base.OnInit( e );

		// 获取所有头像文件
		string portraitPath = Server.MapPath( "~/images/portrait/" );
		string[] portraitImages = Directory.GetFiles( portraitPath, "*.gif" );

		// 生成表格
		Table table = new Table();
		pnlPortraits.Controls.Add( table );

		TableRow tr = null;
		int cellIdx = 0;

		foreach ( string portraitImage in portraitImages )
		{
			// 如果不为小图标等等
			if ( portraitImage.IndexOf( '-' ) == -1 && portraitImage.IndexOf( '_' ) == -1 )
			{
				if ( cellIdx == 0 )
				{
					tr = new TableRow();
					table.Rows.Add( tr );
				}

				TableCell tc = new TableCell();
				tr.Cells.Add( tc );

				ImageButton imgBtn = new ImageButton();
				imgBtn.ImageUrl = "images/portrait/" + Path.GetFileName( portraitImage );
				imgBtn.Click += new ImageClickEventHandler( imgBtn_Click );
				tc.Controls.Add( imgBtn );

				// 累加并自动换行
				cellIdx++;
				if ( cellIdx == 9 )
				{
					cellIdx = 0;
				}
			}
		}
	}

	/// <summary>
	/// 载入头像
	/// </summary>
	private void LoadPortrait()
	{
	}

    protected void Page_Load(object sender, EventArgs e)
    {

    }

	/// <summary>
	/// 点击完成按钮
	/// </summary>
	/// <param name="sender"></param>
	/// <param name="e"></param>
	protected void wzdRegister_FinishButtonClick( object sender, WizardNavigationEventArgs e )
	{
		sdsInsertUser.InsertParameters[ "User_Name" ].DefaultValue = txtUserName.Text;
		sdsInsertUser.InsertParameters[ "Password" ].DefaultValue = ViewState[ "Password" ].ToString();
		sdsInsertUser.InsertParameters[ "Portrait_Id" ].DefaultValue = ViewState[ "SelPortrait" ].ToString();
		int insertCount = sdsInsertUser.Insert();

		if ( insertCount != 0 )
		{
			Response.Write( "<script type=\"text/javascript\">alert(\"Register Ok!\");document.URL=\"index.htm\"</script>" );
			Response.End();
		}
	}

	/// <summary>
	/// 验证用户是否存在
	/// </summary>
	/// <param name="source"></param>
	/// <param name="args"></param>
	protected void cvlUserExist_ServerValidate( object source, ServerValidateEventArgs args )
	{
		SqlDataReader dr = ( SqlDataReader )sdsCheckUser.Select( new DataSourceSelectArguments() );
		args.IsValid = !dr.HasRows;
	}

	/// <summary>
	/// 点击下一步
	/// </summary>
	/// <param name="sender"></param>
	/// <param name="e"></param>
	protected void wzdRegister_NextButtonClick( object sender, WizardNavigationEventArgs e )
	{
		if ( e.CurrentStepIndex == 0 )
		{
			ViewState[ "UserName" ] = txtUserName.Text.Trim();
			ViewState[ "Password" ] = txtPassword.Text.Trim();
		}
	}

	void imgBtn_Click( object sender, ImageClickEventArgs e )
	{
		// 设置选中图像的属性
		ImageButton selImage = ( ImageButton )sender;
		selImage.BorderStyle = BorderStyle.Solid;
		selImage.BorderWidth = new Unit( 3 );
		selImage.BorderColor = SystemColors.ActiveCaption;
		selImage.EnableViewState = false;

		// 保存选中的Id
		PortraitInfo pi = new PortraitInfo( selImage );
		ViewState[ "SelPortrait" ] = pi.PortraitId;
	}
}
