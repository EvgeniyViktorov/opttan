import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class OpttanGif extends HttpServlet
{
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException
    {

        com.rsct.OpttanGif gif = new com.rsct.OpttanGif();

        String data    = request.getParameter("data");
        String device  = request.getParameter("device");
        String fps     = request.getParameter("fps");
        String timeout = request.getParameter("timeout");
        gif.setData(data);
        gif.setDevice(device);
        gif.setFramesPerSecond(Integer.parseInt(fps)); // Default: 15
        gif.setAnimTimeout(Integer.parseInt(timeout)); // Default: 60

        ServletOutputStream out = response.getOutputStream();
        response.setContentType("image/gif");
        gif.getGif(out);
    }
}
