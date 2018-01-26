// OpticTANTestDlg.cpp : implementation file
//

#include "stdafx.h"
#include "OpticTANTestApp.h"
#include "OpticTANTestDlg.h"
#include "atlbase.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

#define RSCT_OT_DEF_REG_HIVE		"SOFTWARE\\REINER SCT\\OpticTANTestApp"
#define RSCT_OT_DEF_REG_VAL_OT_X	"OpticTan_X"
#define RSCT_OT_DEF_REG_VAL_OT_MINI_X	"OpticTanMini_X"
#define RSCT_OT_DEF_REG_VAL_OT_Y	"OpticTan_Y"
#define RSCT_OT_DEF_REG_VAL_OT_MINI_Y	"OpticTanMini_Y"

// Rückgabewerte von ShowCode (..)

#define RSCT_OT_OK             0
#define RSCT_OT_ERR_P1         1 // Fehler bei Parameter 1
#define RSCT_OT_ERR_P2         2 // Fehler bei Parameter 2
#define RSCT_OT_ERR_P3         3 // Fehler bei Parameter 3 (HHD 1.4)
#define RSCT_OT_ERR_START_CODE 4 // Fehler bei StartCode
#define RSCT_OT_ERR_INT_1      5 // Interner Fehler 1
#define RSCT_OT_ERR_INT_2      6 // Interner Fehler 2

// Optionen für Feld p_nOptions

#define RSCT_OT_OPT_USE_MINI   1 // TAN mini
#define RSCT_OT_OPT_FORCE_RAW  2

// CAboutDlg dialog used for App About

class CAboutDlg : public CDialog
{
public:
	CAboutDlg();

// Dialog Data
	enum { IDD = IDD_ABOUTBOX };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV support

// Implementation
protected:
	DECLARE_MESSAGE_MAP()
};

CAboutDlg::CAboutDlg() : CDialog(CAboutDlg::IDD)
{
}

void CAboutDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
}

BEGIN_MESSAGE_MAP(CAboutDlg, CDialog)
END_MESSAGE_MAP()

// COpticTANTestDlg dialog

COpticTANTestDlg::COpticTANTestDlg(CWnd* pParent /*=NULL*/)
	: CDialog(COpticTANTestDlg::IDD, pParent)
	, m_sStartCode(_T(""))
	, m_sParam1(_T(""))
	, m_sParam2(_T(""))
	, m_sParam3(_T(""))
	, m_sComboDelay(_T(""))
	, m_bRememberSize(FALSE)
	, m_bUseVS6(FALSE)
	, m_bUseHHD14(FALSE)
{
	m_nLastReaderIdx=-1;
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void COpticTANTestDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT_SC, m_sStartCode);
	DDX_Text(pDX, IDC_EDIT_P1, m_sParam1);
	DDX_Text(pDX, IDC_P2, m_sParam2);
	DDX_Text(pDX, IDC_P3, m_sParam3);
	DDX_Control(pDX, IDC_COMBO_READER, m_cComboReader);
	DDX_Control(pDX, IDC_COMBO_DELAY, m_cComboDelay);
	DDX_CBString(pDX, IDC_COMBO_DELAY, m_sComboDelay);
	DDX_Control(pDX, IDC_BUT_COL_BORDER, m_cColButFrame);
	DDX_Control(pDX, IDC_BUT_COL_BACK, m_cColButBackGround);
	DDX_Control(pDX, IDC_OPTICTANACTIVEXCTRL1, m_cOpticTanActiveX);
	DDX_Check(pDX, IDC_CHECK_REMEMBER_SIZE, m_bRememberSize);
	DDX_Control(pDX, IDC_CHECK_FORCE_RAW, m_cForceRaw);
	DDX_Check(pDX, IDC_CHECK_VS6, m_bUseVS6);
	DDX_Check(pDX, IDC_CHECK_HHD14, m_bUseHHD14);
}

BEGIN_MESSAGE_MAP(COpticTANTestDlg, CDialog)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	//}}AFX_MSG_MAP
	ON_BN_CLICKED(IDC_BUT_PLUS, &COpticTANTestDlg::OnBnClickedButPlus)
	ON_BN_CLICKED(IDC_BUT_MINUS, &COpticTANTestDlg::OnBnClickedButMinus)
	ON_BN_CLICKED(IDOK, &COpticTANTestDlg::OnBnClickedOk)
	ON_BN_CLICKED(IDCANCEL, &COpticTANTestDlg::OnBnClickedCancel)
END_MESSAGE_MAP()

// COpticTANTestDlg message handlers

BOOL COpticTANTestDlg::OnInitDialog()
{
	CDialog::OnInitDialog();

	// Add "About..." menu item to system menu.
	// IDM_ABOUTBOX must be in the system command range.
	ASSERT((IDM_ABOUTBOX & 0xFFF0) == IDM_ABOUTBOX);
	ASSERT(IDM_ABOUTBOX < 0xF000);

	CMenu* pSysMenu = GetSystemMenu(FALSE);
	if (pSysMenu != NULL)
	{
		CString strAboutMenu;
		strAboutMenu.LoadString(IDS_ABOUTBOX);
		if (!strAboutMenu.IsEmpty())
		{
			pSysMenu->AppendMenu(MF_SEPARATOR);
			pSysMenu->AppendMenu(MF_STRING, IDM_ABOUTBOX, strAboutMenu);
		}
	}

	// Set the icon for this dialog.  The framework does this automatically
	//  when the application's main window is not a dialog
	SetIcon(m_hIcon, TRUE);			// Set big icon
	SetIcon(m_hIcon, FALSE);		// Set small icon

	m_sStartCode="8711";
	m_sParam1="12345678";
	m_sParam2="4,50";
	m_sParam3="";

	m_cComboReader.AddString ("Optic TAN");
	m_cComboReader.AddString ("Optic TAN mini");
	m_cComboReader.SetCurSel (0);

	m_cComboDelay.AddString ("Standard");
	m_cComboDelay.AddString ("10");
	m_cComboDelay.AddString ("25");
	m_cComboDelay.AddString ("50");
	m_cComboDelay.AddString ("100");
	m_cComboDelay.AddString ("250");
	m_cComboDelay.AddString ("500");
	m_cComboDelay.AddString ("750");
	m_cComboDelay.AddString ("1000");
	m_cComboDelay.AddString ("1500");
	m_cComboDelay.AddString ("2000");
	m_cComboDelay.AddString ("5000");

	m_cComboDelay.SetCurSel (0);

	m_cColButFrame.SetColor (RGB(0xFF,0xCC,0x00));
	m_cColButBackGround.SetColor (::GetSysColor (COLOR_3DFACE));
	m_cForceRaw.SetCheck(false);

	UpdateData(false);
	// TODO: Add extra initialization here

	return TRUE;  // return TRUE  unless you set the focus to a control
}

void COpticTANTestDlg::OnSysCommand(UINT nID, LPARAM lParam)
{
	if ((nID & 0xFFF0) == IDM_ABOUTBOX)
	{
		CAboutDlg dlgAbout;
		dlgAbout.DoModal();
	}
	else
	{
		CDialog::OnSysCommand(nID, lParam);
	}
}

// If you add a minimize button to your dialog, you will need the code below
//  to draw the icon.  For MFC applications using the document/view model,
//  this is automatically done for you by the framework.

void COpticTANTestDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // device context for painting

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// Center icon in client rectangle
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// Draw the icon
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialog::OnPaint();
	}
}

// The system calls this function to obtain the cursor to display while the user drags
//  the minimized window.
HCURSOR COpticTANTestDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}


void COpticTANTestDlg::OnBnClickedButPlus()
{
	ChangeSize (+4);
}

void COpticTANTestDlg::OnBnClickedButMinus()
{
	ChangeSize (-4);
}

void COpticTANTestDlg::ChangeSize (INT p_nChange)
{
	CRect	cWndRect;
	CRect	cWndRect1;
	double	fScaleNormal= 2.0;
	double	fScaleMini	=0.50;
	m_cOpticTanActiveX.GetWindowRect(&cWndRect);
	cWndRect.right+=p_nChange;
	cWndRect.bottom=cWndRect.top+(ULONG)((cWndRect.right-cWndRect.left)*(m_cComboReader.GetCurSel ()?fScaleMini:fScaleNormal));

   
	ScreenToClient(&cWndRect); 

	m_cOpticTanActiveX.SetWindowPos(NULL,cWndRect.left,cWndRect.top, 
					cWndRect.Width(),cWndRect.Height(),
					SWP_NOZORDER | SWP_NOACTIVATE);

	if (m_bRememberSize)
		SetDefaultWndSize (m_nLastReaderIdx==1,cWndRect);

	if (p_nChange != 0)
		Start (false);
}

BOOL COpticTANTestDlg::GetDefaultWndSize (BOOL p_bMini,CRect& p_rcRect)
{
	CRect	cRectOpt		(11,11,165,0);
	CRect	cRectOptMini    (11,11,186,0);
	CRegKey cRegKey;
	DWORD	nSizeX=0;
	DWORD	nSizeY=0;
	BOOL	bRet=false;
	CString sValNameX;
	CString sValNameY;

	if (p_bMini)
	{
		sValNameX=RSCT_OT_DEF_REG_VAL_OT_MINI_X;
		sValNameY=RSCT_OT_DEF_REG_VAL_OT_MINI_Y;
		p_rcRect=cRectOptMini;
	}
	else
	{
		sValNameX=RSCT_OT_DEF_REG_VAL_OT_X;
		sValNameY=RSCT_OT_DEF_REG_VAL_OT_Y;
		p_rcRect=cRectOpt;
	};

	if (cRegKey.Open( HKEY_CURRENT_USER, RSCT_OT_DEF_REG_HIVE, KEY_READ)==ERROR_SUCCESS)
	{
		cRegKey.QueryDWORDValue( sValNameX,nSizeX); 
		cRegKey.QueryDWORDValue( sValNameY,nSizeY); 
		cRegKey.Close();
	};

	if (nSizeX!=0 && nSizeY!=0)
	{
		p_rcRect.right=nSizeX;
		p_rcRect.bottom=nSizeY;
		bRet=true;
	};


	return bRet;
};

BOOL COpticTANTestDlg::SetDefaultWndSize (BOOL p_bMini,CRect& p_rcRect)
{
	CRegKey cRegKey;
	CString sValNameX;
	CString sValNameY;

	if (p_bMini)
	{
		sValNameX=RSCT_OT_DEF_REG_VAL_OT_MINI_X;
		sValNameY=RSCT_OT_DEF_REG_VAL_OT_MINI_Y;
	}
	else
	{
		sValNameX=RSCT_OT_DEF_REG_VAL_OT_X;
		sValNameY=RSCT_OT_DEF_REG_VAL_OT_Y;
	};

	cRegKey.Create (HKEY_CURRENT_USER, RSCT_OT_DEF_REG_HIVE);
	if (cRegKey.Open( HKEY_CURRENT_USER, RSCT_OT_DEF_REG_HIVE, KEY_WRITE)==ERROR_SUCCESS)
	{
		cRegKey.SetDWORDValue( sValNameX,p_rcRect.right); 
		cRegKey.SetDWORDValue( sValNameY,p_rcRect.bottom); 
		cRegKey.Close();
	};

	return true;
};

void COpticTANTestDlg::ResetWndSize (BOOL p_bMini)
{
	CRect cWndRect;

	GetDefaultWndSize(p_bMini,cWndRect);

	m_cOpticTanActiveX.SetWindowPos(NULL,cWndRect.left,cWndRect.top, 
                            cWndRect.Width(),cWndRect.Height(),
							SWP_NOZORDER | SWP_NOACTIVATE);

	ChangeSize(0);
};

void COpticTANTestDlg::OnBnClickedOk()
{
	BOOL bReset=false;

	UpdateData(true);

	ULONG nReaderIdx=m_cComboReader.GetCurSel ();

	if (nReaderIdx!=m_nLastReaderIdx)
		bReset=true;

	m_nLastReaderIdx=nReaderIdx;

	Start (bReset);



};

void COpticTANTestDlg::Start (BOOL p_bReset)
{
	
	ULONG	nOptions=0;
	DWORD	nDelay=atoi (m_sComboDelay); // Standard ist 0
	BOOL	bOptMini=(BOOL)m_cComboReader.GetCurSel ();
	ULONG	nRet=0;

	UpdateData(true);
	
	// Optic TAN mini?
	nOptions|= bOptMini ? RSCT_OT_OPT_USE_MINI: 0;
	nOptions|= m_cForceRaw.GetCheck() ? RSCT_OT_OPT_FORCE_RAW: 0;
 
	// DElay in die oberen 16 Bit
	nOptions+= (nDelay << 16);
 
	// Anzeigefläche justieren
	if (p_bReset)
		ResetWndSize (bOptMini);

	// TAN anzeigen
	if (m_bUseVS6) {
		if (m_bUseHHD14) {
			nRet=m_cOpticTanActiveX.ShowCode4VS6(m_sStartCode,m_sParam1,m_sParam2,m_sParam3,nOptions,m_cColButBackGround.GetColor(),m_cColButFrame.GetColor(),"SC");
		} else {
			nRet=m_cOpticTanActiveX.ShowCodeVS6(m_sStartCode,m_sParam1,m_sParam2,nOptions,m_cColButBackGround.GetColor(),m_cColButFrame.GetColor(),"SC");
		}
	} else {
		if (m_bUseHHD14) {
			nRet=m_cOpticTanActiveX.ShowCode4(m_sStartCode,m_sParam1,m_sParam2,m_sParam3,nOptions,m_cColButBackGround.GetColor(),m_cColButFrame.GetColor(),"SC");
		} else {
			nRet=m_cOpticTanActiveX.ShowCode(m_sStartCode,m_sParam1,m_sParam2,nOptions,m_cColButBackGround.GetColor(),m_cColButFrame.GetColor(),"SC");
		}
	};

	if(nRet)
	{
		CString sErr;

		switch (nRet)
		{
		case RSCT_OT_ERR_START_CODE:
			sErr="Der Startcode ist fehlerhaft (max. 8 Zeichen), leer oder enthält ASCII Zeichen";
			break;
		case RSCT_OT_ERR_P1:
			sErr="Der Parameter 1 ist fehlerhaft, enthält mehr als ein Komma oder enthält nach dem Komma mehr als drei Ziffern";
			break;
		case RSCT_OT_ERR_P2:
			sErr="Der Parameter 2 ist fehlerhaft, enthält mehr als ein Komma oder enthält nach dem Komma mehr als drei Ziffern";
			break;
		case RSCT_OT_ERR_P3:
			sErr="Der Parameter 3 ist fehlerhaft, enthält mehr als ein Komma oder enthält nach dem Komma mehr als drei Ziffern";
			break;
		case RSCT_OT_ERR_INT_1:
			sErr="Interner Fehler (1) - Bitte benachrichtigen Sie REINER SCT";
			break;
		case RSCT_OT_ERR_INT_2:
			sErr="Interner Fehler (2) - Bitte benachrichtigen Sie REINER SCT";
			break;
		default:
			sErr.Format("Unbekannter Fehlercode :%d",nRet);
			break;
		};

		AfxMessageBox (sErr,MB_ICONSTOP);
	};
}

void COpticTANTestDlg::OnBnClickedCancel()
{
	// TODO: Add your control notification handler code here
	OnCancel();
}
