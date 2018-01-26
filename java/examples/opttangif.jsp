<!doctype html public "-//w3c//dtd html 4.0 transitional//en">
<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
   <meta name="GENERATOR" content="Mozilla/4.61 [en] (WinNT; I) [Netscape]">
   <meta name="Author" content="Anil K. Vijendran">
   <title>Opttan Examples</title>
</head>
<body bgcolor="#FFFFFF">
<jsp:useBean id="opttan" scope="page" class="com.rsct.Opttan" />
<jsp:setProperty name="opttan" property="inputEncoding" value="zka" />
<jsp:setProperty name="opttan" property="startCode" value='<%= request.getParameter("start_code") %>' />
<jsp:setProperty name="opttan" property="bde2" value='<%= request.getParameter("bde2") %>' />
<jsp:setProperty name="opttan" property="bde1" value='<%= request.getParameter("bde1") %>' />
<%
    String bde2      = request.getParameter("bde2");
    String bde1      = request.getParameter("bde1");
    String startCode = request.getParameter("start_code");
%>
<p>
Test: <a href='opttangif.jsp?bde2=123,45&bde1=0987654&start_code=74'>opttangif.jsp?bde2=123,45&bde1=0987654&start_code=74</a><br />
StartCode: <% out.print(startCode); %><br />
Bde2: <% out.print(bde2); %><br />
Bde1: <% out.print(bde1); %><br />
Opttan-Code: <% out.print(opttan.getCode()); %>
</p>
<p>
<img src='./servlet/OpttanGif?data=<% out.print(opttan.getCode()); %>' />
</p>
</body>
</html>
