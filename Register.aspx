<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Register.aspx.cs" Inherits="Register" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>YQQ Ajax Chat Room Register</title>
	<link rel="stylesheet" type="text/css" href="css/register.css" />
</head>
<body style="text-align: center">
	<form id="frmRegister" runat="server">
		<asp:Wizard ID="wzdRegister" runat="server" ActiveStepIndex="0" CancelButtonText="Cancel" FinishCompleteButtonText="Finish" FinishPreviousButtonText="Previous" Height="372px" StartNextButtonText="Next" StepNextButtonText="Next" StepPreviousButtonText="Previous" Width="625px" OnFinishButtonClick="wzdRegister_FinishButtonClick" BackColor="#F7F6F3" BorderColor="#CCCCCC" BorderStyle="Solid" BorderWidth="1px" Font-Names="Verdana" Font-Size="0.8em" OnNextButtonClick="wzdRegister_NextButtonClick">
			<WizardSteps>
				<asp:WizardStep runat="server" Title="Check User Name">
					<table border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="width: 150px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px; vertical-align: top;">
					User Name:</td>
							<td style="width: 215px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px; vertical-align: top;">
					<asp:TextBox ID="txtUserName" runat="server" Width="180px"></asp:TextBox>
								<br />
					<asp:RequiredFieldValidator ID="rfvUserNameNull" runat="server" ControlToValidate="txtUserName"
						ErrorMessage="User name cannot be empty." SetFocusOnError="True"></asp:RequiredFieldValidator>
								<br />
					<asp:CustomValidator ID="cvlUserExist" runat="server" ControlToValidate="txtUserName"
						ErrorMessage="User name already exists." SetFocusOnError="True" OnServerValidate="cvlUserExist_ServerValidate"></asp:CustomValidator>
							</td>
						</tr>
						<tr>
							<td style="width: 150px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px; vertical-align: top;">
								Password:</td>
							<td style="width: 215px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px; vertical-align: top;">
					<asp:TextBox ID="txtPassword" runat="server" Width="180px" TextMode="Password"></asp:TextBox>
								<br />
					<asp:RequiredFieldValidator ID="rfvPasswordEmpty" runat="server" ControlToValidate="txtPassword"
						ErrorMessage="Password cannot be empty." SetFocusOnError="True"></asp:RequiredFieldValidator>
							</td>
						</tr>
						<tr>
							<td style="width: 150px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px; vertical-align: top;">
					Confirm Password:</td>
							<td style="width: 215px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px; vertical-align: top;">
					<asp:TextBox ID="txtConfirmPassword" runat="server" Width="180px" TextMode="Password"></asp:TextBox>
								<br />
					<asp:CompareValidator ID="cmvConfirmPassword" runat="server" ControlToCompare="txtPassword"
						ControlToValidate="txtConfirmPassword" ErrorMessage="Invalidated password." SetFocusOnError="True"></asp:CompareValidator>
							</td>
						</tr>
					</table>
					<asp:SqlDataSource ID="sdsCheckUser" runat="server" ConnectionString="<%$ ConnectionStrings:QQChatRoomConnectionString %>"
						DataSourceMode="DataReader" ProviderName="<%$ ConnectionStrings:QQChatRoomConnectionString.ProviderName %>"
						SelectCommand="SELECT [User_Name] FROM [User] WHERE ([User_Name] = @User_Name)">
						<SelectParameters>
							<asp:ControlParameter ControlID="txtUserName" Name="User_Name" PropertyName="Text"
								Type="String" />
						</SelectParameters>
					</asp:SqlDataSource>
				</asp:WizardStep>
				<asp:WizardStep runat="server" Title="Select Portrait">
					<span style="padding-right: 4px; padding-left: 4px; padding-bottom: 4px; margin: 4px; padding-top: 4px">Select Portrait</span><br />
					<asp:Panel ID="pnlPortraits" runat="server" Height="350px" ScrollBars="Auto" Width="454px">
					</asp:Panel>
				</asp:WizardStep>
				<asp:WizardStep runat="server" Title="Input Details">
		<table border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td style="width: 130px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px;">
					Real Name:</td>
				<td style="width: 228px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px;">
					<asp:TextBox ID="txtRealName" runat="server" Width="180px"></asp:TextBox>
					<br />
					<asp:RequiredFieldValidator ID="rfvRealNameEmpty" runat="server" ControlToValidate="txtRealName"
						ErrorMessage="Real name cannot be empty." SetFocusOnError="True"></asp:RequiredFieldValidator></td>
			</tr>
			<tr>
				<td style="width: 130px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px;">
					Gender:</td>
				<td style="width: 228px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px;">
					<asp:DropDownList ID="ddlGender" runat="server" Width="180px">
						<asp:ListItem Value="1">Male</asp:ListItem>
						<asp:ListItem Value="0">Female</asp:ListItem>
					</asp:DropDownList></td>
			</tr>
			<tr>
				<td style="width: 130px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px;">
					Nick Name:</td>
				<td style="width: 228px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px;">
					<asp:TextBox ID="txtNickName" runat="server" Width="180px"></asp:TextBox>
					<br />
					<asp:RequiredFieldValidator ID="rfvNickNameEmpty" runat="server" ControlToValidate="txtNickName"
						ErrorMessage="Nick name cannot be empty." SetFocusOnError="True"></asp:RequiredFieldValidator></td>
			</tr>
			<tr>
				<td style="width: 130px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px;">
					Birthday:</td>
				<td style="width: 228px; padding-right: 4px; padding-left: 4px; padding-bottom: 4px; padding-top: 4px;">
					<asp:Calendar ID="calBirthday" runat="server" BackColor="White" BorderColor="#999999"
						CellPadding="4" DayNameFormat="Shortest" Font-Names="Verdana" Font-Size="8pt"
						ForeColor="Black" Height="180px" Width="200px" SelectedDate="1985-01-01" VisibleDate="1985-01-01">
						<TodayDayStyle BackColor="#CCCCCC" ForeColor="Black" />
						<SelectedDayStyle BackColor="#666666" Font-Bold="True" ForeColor="White" />
						<OtherMonthDayStyle ForeColor="Gray" />
						<TitleStyle BackColor="#999999" BorderColor="Black" Font-Bold="True" />
						<NextPrevStyle VerticalAlign="Bottom" />
						<SelectorStyle BackColor="#CCCCCC" />
						<WeekendDayStyle BackColor="#FFFFCC" />
						<DayHeaderStyle BackColor="#CCCCCC" Font-Bold="True" Font-Size="7pt" />
					</asp:Calendar>
				</td>
			</tr>
		</table>
					<asp:SqlDataSource ID="sdsInsertUser" runat="server" ConnectionString="<%$ ConnectionStrings:QQChatRoomConnectionString %>"
						InsertCommand="INSERT INTO [User] (User_Name, Password, NickName, Birthday, RealName, Gender, Portrait_Id) VALUES (@User_Name, @Password, @NickName, @Birthday, @RealName, @Gender, @Portrait_Id)"
						SelectCommand="SELECT [User].* FROM [User]">
						<InsertParameters>
							<asp:Parameter Name="User_Name" />
							<asp:Parameter Name="Password" />
							<asp:ControlParameter ControlID="txtNickName" Name="NickName" PropertyName="Text" />
							<asp:ControlParameter ControlID="calBirthday" Name="Birthday" PropertyName="SelectedDate" />
							<asp:ControlParameter ControlID="txtRealName" Name="RealName" PropertyName="Text" />
							<asp:ControlParameter ControlID="ddlGender" Name="Gender" PropertyName="SelectedValue" />
							<asp:Parameter Name="Portrait_Id" />
						</InsertParameters>
					</asp:SqlDataSource>
				</asp:WizardStep>
			</WizardSteps>
			<StepStyle BorderWidth="0px" ForeColor="#5D7B9D" />
			<SideBarStyle BackColor="#7C6F57" BorderWidth="0px" Font-Size="0.9em" VerticalAlign="Top"  />
			<NavigationButtonStyle BackColor="#FFFBFF" BorderColor="#CCCCCC" BorderStyle="Solid"
				BorderWidth="1px" Font-Names="Verdana" Font-Size="0.8em" ForeColor="#284775" />
			<SideBarButtonStyle BorderWidth="0px" Font-Names="Verdana" ForeColor="White" />
			<HeaderStyle BackColor="#5D7B9D" BorderStyle="Solid" Font-Bold="True" Font-Size="0.9em"
				ForeColor="White" HorizontalAlign="Left" />
			<StepNextButtonStyle Height="21px" Width="74px" />
			<StartNextButtonStyle Height="21px" Width="74px" />
			<StepPreviousButtonStyle Height="21px" Width="74px" />
		</asp:Wizard>
		<asp:ValidationSummary ID="ValidationSummary1" runat="server" />
	</form>
</body>
</html>
