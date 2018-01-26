#pragma once

// Mit Microsoft Visual C++ generierte IDispatch-Wrapperklasse(n)

// HINWEIS: Der Inhalt dieser Datei darf nicht geändert werden. Wenn diese Klasse von Microsoft Visual C++
// neu generiert wird, werden Ihre Änderungen überschrieben.

/////////////////////////////////////////////////////////////////////////////
// COptictanactivexctrl1-Wrapperklasse

class COptictanactivexctrl1 : public CWnd
{
protected:
	DECLARE_DYNCREATE(COptictanactivexctrl1)
public:
	CLSID const& GetClsid()
	{
		static CLSID const clsid
			= { 0x95866E80, 0xAE2F, 0x490F, { 0x95, 0x4, 0x18, 0x99, 0x6, 0x9E, 0xC5, 0x2E } };
		return clsid;
	}
	virtual BOOL Create(LPCTSTR lpszClassName, LPCTSTR lpszWindowName, DWORD dwStyle,
						const RECT& rect, CWnd* pParentWnd, UINT nID, 
						CCreateContext* pContext = NULL)
	{ 
		return CreateControl(GetClsid(), lpszWindowName, dwStyle, rect, pParentWnd, nID); 
	}

    BOOL Create(LPCTSTR lpszWindowName, DWORD dwStyle, const RECT& rect, CWnd* pParentWnd, 
				UINT nID, CFile* pPersist = NULL, BOOL bStorage = FALSE,
				BSTR bstrLicKey = NULL)
	{ 
		return CreateControl(GetClsid(), lpszWindowName, dwStyle, rect, pParentWnd, nID,
		pPersist, bStorage, bstrLicKey); 
	}

// Attribute
public:


// Operationen
public:

// _DOpticTANActiveX

// Functions
//

	void AboutBox()
	{
		InvokeHelper(DISPID_ABOUTBOX, DISPATCH_METHOD, VT_EMPTY, NULL, NULL);
	}
	unsigned long ShowCode(const char * p_zStartCode, const char * p_zParam1, const char * p_zParam2, unsigned long p_nOptions, unsigned long p_nColBg, unsigned long p_nColFrame, const char * p_zInfo)
	{
		unsigned long result;  
		static BYTE parms[] = VTS_PUI1 VTS_PUI1 VTS_PUI1 VTS_UI4 VTS_UI4 VTS_UI4 VTS_PUI1 ;

		InvokeHelper(0x1, DISPATCH_METHOD, VT_UI4, (void*)&result, parms, p_zStartCode, p_zParam1, p_zParam2, p_nOptions, p_nColBg, p_nColFrame, p_zInfo);
		return result;
	}

	long ShowCodeVS6(const char * p_zStartCode, const char * p_zParam1, const char * p_zParam2, unsigned long p_nOptions, unsigned long p_nColBg, unsigned long p_nColFrame, const char * p_zInfo)
	{
		unsigned long result;  
		static BYTE parms[] = VTS_PUI1 VTS_PUI1 VTS_PUI1 VTS_UI4 VTS_UI4 VTS_UI4 VTS_PUI1 ;

		InvokeHelper(0x2, DISPATCH_METHOD, VT_UI4, (void*)&result, parms, p_zStartCode, p_zParam1, p_zParam2, p_nOptions, p_nColBg, p_nColFrame, p_zInfo);
		return result;
	}

	unsigned long ShowCode4(const char * p_zStartCode, const char * p_zParam1, const char * p_zParam2, const char * p_zParam3, unsigned long p_nOptions, unsigned long p_nColBg, unsigned long p_nColFrame, const char * p_zInfo)
	{
		unsigned long result;  
		static BYTE parms[] = VTS_PUI1 VTS_PUI1 VTS_PUI1 VTS_PUI1 VTS_UI4 VTS_UI4 VTS_UI4 VTS_PUI1 ;

		InvokeHelper(0x3, DISPATCH_METHOD, VT_UI4, (void*)&result, parms, p_zStartCode, p_zParam1, p_zParam2, p_zParam3, p_nOptions, p_nColBg, p_nColFrame, p_zInfo);
		return result;
	}

	long ShowCode4VS6(const char * p_zStartCode, const char * p_zParam1, const char * p_zParam2, const char * p_zParam3, unsigned long p_nOptions, unsigned long p_nColBg, unsigned long p_nColFrame, const char * p_zInfo)
	{
		unsigned long result;  
		static BYTE parms[] = VTS_PUI1 VTS_PUI1 VTS_PUI1 VTS_PUI1 VTS_UI4 VTS_UI4 VTS_UI4 VTS_PUI1 ;

		InvokeHelper(0x4, DISPATCH_METHOD, VT_UI4, (void*)&result, parms, p_zStartCode, p_zParam1, p_zParam2, p_zParam3, p_nOptions, p_nColBg, p_nColFrame, p_zInfo);
		return result;
	}


// Properties
//



};
