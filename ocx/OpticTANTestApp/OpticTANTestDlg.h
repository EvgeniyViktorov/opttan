// OpticTANTestDlg.h : header file
//

#pragma once
#include "afxwin.h"
#include "colourpickerxp.h"
#include "optictanactivexctrl1.h"


// COpticTANTestDlg dialog
class COpticTANTestDlg : public CDialog
{
// Construction
public:
	COpticTANTestDlg(CWnd* pParent = NULL);	// standard constructor

// Dialog Data
	enum { IDD = IDD_OPTICTANTESTAPP_DIALOG };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV support

	void ChangeSize (INT p_nChange);


// Implementation
protected:
	HICON m_hIcon;

	// Generated message map functions
	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()
public:

	void ResetWndSize (BOOL p_bMini);
	void Start (BOOL p_bReset);
	BOOL GetDefaultWndSize (BOOL p_bMini,CRect& p_rcRect);
	BOOL SetDefaultWndSize (BOOL p_bMini,CRect& p_rcRect);



	afx_msg void OnBnClickedButPlus();
	afx_msg void OnBnClickedButMinus();
	afx_msg void OnBnClickedOk();
	CString m_sStartCode;
	CString m_sParam1;
	CString m_sParam2;
	CString m_sParam3;
	CComboBox m_cComboReader;
	afx_msg void OnCbnSelchangeComboReader();

	CButton					m_cOptBeep;
	CComboBox				m_cComboDelay;
	CString					m_sComboDelay;
	CColourPickerXP			m_cColButFrame;
	CColourPickerXP			m_cColButBackGround;
	COptictanactivexctrl1	m_cOpticTanActiveX;
	BOOL					m_bRememberSize;
	INT						m_nLastReaderIdx;
	CButton					m_cForceRaw;
	BOOL					m_bUseVS6;
	BOOL					m_bUseHHD14;
	afx_msg void OnBnClickedCancel();
};
