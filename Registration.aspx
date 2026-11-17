<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Registration.aspx.cs" Inherits="FormLab.Registration" %>

<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Tech Fest Registration - ASP.NET Web Forms</title>
    <link href="style.css" rel="stylesheet" />
</head>
<body>
<form id="form1" runat="server">
    <main class="page">
        <section class="card">
            <asp:Panel ID="pnlForm" runat="server">
                <h1>Tech Fest Registration</h1>
                <p class="intro">Register for workshops and be part of the Tech Fest.</p>

                <div class="form-group">
                    <asp:Label ID="lblName" runat="server" AssociatedControlID="txtName">Full Name</asp:Label>
                    <asp:TextBox ID="txtName" runat="server" CssClass="input" placeholder="Enter your full name"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="rfvName" runat="server" ControlToValidate="txtName"
                        ErrorMessage="Name is required." CssClass="error-message" Display="Dynamic" />
                    <asp:CustomValidator ID="cvName" runat="server" ControlToValidate="txtName"
                        ErrorMessage="Name must be at least 3 characters." CssClass="error-message"
                        OnServerValidate="cvName_ServerValidate" Display="Dynamic" />
                </div>

                <div class="form-group">
                    <asp:Label ID="lblEmail" runat="server" AssociatedControlID="txtEmail">Email</asp:Label>
                    <asp:TextBox ID="txtEmail" runat="server" TextMode="Email" CssClass="input" placeholder="name@example.com"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="rfvEmail" runat="server" ControlToValidate="txtEmail"
                        ErrorMessage="Email is required." CssClass="error-message" Display="Dynamic" />
                    <asp:RegularExpressionValidator ID="revEmail" runat="server" ControlToValidate="txtEmail"
                        ValidationExpression="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                        ErrorMessage="Please enter a valid email." CssClass="error-message" Display="Dynamic" />
                </div>

                <div class="form-group">
                    <asp:Label ID="lblPhone" runat="server" AssociatedControlID="txtPhone">Phone</asp:Label>
                    <asp:TextBox ID="txtPhone" runat="server" TextMode="Phone" CssClass="input" placeholder="03XX-XXXXXXX"></asp:TextBox>
                </div>

                <div class="form-group">
                    <asp:Label ID="lblYear" runat="server" AssociatedControlID="ddlYear">Year of Study</asp:Label>
                    <asp:DropDownList ID="ddlYear" runat="server" CssClass="input">
                        <asp:ListItem Value="">Select year</asp:ListItem>
                        <asp:ListItem>Year 1</asp:ListItem>
                        <asp:ListItem>Year 2</asp:ListItem>
                        <asp:ListItem>Year 3</asp:ListItem>
                        <asp:ListItem>Year 4</asp:ListItem>
                    </asp:DropDownList>
                    <asp:RequiredFieldValidator ID="rfvYear" runat="server" ControlToValidate="ddlYear"
                        InitialValue="" ErrorMessage="Please select your year." CssClass="error-message" Display="Dynamic" />
                </div>

                <div class="form-group">
                    <asp:Label ID="lblPassword" runat="server" AssociatedControlID="txtPassword">Password</asp:Label>
                    <asp:TextBox ID="txtPassword" runat="server" TextMode="Password" CssClass="input" placeholder="Minimum 8 characters"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="rfvPassword" runat="server" ControlToValidate="txtPassword"
                        ErrorMessage="Password is required." CssClass="error-message" Display="Dynamic" />
                    <asp:CustomValidator ID="cvPassword" runat="server" ControlToValidate="txtPassword"
                        ErrorMessage="Password must be at least 8 characters and contain a number."
                        CssClass="error-message" OnServerValidate="cvPassword_ServerValidate" Display="Dynamic" />
                </div>

                <div class="form-group">
                    <asp:Label ID="lblConfirm" runat="server" AssociatedControlID="txtConfirm">Confirm Password</asp:Label>
                    <asp:TextBox ID="txtConfirm" runat="server" TextMode="Password" CssClass="input" placeholder="Re-enter password"></asp:TextBox>
                    <asp:CompareValidator ID="cvConfirm" runat="server" ControlToValidate="txtConfirm"
                        ControlToCompare="txtPassword" ErrorMessage="Passwords do not match."
                        CssClass="error-message" Display="Dynamic" />
                </div>

                <fieldset>
                    <legend>Workshops <span>(select at least one)</span></legend>
                    <asp:CheckBoxList ID="cblWorkshops" runat="server">
                        <asp:ListItem>Web Development</asp:ListItem>
                        <asp:ListItem>AI</asp:ListItem>
                        <asp:ListItem>Cyber Security</asp:ListItem>
                    </asp:CheckBoxList>
                    <asp:CustomValidator ID="cvWorkshops" runat="server"
                        ErrorMessage="Please select at least one workshop."
                        CssClass="error-message" OnServerValidate="cvWorkshops_ServerValidate" Display="Dynamic" />
                </fieldset>

                <div class="form-group">
                    <asp:Label ID="lblComments" runat="server" AssociatedControlID="txtComments">Comments</asp:Label>
                    <asp:TextBox ID="txtComments" runat="server" TextMode="MultiLine" CssClass="input"
                        placeholder="Anything you would like us to know?"></asp:TextBox>
                </div>

                <div class="terms">
                    <asp:CheckBox ID="chkTerms" runat="server" Text="I agree to the terms and conditions." />
                    <asp:CustomValidator ID="cvTerms" runat="server"
                        ErrorMessage="You must agree to the terms."
                        CssClass="error-message" OnServerValidate="cvTerms_ServerValidate" Display="Dynamic" />
                </div>

                <asp:Button ID="btnSubmit" runat="server" Text="Register" CssClass="button"
                    OnClick="btnSubmit_Click" />
                <asp:Label ID="lblStatus" runat="server" CssClass="status"></asp:Label>
            </asp:Panel>

            <asp:Panel ID="pnlConfirmation" runat="server" Visible="false">
                <h1>Thank You!</h1>
                <p>Your Tech Fest registration has been received.</p>
                <div class="summary">
                    <p><strong>Name:</strong> <asp:Label ID="outName" runat="server" /></p>
                    <p><strong>Email:</strong> <asp:Label ID="outEmail" runat="server" /></p>
                    <p><strong>Year:</strong> <asp:Label ID="outYear" runat="server" /></p>
                    <p><strong>Workshops:</strong> <asp:Label ID="outWorkshops" runat="server" /></p>
                </div>
                <asp:Button ID="btnAnother" runat="server" Text="Register another person"
                    CssClass="button" OnClick="btnAnother_Click" CausesValidation="false" />
            </asp:Panel>
        </section>
    </main>
</form>
</body>
</html>
