/**
 * (c) 2008 REINER SCT
 *
 * $Date: Mon Mar 7 13:55:43 2016 +0100$
 * $Rev: 4.2.0$
 */

package com.rsct;

public abstract class OpttanCodeGenerator {

    protected String _input = "";

    /**
     * Generates the code for the opttan-generators from
     * the given startCode, bde1, bde2 and bde3.
     *
     * @return         code for the opttan-generators
     */
    public abstract String getCode () throws OpttanException;

    /**
     * Read the next Data-Field and truncate _input
     *
     * @return         Data-String
     */
    protected String readChunk ()
    {
	int length = Helper.decToInt(_input.substring(0,2));
	_input = _input.substring(2, _input.length());
	String out = _input.substring(0, length);
	_input = _input.substring(length, _input.length());
	return out;
    }

}
