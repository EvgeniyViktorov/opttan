// OpticTANTestApp.cpp : Defines the class behaviors for the application.
//

#include "stdafx.h"
#include "OpticTANTestApp.h"
#include "OpticTANTestDlg.h"
#include <direct.h>
#include <stdlib.h>
#include <stdio.h>

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// COpticTANTestApp

BEGIN_MESSAGE_MAP(COpticTANTestApp, CWinApp)
	ON_COMMAND(ID_HELP, &CWinApp::OnHelp)
END_MESSAGE_MAP()


// COpticTANTestApp construction

COpticTANTestApp::COpticTANTestApp()
{
	// TODO: add construction code here,
	// Place all significant initialization in InitInstance
}


// The one and only COpticTANTestApp object

COpticTANTestApp theApp;


// COpticTANTestApp initialization

BOOL IsOpticTanControlInstalled ()
{

	CLSID clsid;

	return ::CLSIDFromProgID(L"OPTICTANACTIVEX.OpticTANActiveXCtrl.1", &clsid) == S_OK;
};


BOOL COpticTANTestApp::InitInstance()
{
	// InitCommonControlsEx() is required on Windows XP if an application
	// manifest specifies use of ComCtl32.dll version 6 or later to enable
	// visual styles.  Otherwise, any window creation will fail.
	INITCOMMONCONTROLSEX InitCtrls;
	InitCtrls.dwSize = sizeof(InitCtrls);
	// Set this to include all the common control classes you want to use
	// in your application.
	InitCtrls.dwICC = ICC_WIN95_CLASSES;
	InitCommonControlsEx(&InitCtrls);

	CWinApp::InitInstance();

	//AfxMessageBox ("Das Active X Control muss zuerst via <regsvr32 rsct_ot.ocx> registriert werden!",MB_ICONINFORMATION);

	AfxEnableControlContainer();

	if (!IsOpticTanControlInstalled())
	{
		if (AfxMessageBox ("Das ActiveX Control muss erst registriert werden:\n\nregsvr32 rsct_ot.ocx\n\nJetzt registrieren?",MB_ICONSTOP|MB_YESNO)==IDYES)
		{
			CString sCmd;
			char	zWorkingDir[MAX_PATH+1]="";
			_getcwd (zWorkingDir,MAX_PATH);

			sCmd.Format("regsvr32 \"%s\\rsct_ot.ocx\"",zWorkingDir);
			WinExec (sCmd,SW_NORMAL);
		};

	};


	// Standard initialization
	// If you are not using these features and wish to reduce the size
	// of your final executable, you should remove from the following
	// the specific initialization routines you do not need
	// Change the registry key under which our settings are stored
	// TODO: You should modify this string to be something appropriate
	// such as the name of your company or organization
	SetRegistryKey(_T("Local AppWizard-Generated Applications"));

	COpticTANTestDlg dlg;
	m_pMainWnd = &dlg;
	INT_PTR nResponse = dlg.DoModal();
	if (nResponse == IDOK)
	{
		// TODO: Place code here to handle when the dialog is
		//  dismissed with OK
	}
	else if (nResponse == IDCANCEL)
	{
		// TODO: Place code here to handle when the dialog is
		//  dismissed with Cancel
	}

	// Since the dialog has been closed, return FALSE so that we exit the
	//  application, rather than start the application's message pump.
	return FALSE;
}
