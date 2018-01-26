/**
 * (c) 2010 REINER SCT
 *
 * Implements HDD V1.3
 *
 * $Date: Mon Mar 7 13:55:43 2016 +0100$
 * $Rev: 4.2.0$
 */

package com.rsct;

public class OpttanCodeV3 extends OpttanCodeGenerator
{

    private int version = 3;
    private String startCode = "";
    private String bde1 = "";
    private String bde2 = "";

    public OpttanCodeV3 (String finTSData, int aVersion)
    {
	_input = finTSData;
        version = aVersion;
	// Laenge Code
	int LC = Helper.decToInt(_input.substring(0,2));
	_input = _input.substring(2, _input.length());
	        
	startCode = readChunk();

	if (_input.length() == 0) return;

	bde1 = readChunk();

	if (_input.length() == 0) return;

	bde2 = readChunk();
    }

    public OpttanCodeV3 (String aStartCode,
                         String aBde1, String aBde2, int aVersion)
    {
        startCode = aStartCode;
        bde1 = aBde1;
        bde2 = aBde2;
        version = aVersion;
    }

    /**
     * Generates the code for the opttan-generators from
     * the given startCode, bde1 and bde2.
     *
     * @return         code for the opttan-generators
     */
    public String getCode () throws OpttanException
    {

        String hdd_startCode = "";
        String hdd_bde1      = "";
        String hdd_bde2      = "";
        String len           = "";

        hdd_startCode = toData(startCode, 8);
        hdd_bde1      = toData(bde1, 12);
        hdd_bde2      = toData(bde2, 12);

        String str = hdd_startCode + hdd_bde1 + hdd_bde2;
        switch(version) {
        case 1:
            len = Helper.intToHex(str.length() / 2);
            break;
        default:
            len = Helper.intToHex(str.length() / 2 + 1);
        }

        if (len.length() == 1)
            len = "0" + len;

        String xor = Helper.compXor(len + str);

        String luhn_str = hdd_startCode.substring(2,hdd_startCode.length());
        if (hdd_bde1.length() > 2)
            luhn_str += hdd_bde1.substring(2,hdd_bde1.length());
        if (hdd_bde2.length() > 2)
            luhn_str += hdd_bde2.substring(2,hdd_bde2.length());

        String luhn = Helper.compLuhn(luhn_str, version);

        return len + str + luhn + xor;
    }

    private String toData (String input, int max_length) throws OpttanException
    {
        if (input.length() > max_length) {
            throw new OpttanException ("'" + input + "' exceeds length of " + max_length + " characters");
        }
        if (input.length() == 0)
            return "";

        if (Helper.bcdOk(input)) {
            return toBcd(input);
        } else {
            return toAscii(input);
        }

    }

    private String toAscii (String input)
    {
        String encoding = "1"; // 0: BCD / 1: ASC
        String length = null;
        String data = null;
        data     = Helper.toHex(input);
        length   = Helper.intToHex(input.length());
        return encoding + length + data;
    }

    private String toBcd (String input)
    {
        String encoding = "0"; // 0: BCD / 1: ASC
        String length = null;
        String data = null;
        switch (version) {
        case 1:
        case 2:
            data = Helper.lfill(input, "F");
            break;
        default:
            data = Helper.rfill(input, "F");
        }

        length   = Helper.intToHex(data.length() / 2);
        return encoding + length + data;
    }

}
