/**
 * (c) 2008 REINER SCT
 *
 * $Date: Mon Mar 7 13:55:43 2016 +0100$
 * $Rev: 4.2.0$
 */

package com.rsct;

public class Opttan
{

    private int version = 4;
    private String inputEncoding = "utf8";
    private String startCode = "";
    private String bde1 = "";
    private String bde2 = "";
    private String bde3 = "";
    private String finTSData = "";

    /**
     * Version of the opttan-code generation.
     *
     * @param value possible values: 4 (HHD 1.4), 3 (HHD 1.3)
     */
    public void setVersion (int value)
    {
        version = value;
    }

    /**
     * Sets the input encoding for StartCode, Bde1 and Bde2.
     *
     * @param value possible values: "utf8", "zka". Default is "utf8".
     */
    public void setInputEncoding (String value)
    {
        inputEncoding = value;
    }

    /**
     * Sets the value of StartCode.
     *
     * @throws OpttanException
     */
    public void setStartCode (String value) throws OpttanException
    {
        startCode = Helper.convertInput(value, inputEncoding);
    }

    /**
     * Sets the value of Bde1.
     *
     * @throws OpttanException
     */
    public void setBde1 (String value) throws OpttanException
    {
        bde1 = Helper.convertInput(value, inputEncoding);
    }

    /**
     * Sets the value of Bde2.
     *
     * @throws OpttanException
     */
    public void setBde2 (String value) throws OpttanException
    {
        bde2 = Helper.convertInput(value, inputEncoding);
    }

    /**
     * Sets the value of Bde3.
     *
     * @throws OpttanException
     */
    public void setBde3 (String value) throws OpttanException
    {
        bde3 = Helper.convertInput(value, inputEncoding);
    }

    /**
     * Sets a FinTS string.
     *
     */
    public void setFinTSData (String input)
    {
	finTSData = input;
    }

    /**
     * Generates the code for the opttan-generators
     *
     * @return         code for the opttan-generators
     */
    public String getCode () throws OpttanException
    {
	OpttanCodeGenerator g;
        switch(version) {
        case 1:
        case 2:
        case 3:
	    if (finTSData != "") {
		g = new OpttanCodeV3(finTSData, version);
	    } else {
		g = new OpttanCodeV3(startCode, bde1, bde2, version);
	    }
	    return g.getCode();
        case 4:
	    if (finTSData != "") {
		g = new OpttanCodeV4(finTSData);
	    } else {
		g = new OpttanCodeV4(startCode, bde1, bde2, bde3);
	    }
	    return g.getCode();
        }
	return "";
    }
}
