================================================================================
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Optic TAN
//
// Zur Integration des Active X bitte wie folgt vorgehen:
//
//   1. Positionieren des Active X Controls auf dem Dialog bzw. Fenster
//   2. Membervariable erzeugen
//   3. Zur Anzeige des Optic TAN die Funktion ShowCode() für HHD 1.3 aufrufen 
//      bzw. ShowCode4() für HHD 1.3
//     
//    ULONG ShowCode(const char*	p_zStartCode,   # Startcode
//                   const char*	p_zParam1,      # Paramter 1
//		     const char*	p_zParam2,      # Paramter 2
//		     unsigned long	p_nOptions,     # Optionen, Untere 16 Bit: RSCT_OT_OPT_XX Konstanten (momentan nur RSCT_OT_OPT_MIN)
//                                                        Obere 16 Bit:  Delay zwischen den Bildern in ms 
//		     unsigned long  p_nColBg,       # Farbe des Hintergrunds als RGB Wert
//		     unsigned long  p_nColFrame,    # Farbe des Rahmens als RGB Wert
//	             const char *   p_zInfo);       # muss NULL sein
//
//    ULONG ShowCode4(const char*	p_zStartCode,   # Startcode
//                   const char*	p_zParam1,      # Paramter 1
//		     const char*	p_zParam2,      # Paramter 2
//		     const char*	p_zParam3,      # Paramter 3
//		     unsigned long	p_nOptions,     # Optionen, Untere 16 Bit: RSCT_OT_OPT_XX Konstanten (momentan nur RSCT_OT_OPT_MIN)
//                                                        Obere 16 Bit:  Delay zwischen den Bildern in ms 
//		     unsigned long  p_nColBg,       # Farbe des Hintergrunds als RGB Wert
//		     unsigned long  p_nColFrame,    # Farbe des Rahmens als RGB Wert
//	             const char *   p_zInfo);       # muss NULL sein
//
// Fragen und Anregungen bitte an kseybold@reiner-sct.de
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Rückgabewerte von ShowCode (..)

#define RSCT_OT_OK             0
#define RSCT_OT_ERR_P1	       1 // Fehler bei Parameter 1
#define RSCT_OT_ERR_P2	       2 // Fehler bei Parameter 2
#define RSCT_OT_ERR_P3         3 // Fehler bei Parameter 3 (HHD 1.4)
#define RSCT_OT_ERR_START_CODE 4 // Fehler bei StartCode
#define RSCT_OT_ERR_INT_1      5 // Interner Fehler 1
#define RSCT_OT_ERR_INT_2      6 // Interner Fehler 2

// Optionen für Feld p_nOptions

#define RSCT_OT_OPT_USE_MINI   1 // TAN mini
#define RSCT_OT_OPT_FORCE_RAW  2
