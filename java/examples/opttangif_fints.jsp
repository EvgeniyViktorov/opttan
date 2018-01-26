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
<jsp:setProperty name="opttan" property="finTSData" value='<%= request.getParameter("fints") %>' />
<%
    String fints      = request.getParameter("fints");
%>
<p>
Test: <a href='opttangif_fints.jsp?fints=24088712529006199992041,00'>opttangif.jsp?fints=24088712529006199992041,00</a><br />
FinTS Code: <% out.print(fints); %><br />
Opttan-Code: <% out.print(opttan.getCode()); %>
</p>
<p>
<img src='./servlet/OpttanGif?data=<% out.print(opttan.getCode()); %>' />
</p>
</body>
</html>
