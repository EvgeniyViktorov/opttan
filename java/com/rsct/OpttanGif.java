/*
 * (c) 2008 REINER SCT
 *
 * $Date: Mon Mar 7 13:55:43 2016 +0100$
 * $Rev: 4.2.0$
 */

package com.rsct;

import net.jmge.gif.Gif89Encoder;
import java.awt.*;
import java.io.*;
import javax.imageio.ImageIO;

public class OpttanGif
{

    private int framesPerSecond = 15;
    private int animTimeout = 60; // seconds
    private static final int maxImages = 500;

    private String imgPath = "com/rsct/opttan_images/";
    private String device = "opttan_m";

    private int image_counter = 0;
    private Image[] images = new Image[maxImages];

    private static final int ST_CLK1_UP = 0;
    private static final int ST_CLK1_DN = 1;

    private int high = 1;
    private int low  = 0;
    private String syncNibble = "";
    private int usPos = 0;
    private int usState = ST_CLK1_UP;

    private String data = "";

    /**
     * Sets the animation speed. Default value is 15 fps.
     * Internet Explorer can't go faster than 15 fps.
     * @param value frames per second
     */
    public void setFramesPerSecond(int value)
    {
        if (value > 0)
            framesPerSecond = value;
    }

    /**
     * Sets the animation Timeout. Default value is 60 seconds.
     * @param value seconds
     */
    public void setAnimTimeout(int value)
    {
        if (value > 0)
            animTimeout = value;
    }

    /**
     * Sets the opttan device.
     * @param value possible values: "opttan_m" (mini), "opttan_mr" (mini rotated)
     *
     */
    public void setDevice(String value)
    {
        device = value;
    }

    /**
     * Sets the data string.
     *
     * @param  input  code to display
     */
    public void setData(String input)
    {
        String new_input = "";
        for (int i=0; i<input.length(); i=i+2) {
            new_input = new_input + input.substring(i+1, i+2) + input.substring(i, i+1);
        }
        data = "0FF"; // SYNC
        data += new_input;
    }

    /**
     * generates the opttan gif from the given code.
     * the code must be generated using com.rsct.Opttan.getCode
     *
     * @param  out    stream to write the generated image to
     */
    public void getGif(OutputStream out)
    {
        loadImages();
        try {
            this.writeAnimatedGIF(out);
        } catch (IOException e) {
            System.out.println("exception: " + e);
        }

    }

    private void writeAnimatedGIF(OutputStream out) throws IOException
    {
        Gif89Encoder gifenc = new Gif89Encoder();
        for (int i = 0; i < image_counter; ++i) {
            gifenc.addFrame(images[i]);
        }
        gifenc.setComments(data);
	// set the LoopCount based on animation timeout
        gifenc.setLoopCount((int) Math.ceil((float)animTimeout / ((float)image_counter / (float)framesPerSecond)));
        gifenc.setUniformDelay((int) Math.round(100.0 / (float)framesPerSecond));
        gifenc.encode(out);
    }

    private void loadImages()
    {
        while (usPos < data.length()) {
	    switch (usState) {
	    case ST_CLK1_UP :
		loadImage(high, data.substring(usPos, usPos+1));
		usState = ST_CLK1_DN;
		break;
	    case ST_CLK1_DN :
		loadImage(low , data.substring(usPos, usPos+1));
		usState = ST_CLK1_UP;
		usPos++;
		break;
	    }
	}
    }

    private void loadImage(int clk1, String data)
    {
        if (image_counter == maxImages)
            return;
        String name = "" + clk1 + Helper.toBin(Helper.hexToInt(data));
        try {
            ClassLoader cl = this.getClass().getClassLoader();
            images[image_counter++] = ImageIO.read(cl.getResource(imgPath + device + "/" + name + ".gif"));
        } catch (IOException e) {
            System.out.println("image notfound: " + imgPath + device + "/"  + name + ".gif");
        }
    }

}
