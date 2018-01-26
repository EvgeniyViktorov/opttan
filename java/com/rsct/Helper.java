/**
 * (c) 2008 REINER SCT
 *
 * $Date: Mon Mar 7 13:55:43 2016 +0100$
 * $Rev: 4.2.0$
 */

package com.rsct;


public class Helper
{

    public static String rfill (String input, String fill)
    {
        if (input.length() % 2 != 0) {
            input = input + fill;
        }
        return input;
    }

    public static String lfill (String input, String fill)
    {
        if (input.length() % 2 != 0) {
            input = fill + input;
        }
        return input;
    }

    public static String intToHex (int input)
    {
        return intToHex(input, false);
    }

    public static String intToHex (int input, boolean padding)
    {
        String hex = Integer.toHexString(input).toUpperCase();
        if (padding && hex.length() == 1) {
            hex = "0" + hex;
        }
        return hex;
    }

    public static int hexToInt (String input)
    {
        return Integer.parseInt(input, 16);
    }

    public static int decToInt (String input)
    {
        return Integer.parseInt(input, 10);
    }

    public static int sumOfDigits(int i)
    {
        if (i < 10) {
            return i;
        }
        return sumOfDigits(i/10) + i%10;
    }

    public static String toBin (int i)
    {
        String s = Integer.toBinaryString(i + 16);
        return s.substring(1,5);
    }

    public static String compLuhn (String input, int version)
    {
        int sum = 0;

        for (int i = 0; i < input.length(); i++) {
            if (i%2 != 0) {
                sum += sumOfDigits(2 * hexToInt(input.substring(i, i+1)));
            } else {
                if (version == 1) {
                    sum += hexToInt(input.substring(i, i+1));
                } else {
                    sum += sumOfDigits(hexToInt(input.substring(i, i+1)));
                }
            }
        }
        sum = sum % 10;
        if (sum != 0) {
            sum = 10 - sum;
        }
        return intToHex(sum);
    }

    public static String compLuhn (String input)
    {
        return compLuhn(input, 2);
    }

    public static String compXor (String input)
    {
        int tmp = 0;
        int len = input.length();
        for (int i = 0; i < len; i += 1) {
            tmp ^= hexToInt(input.substring(i, i+1));
        }
        return intToHex(tmp);
    }

    public static boolean bcdOk (String input)
    {
        try {
            for (int i = 0; i < input.length(); i++)
                Helper.decToInt(input.substring(i,i+1));
        } catch (NumberFormatException e) {
            return false;
        }
        return true;
    }

    public static String utf82zka (String input)
    {
        input = input.replace('€', '$');
        input = input.replace('Ä', '[');
        input = input.replace('Ö', '\\');
        input = input.replace('Ü', ']');
        input = input.replace('£', '^');
        input = input.replace('ä', '{');
        input = input.replace('ö', '|');
        input = input.replace('ü', '}');
        input = input.replace('ß', '~');
        return input;
    }

    private static String removeChar(String s, char c)
    {
        String r = "";
        for (int i = 0; i < s.length(); i ++) {
            if (s.charAt(i) != c) r += s.charAt(i);
        }
        return r;
    }

    public static String toHex (String input)
    {
        String tmp = "";
        for (int i = 0; i < input.length(); i++) {
            if ((int)input.charAt(i) < 128) {
                tmp += intToHex((int)input.charAt(i));
            }
        }
        return tmp;
    }

    public static String convertInput (String input, String inputEncoding) throws OpttanException
    {
        try {
            String valid_chars = "0123456789" +
                "abcdefghijklmnopqrstuvwxyz" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                "*+-,./:@#`";
            byte[] valid_bytes = valid_chars.getBytes("UTF-8");
            int[] valid_zka    = {36, 91, 92, 93, 94, 123, 124, 125, 126};       // $[\\]^{|}~
            int[] valid_utf8   = {8364, 196, 214, 220, 163, 228, 246, 252, 223}; // €ÄÖÜ£äöüß
            int[] valid        = new int[valid_bytes.length + 9];

            for (int i = 0; i < valid_bytes.length; i++) {
                valid[i] = (int)valid_bytes[i];
            }

            if (inputEncoding.equals("utf8")) {
                System.arraycopy(valid_utf8, 0, valid, valid_bytes.length, 9);
            } else {
                System.arraycopy(valid_zka, 0, valid, valid_bytes.length, 9);
            }

            for (int i = 0; i < input.length(); i++) {
                boolean found = false;
                for (int j = 0; j < valid.length; j++) {
                    if ((int)input.charAt(i) == valid[j]) {
                        found = true;
                        continue;
                    }
                }
                if (!found)
                    throw new OpttanException ("'" + input + "' contains illegal characters");
            }

        } catch (java.io.UnsupportedEncodingException e) {
            throw new OpttanException ("java.io.UnsupportedEncodingException: " + e.getMessage());
        }
        if (inputEncoding.equals("utf8")) {
            return utf82zka(input);
        } else {
            return input;
        }
    }

    /**
     * Unmasks 7th bit of integer
     *
     * @return        integer without last bit
     */
    public static int unmaskBit7(int input) {
	return input & (1 << 7) - 1;
    }

}
