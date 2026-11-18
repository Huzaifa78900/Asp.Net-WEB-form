LAB NO. 11 - ASP.NET WEB APPLICATIONS
Tech Fest Registration Form

FILES
1. index.html       - HTML version
2. style.css        - CSS styling used by both versions
3. script.js        - JavaScript validation and submission handling
4. Registration.aspx - ASP.NET Web Forms page
5. Registration.aspx.cs - C# code-behind
6. Web.config       - Web Forms validator configuration

HTML VERSION
Open index.html in a browser.

ASP.NET WEB FORMS VERSION
Use Visual Studio 2019/2022:
1. Create ASP.NET Web Application (.NET Framework).
2. Choose Empty + Web Forms.
3. Name the project FormLab.
4. Add Registration.aspx as a Web Form.
5. Replace its generated markup/code with the files supplied here.
6. Add style.css and Web.config settings.
7. Run with Ctrl+F5.

SECURITY / OUTPUT NOTE
The HTML version uses textContent when displaying submitted values, so entering
<b>hello</b> as the name displays the literal text <b>hello</b>, rather than
rendering it as bold HTML.

The ASP.NET version uses Server.HtmlEncode before displaying user input.

TASK 8 CRUD
The HTML version supports creating, viewing, updating, and deleting registrations.
It stores registrations in this browser's localStorage, so records are available
again when the same browser opens the page. This is local to one browser and is
not a shared database. Passwords are validated on registration but are never
saved in the registry.
