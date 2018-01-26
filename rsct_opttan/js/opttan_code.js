/*
 * (c) 2011 REINER SCT
 *
 * $Date: Mon Mar 7 13:55:43 2016 +0100$
 * $Rev: 4.2.0$
 */

var rsct = {
    Opttan : {
	_version : 4,            /* HHD 1.4 default */
	_inputEncoding : "utf8", /* UTF8 default */
	_startCode : "",
	_bde1 : "",
	_bde2 : "",
	_bde3 : "",
	_finTSData : "",
	/**
	 * Sets the input encoding for StartCode, Bde1 and Bde2.
	 *
	 * @param value possible values: "utf8", "zka". Default is "utf8".
	 */
	setInputEncoding : function(value) {
	    this._inputEncoding = value;
	},
	/**
	 * Version of the opttan-code generation.
	 *
	 * @param value possible values: 4 (HHD 1.4), 3 (HHD 1.3)
	 */
	setVersion : function(value) {
	    this._version = value;
	},
	/**
	 * Setters for fields
	 */
	setStartCode : function(value) {
	    this._startCode = value;
	},
	setBde1 : function(value) {
	    this._bde1 = value;
	},
	setBde2 : function(value) {
	    this._bde2 = value;
	},
	setBde3 : function(value) {
	    this._bde3 = value;
	},
	/**
	 * Sets a FinTS string
	 */
	setFinTSData : function(value) {
	    this._finTSData = value;
	},
	/**
	 * Generates the code for the opttan-generators
	 *
	 * @return code for the opttan-generators
	 * @throws exceptions on formating errors
	 */
	getCode : function() {
	    switch(this._version) {
	    case 1:
	    case 2:
	    case 3:
		if (this._finTSData != "")
		    return this.OpttanCodeV3.getFinTSCode(this._finTSData, this._version);
		else 
		    return this.OpttanCodeV3.getCode(this._startCode, this._bde1, this._bde2, this._version);
	    case 4:
		if (this._finTSData != "")
		    return this.OpttanCodeV4.getFinTSCode(this._finTSData);
		else 
		    return this.OpttanCodeV4.getCode(this._startCode, this._bde1, this._bde2, this._bde3);
	    }
	    return "";
	},
	/* HHD 1.3 Code Generation */
	OpttanCodeV3 : {
	    toData : function(input, max_length) {
		var Helper = rsct.Opttan.Helper;
		if (input.length > max_length) {
		    throw ("'" + input + "' exceeds length of " + max_length + " characters");
		}
		if (input.length == 0)
		    return "";

		if (Helper.bcdOk(input)) {
		    return this.toBcd(input);
		} else {
		    return this.toAscii(input);
		}
	    },
	    toAscii : function(input) {
		var Helper = rsct.Opttan.Helper;
		var encoding = "1"; // 0: BCD / 1: ASC
		var length = null;
		var data = null;
		data     = Helper.toHex(input);
		length   = Helper.intToHex(input.length);
		return encoding + length + data;
	    },
	    toBcd : function(input) {
		var Helper = rsct.Opttan.Helper;
		var encoding = "0"; // 0: BCD / 1: ASC
		var length = null;
		var data = null;
		switch (rsct.Opttan._version) {
		case 1:
		case 2:
		    data = Helper.lfill(input, "F");
		    break;
		default:
		    data = Helper.rfill(input, "F");
		}
		length   = Helper.intToHex(data.length / 2);
		return encoding + length + data;
	    },
	    getFinTSCode : function(input, version) {
		var Helper = rsct.Opttan.Helper;
		var startCode = "";
		var bde1 = "";
		var bde2 = "";

		this._input = input;
		// Laenge Code
		var LC = Helper.decToInt(this._input.substring(0,2));
		this._input = this._input.substring(2, this._input.length);
	        
		startCode = this.readChunk();
		
		if (this._input.length > 0)
		    bde1 = this.readChunk();

		if (this._input.length > 0)
		    bde2 = this.readChunk();

		return this.getCode(startCode, bde1, bde2, version);
	    },
	    readChunk : function() {
		var Helper = rsct.Opttan.Helper;
		var length = Helper.decToInt(this._input.substring(0,2));
		this._input = this._input.substring(2, this._input.length);
		var out = this._input.substring(0, length);
		this._input = this._input.substring(length, this._input.length);
		return out;
	    },
	    getCode : function(startCode, bde1, bde2, version) {
		rsct.Opttan.setVersion(version);
		var Helper = rsct.Opttan.Helper;
		var hdd_startCode = "";
		var hdd_bde1      = "";
		var hdd_bde2      = "";
		var len           = "";

		hdd_startCode = this.toData(startCode, 8);
		hdd_bde1      = this.toData(bde1, 12);
		hdd_bde2      = this.toData(bde2, 12);

		var str = hdd_startCode + hdd_bde1 + hdd_bde2;
		switch(version) {
		case 1:
		    len = Helper.intToHex(str.length / 2);
		    break;
		default:
		    len = Helper.intToHex(str.length / 2 + 1);
		}
		
		if (len.length == 1)
		    len = "0" + len;

		var xor = Helper.compXor(len + str);
		
		var luhn_str = hdd_startCode.substring(2,hdd_startCode.length);
		if (hdd_bde1.length > 2)
		    luhn_str += hdd_bde1.substring(2,hdd_bde1.length);
		if (hdd_bde2.length > 2)
		    luhn_str += hdd_bde2.substring(2,hdd_bde2.length);
		
		var luhn = Helper.compLuhn(luhn_str);
		
		return len + str + luhn + xor;
	    }
	},
	/* HHD 1.4 Code Generation */
	OpttanCodeV4 : {
	    encoding : "utf8",
	    toData : function($input, $max_length, $cb) {
		var Helper = rsct.Opttan.Helper;
		Helper.checkString($input, this.encoding);
		if (!$input)
		    $input = '';
		if ($input.length > $max_length) {
		    throw("'"+$input+"' exceeds length of "+$max_length+" characters");
		}
		return this.bcdOk($input) ? this.toBcd($input, $cb) : this.toAscii($input, $cb);
	    },
	    bcdOk : function($input) {
		var Helper = rsct.Opttan.Helper;
		for (var $i = 0; $i < $input.length; $i++) {
		    if (Helper.ord(Helper.substr($input,$i,1)) < 48 || Helper.ord(Helper.substr($input,$i,1)) > 57) {
			return false;
		    }
		}
		return true;
	    },
	    toBcd : function($data, $cb) {
		var Helper = rsct.Opttan.Helper;
		$data = Helper.rfill($data, 'F');
		return this.compLde($data, false, $cb) + this.compCb($cb) + $data;
	    },
	    toAscii : function($data, $cb) {
		var Helper = rsct.Opttan.Helper;
		return this.compLde($data, true, $cb) + this.compCb($cb) + Helper.toHex($data);
	    },
	    compCb : function($cb) {
		return $cb ? $cb : "";
	    },
	    compLde : function($input, $asc, $cb) {
		var Helper = rsct.Opttan.Helper;
		var $f = 0;
		$f += $asc ? 64 : 0; // ASC or BCD
		$f += $cb ? 128 : 0; // ControlByte?
		if ($asc)
		    $f += $input.length;
		else
		    $f += $input.length / 2;
		return Helper.intToHex($f, true);
	    },
	    getFinTSCode : function(input) {
		var Helper = rsct.Opttan.Helper;

		var startCode = "";
		var bde1 = "";
		var bde2 = "";
		var bde3 = "";
		this._input = input;
		// Laenge Code
		var LC = Helper.decToInt(this._input.substring(0,3));
		this._input = this._input.substring(3, this._input.length);

		// Laenge Startcode
		var LS = Helper.hexToInt(this._input.substring(0,2));
		var LSWithoutBit7 = Helper.unmaskBit7(LS);
		this._input = this._input.substring(2, this._input.length);

		// ControlByte lesen
		var cb = Helper.hexToInt(this._input.substring(0,2));
		var isHhd14 = cb == 1;
		this._input = this._input.substring(2, this._input.length);
		
		// Startcode 
		startCode = this._input.substring(0, LSWithoutBit7);
		this._input = this._input.substring(LSWithoutBit7, this._input.length);
		
		if (this._input.length > 0)
		    bde1 = this.readChunk();

		if (this._input.length > 0)
		    bde2 = this.readChunk();

		if (this._input.length > 0) 
		    bde3 = this.readChunk();

		return this.getCode(startCode, bde1, bde2, bde3);
	    },
	    readChunk : function() {
		var Helper = rsct.Opttan.Helper;
		var length = Helper.decToInt(this._input.substring(0,2));
		this._input = this._input.substring(2, this._input.length);
		var out = this._input.substring(0, length);
		this._input = this._input.substring(length, this._input.length);
		return out;
	    },
	    getCode : function($start_code, $bde1, $bde2, $bde3, $control) {
		var Helper = rsct.Opttan.Helper;

		if (!$bde1) { $bde1 = ''; }
		if (!$bde2) { $bde2 = ''; }
		if (!$bde3) { $bde3 = ''; }

		if (!$control) {
		    $control = "01"; // "8" -> Anderes ControlByte folgt
                    // "1" -> Datenstruktur HHD1.4
		    // Länderkennung
		    //$control += "00"; // Deutschland
		    //$control += "01"; // Österreich
		}

		var $bde1_length = 12;
		var $bde2_length = 12;
		var $bde3_length = 12;
		if ($bde1.length > 12) {
		    $bde1_length = 36;
		} else if ($bde2.length > 12) {
		    $bde2_length = 36;
		} else if ($bde3.length > 12) {
		    $bde3_length = 36;
		}
		var $hdd_start_code = this.toData($start_code, 12, $control);
		var $hdd_bde1 = this.toData($bde1, $bde1_length);
		var $hdd_bde2 = this.toData($bde2, $bde2_length);
		var $hdd_bde3 = this.toData($bde3, $bde3_length);
		
		// strip last components if empty
		if ($bde3 == '') {
		    $hdd_bde3 = '';
		}
		if ($bde2 == '' && $bde3 == '') {
		    $hdd_bde2 = '';
		}
		if ($bde1 == '' && $bde2 == '' && $bde3 == '') {
		    $hdd_bde1 = '';
		}
		
		var $str = $hdd_start_code +
		    $hdd_bde1 + $hdd_bde2 + $hdd_bde3;
		var $lc = Helper.intToHex($str.length / 2 + 1, true);
		
		var $luhn_str = Helper.substr($hdd_start_code, 2);
		
		if ($hdd_bde1.length > 2)
		    $luhn_str += Helper.substr($hdd_bde1, 2);
		
		if ($hdd_bde2.length > 2)
		    $luhn_str += Helper.substr($hdd_bde2, 2);
		
		if ($hdd_bde3.length > 2)
		    $luhn_str += Helper.substr($hdd_bde3, 2);
		
		return $lc + $str + Helper.compLuhn($luhn_str) + Helper.compXor($lc + $str);
	    }
	},
	/* Common Functions for Code Generation */
	Helper : {
	    ord : function(str) {
		return str.charCodeAt(0);
	    },
	    substr : function(str, start, length) {
		if (!length) length = str.length - start;
		return str.substr(start, length);
	    },
	    rfill : function(input, fill) {
		if (input.length % 2 != 0) {
		    input = input + fill;
		}
		return input;
	    },
	    lfill : function(input, fill) {
		if (input.length % 2 != 0) {
		    input = fill + input;
		}
		return input;
	    },
	    compXor : function(input) {
		var tmp = 0;
		var len = input.length;
		for (var i = 0; i < len; i++) {
		    tmp ^= this.hexToInt(this.substr(input, i, 1));
		}
		return this.intToHex(tmp);
	    },
	    hexToInt : function(input) {
		return parseInt(input, 16);
	    },
	    intToHex : function(input, padding) {
		var hex = input.toString(16).toUpperCase();
		if (padding && hex.length == 1) {
		    hex = '0' + hex;
		}
		return hex;
	    },
	    decToInt : function(input) {
		return parseInt(input, 10);
	    },
	    sumOfDigits : function(i) {
		if (i < 10) {
		    return i;
		}
		return this.sumOfDigits(Math.floor(i/10)) + i % 10;
	    },
	    compLuhn : function($str) {
		var $sum = 0;

		for (var $i = 0; $i < $str.length; $i++) {
		    if ($i%2 != 0) {  // 2. Wert wird gedoppelt und Quersumme berechnet
			$sum += this.sumOfDigits(2 * this.hexToInt(this.substr($str, $i, 1)));
		    } else {          // 1. Wert wie er ist
			if (rsct.Opttan._version == 1)
			    $sum += this.hexToInt(this.substr($str, $i, 1));
			else
			    $sum += this.sumOfDigits(this.hexToInt(this.substr($str, $i, 1)));
		    }
		}
		$sum = $sum % 10;
		if ($sum != 0)
		    $sum = 10 - $sum;
		return this.intToHex($sum);
	    },
	    bcdOk : function($input) {
		for (var $i = 0; $i < $input.length; $i++) {
		    if (this.ord(this.substr($input,$i,1)) < 48 || this.ord(this.substr($input,$i,1)) > 57) {
			return false;
		    }
		}
		return true;
	    },
	    utf82zka : function($in) {
		var $tr = { '€' : '$', 
			    'Ä' : '[', 
			    'Ö' : '\\', 
			    'Ü' : ']', 
			    '£' : '^',
			    'ä' : '{', 
			    'ö' : '|', 
			    'ü' : '}', 
			    'ß' : '~'
			  };
		var $input = this.strtr($in, $tr);
		var $tmp = "";
		for (var $i = 0; $i < $input.length; $i++) {
		    if (this.ord(this.substr($input,$i,1)) < 128)
			$tmp += this.substr($input,$i,1);
		}
		return $tmp;
	    },
	    toHex : function($input) {
		var $tmp = "";
		for (var $i = 0; $i < $input.length; $i++) {
		    if (this.ord(this.substr($input,$i,1)) < 128)
			$tmp += this.intToHex(this.ord(this.substr($input,$i,1)));
		}
		return $tmp;
	    },
	    strtr : function(str, from, to) {
		// http://kevin.vanzonneveld.net
		// +   original by: Brett Zamir
		// +      input by: uestla
		// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		var fr = '', i = 0, lgth = 0;

		if (typeof from === 'object') {
		    for (fr in from) {
			str = str.replace(fr, from[fr], 'g');
		    }
		    return str;
		}
		
		lgth = to.length;
		if (from.length < to.length) {
		    lgth = from.length;
		}
		for (i = 0; i < lgth; i++) {
		    str = str.replace(from[i], to[i], 'g');
		}
		return str;
	    },
	    unmaskBit7 : function(input) {
		return input & (1 << 7) - 1;
	    },
	    checkString : function(input, encoding) {
		var valid_chars = "0123456789" +
                    "abcdefghijklmnopqrstuvwxyz" +
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                    "*+-,./:@#`";
		var valid_zka  = new Array(36, 91, 92, 93, 94, 123, 124, 125, 126);       // $[\\]^{|}~
		var valid_utf8 = new Array(8364, 196, 214, 220, 163, 228, 246, 252, 223); // €ÄÖÜ£äöüß

		var valid = new Array();
		var i;
		for (i = 0; i < valid_chars.length; i++) {
		    valid.push(valid_chars.charCodeAt(i));
		}
		if (encoding == 'utf8') {
		    valid = valid.concat(valid_utf8);
		} else {
		    valid = valid.concat(valid_zka);
		}
		var j;
		for (i = 0; i < input.length; i++) {
		    var found = false;
		    for (j = 0; j < valid.length; j++) {
			if (input.charCodeAt(i) == valid[j]) {
			    found = true;
			    continue;
			}
		    }
		    if (!found) {
			throw("'" + input + "' contains illegal characters");
		    }
		}
		return true;
	    }
	}
    }
};

