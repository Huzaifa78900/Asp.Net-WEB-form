using System;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FormLab
{
    public partial class Registration : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected void cvName_ServerValidate(object source, ServerValidateEventArgs args)
        {
            args.IsValid = !string.IsNullOrWhiteSpace(args.Value) && args.Value.Trim().Length >= 3;
        }

        protected void cvPassword_ServerValidate(object source, ServerValidateEventArgs args)
        {
            string password = args.Value ?? "";
            args.IsValid = password.Length >= 8 && password.Any(char.IsDigit);
        }

        protected void cvWorkshops_ServerValidate(object source, ServerValidateEventArgs args)
        {
            args.IsValid = cblWorkshops.Items.Cast<ListItem>().Any(item => item.Selected);
        }

        protected void cvTerms_ServerValidate(object source, ServerValidateEventArgs args)
        {
            args.IsValid = chkTerms.Checked;
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            Page.Validate();

            if (!Page.IsValid)
                return;

            outName.Text = Server.HtmlEncode(txtName.Text.Trim());
            outEmail.Text = Server.HtmlEncode(txtEmail.Text.Trim());
            outYear.Text = Server.HtmlEncode(ddlYear.SelectedValue);

            string workshops = string.Join(", ",
                cblWorkshops.Items.Cast<ListItem>()
                    .Where(item => item.Selected)
                    .Select(item => item.Text));

            outWorkshops.Text = Server.HtmlEncode(workshops);

            pnlForm.Visible = false;
            pnlConfirmation.Visible = true;
        }

        protected void btnAnother_Click(object sender, EventArgs e)
        {
            txtName.Text = "";
            txtEmail.Text = "";
            txtPhone.Text = "";
            ddlYear.SelectedIndex = 0;
            txtPassword.Text = "";
            txtConfirm.Text = "";
            txtComments.Text = "";
            chkTerms.Checked = false;

            foreach (ListItem item in cblWorkshops.Items)
                item.Selected = false;

            pnlConfirmation.Visible = false;
            pnlForm.Visible = true;
        }
    }
}
