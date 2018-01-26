/**
 * (c) 2010 REINER SCT
 *
 * Implements HDD V1.4
 *
 * $Date: Mon Mar 7 13:55:43 2016 +0100$
 * $Rev: 4.2.0$
 */

package com.rsct;

public class OpttanCodeV4 extends OpttanCodeGenerator
{

    private String startCode = "";
    private String bde1 = "";
    private String bde2 = "";
    private String bde3 = "";
    private String control = "";

    public OpttanCodeV4 (String aStartCode,
                         String aBde1, String aBde2, String aBde3)
    {
        startCode = aStartCode;
        bde1 = aBde1;
        bde2 = aBde2;
        bde3 = aBde3;
    }

    public OpttanCodeV4 (String finTSData)
    {
	_input = finTSData;
	// Laenge Code
	int LC = Helper.decToInt(_input.substring(0,3));
	_input = _input.substring(3, _input.length());

	// Laenge Startcode
	int LS = Helper.hexToInt(_input.substring(0,2));
	int LSWithoutBit7 = Helper.unmaskBit7(LS);
	_input = _input.substring(2, _input.length());

	// ControlByte lesen
	int cb = Helper.hexToInt(_input.substring(0,2));
	boolean isHhd14 = cb == 1;
	_input = _input.substring(2, _input.length());
			
	// Startcode 
	startCode = _input.substring(0, LSWithoutBit7);
	_input = _input.substring(LSWithoutBit7, _input.length());
		
	if (_input.length() == 0) return;

	bde1 = readChunk();

	if (_input.length() == 0) return;

	bde2 = readChunk();

	if (_input.length() == 0) return;

	bde3 = readChunk();
    }

    /**
     * Generates the code for the opttan-generators from
     * the given startCode, bde1, bde2 and bde3.
     *
     * @return         code for the opttan-generators
     */
    public String getCode () throws OpttanException
    {
        if (control.length() == 0) {
            control = "01"; // "8" -> Anderes ControlByte folgt
                            // "1" -> Datenstruktur HHD1.4
            // Länderkennung
            //control += "00"; // Deutschland
            //control += "01"; // Österreich
        }

        String hdd_startCode = "";
        String hdd_bde1      = "";
        String hdd_bde2      = "";
        String hdd_bde3      = "";
        int bde1_length = 12;
        int bde2_length = 12;
        int bde3_length = 12;
        if (bde1.length() > 12) {
            bde1_length = 36;
        } else if (bde2.length() > 12) {
            bde2_length = 36;
        } else if (bde3.length() > 12) {
            bde3_length = 36;
        };

        // strip last components if empty
        hdd_startCode = toData(startCode, 12, control);
        hdd_bde1      = toData(bde1, bde1_length);
        hdd_bde2      = toData(bde2, bde2_length);
        hdd_bde3      = toData(bde3, bde3_length);

        if (bde3.length() == 0) {
            hdd_bde3 = "";
        }
        if (bde3.length() == 0 && bde2.length() == 0) {
            hdd_bde2 = "";
        }
        if (bde3.length() == 0 && bde2.length() == 0 && bde1.length() == 0) {
            hdd_bde1 = "";
        }

        String str = hdd_startCode + hdd_bde1 + hdd_bde2 + hdd_bde3;
        String lc = Helper.intToHex(str.length() / 2 + 1, true);

        String luhn_str = hdd_startCode.substring(2, hdd_startCode.length());

        if (hdd_bde1.length() > 2)
            luhn_str += hdd_bde1.substring(2, hdd_bde1.length());
        if (hdd_bde2.length() > 2)
            luhn_str += hdd_bde2.substring(2, hdd_bde2.length());
        if (hdd_bde3.length() > 2)
            luhn_str += hdd_bde3.substring(2, hdd_bde3.length());

        String luhn = Helper.compLuhn(luhn_str);
        String xor = Helper.compXor(lc + str);

        return lc + str + luhn + xor;
    }

    private String toData (String input, int max_length) throws OpttanException
    {
        return toData(input, max_length, "");
    }

    public String toData (String input, int max_length, String cb) throws OpttanException
    {
        if (input.length() > max_length) {
            throw new OpttanException ("'" + input + "' exceeds length of " + max_length + " characters");
        }
        return Helper.bcdOk(input) ? toBcd(input, cb) : toAscii(input, cb);
    }

    private String toBcd (String input, String cb)
    {
        String data = Helper.rfill(input, "F");
        return compLde(data, false, cb) + compCb(cb) + data;
    }

    private String toAscii (String input, String cb)
    {
        return compLde(input, true, cb) + compCb(cb) + Helper.toHex(input);
    }

    private String compCb (String cb)
    {
        return cb;
    }

    private String compLde (String input, boolean asc, String cb)
    {
        int f = 0;
        f += asc ? 64 : 0; // ASC or BCD
        f += cb.length() != 0 ? 128 : 0; // ControlByte?
        if (asc)
            f += input.length();
        else
            f += input.length() / 2;
        return Helper.intToHex(f, true);
    }

}
