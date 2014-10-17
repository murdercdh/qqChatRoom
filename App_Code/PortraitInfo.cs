using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;

/// <summary>
/// PortraitInfo 的摘要说明
/// </summary>
[Serializable]
public class PortraitInfo
{
	private ImageButton _portraitImage;
	private int _portraitId;

	public int PortraitId
	{
		get { return _portraitId; }
		set { _portraitId = value; }
	}

	public ImageButton PortraitImage
	{
		get { return _portraitImage; }
		set { _portraitImage = value; }
	}

	public PortraitInfo( ImageButton portraitImage )
	{
		_portraitImage = portraitImage;

		// 根据Url计算portraitId
		string imgFileName = Path.GetFileName( _portraitImage.ImageUrl );
		imgFileName = imgFileName.Substring( 0, imgFileName.IndexOf( '.' ) );

		_portraitId = Convert.ToInt32( imgFileName );
	}
}
