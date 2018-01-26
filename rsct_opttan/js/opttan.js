/**
 * (c) 2008-2015 REINER SCT
 *
 * $Date: Mon Mar 7 13:55:43 2016 +0100$
 * $Rev: 4.2.0$
 */

var RsctOpttan = RsctOpttan || {};

// Object
// For the initiated application
RsctOpttan.opttanApp = null;

// Class
// Canvas Generator Implementation
RsctOpttan.JsCanvas = function () {

    var context;
    var height;
    var width;
    var device;
    var border_width = 0.1;

    var html = function () {
        document.getElementById('rsct-opttan-app').innerHTML = "<canvas id='rsct-opttan-canvas-app'></canvas>";
    };

    var init = function (dev) {
        html();
        var canvas = document.getElementById('rsct-opttan-canvas-app');
        context = canvas.getContext("2d");
        height = context.canvas.height;
        width = context.canvas.width;
        device = dev;
    };

    var showField = function (num) {
        context.fillStyle = 'white';
        var border;
        if (device == 'opttan_m') {
            var lwidth = width / 5;
            border = lwidth * border_width;
            context.fillRect(border + (lwidth * num), 0, lwidth - 2 * border, height);
        } else {
            num = 4 - num;
            var lheight = height / 5;
            border = lheight * border_width;
            context.fillRect(0, border + (lheight * num), width, lheight - 2 * border);
        }
    };

    var hideField = function (num) {
        var border;
        if (device == 'opttan_m') {
            var lwidth = width / 5;
            border = lwidth * border_width;
            context.clearRect(border + (lwidth * num), 0, lwidth - 2 * border, height);
        } else {
            num = 4 - num;
            var lheight = height / 5;
            border = lheight * border_width;
            context.clearRect(0, border + (lheight * num), width, lheight - 2 * border);
        }
    };

    var setDevice = function (dev) {
        device = dev;
        // clear
        context.clearRect(0, 0, width, height);
    };

    var oPublic =
        {
            init: init,
            showField: showField,
            hideField: hideField,
            setDevice: setDevice
        };

    return oPublic;
}();

// Class
// Div Generator Implementation
RsctOpttan.JsDiv = function () {

    var device;
    var fields = ['rsct-opttan-clk1', 'rsct-opttan-data0', 'rsct-opttan-data1', 'rsct-opttan-data2', 'rsct-opttan-data3'];

    var html = function () {
        var content = "<div id='rsct-opttan-clk1'></div>" +
            "<div id='rsct-opttan-data0'></div>" +
            "<div id='rsct-opttan-data1'></div>" +
            "<div id='rsct-opttan-data2'></div>" +
            "<div id='rsct-opttan-data3'></div>";

        document.getElementById('rsct-opttan-app').innerHTML = content;
    };

    var init = function (dev) {
        html();
        device = dev;
    };

    var showField = function (num) {
        //document.getElementById(fields[num]).style.visibility = 'visible';
        document.getElementById(fields[num]).className = 'rsct-opttan-visible';
    };

    var hideField = function (num) {
        //document.getElementById(fields[num]).style.visibility = 'hidden';
        document.getElementById(fields[num]).className = 'rsct-opttan-hidden';
    };

    var setDevice = function (dev) {
        device = dev;
    };

    var oPublic =
        {
            init: init,
            showField: showField,
            hideField: hideField,
            setDevice: setDevice
        };

    return oPublic;
}();

// Class
// JavaScript Implementation
RsctOpttan.JsOpttan = function (input, device, delay) {

    if (!device) alert('No device given');

    this.delay = delay ? delay : 0;  // milliseconds to next step
    this.device = device;
    this.stopped = false;

    var generator;
    var datapos = 0;

    var high = 1;
    var low = 0;

    var vtab = [];
    vtab['0'] = [low, low, low, low];
    vtab['1'] = [low, low, low, high];
    vtab['2'] = [low, low, high, low];
    vtab['3'] = [low, low, high, high];
    vtab['4'] = [low, high, low, low];
    vtab['5'] = [low, high, low, high];
    vtab['6'] = [low, high, high, low];
    vtab['7'] = [low, high, high, high];
    vtab['8'] = [high, low, low, low];
    vtab['9'] = [high, low, low, high];
    vtab.A = [high, low, high, low];
    vtab.B = [high, low, high, high];
    vtab.C = [high, high, low, low];
    vtab.D = [high, high, low, high];
    vtab.E = [high, high, high, low];
    vtab.F = [high, high, high, high];

    var ST_CLK1_UP = 0;
    var ST_CLK1_DN = 1;

    var usPos = 0;
    var startDelay = 0;
    var usState = ST_CLK1_UP;

    this.init = function () {

        var isCanvasSupported = function () {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        };
        // check if canvas is supported
        if (isCanvasSupported()) {
            generator = RsctOpttan.JsCanvas;
        } else {
            generator = RsctOpttan.JsDiv;
        }
        generator.init(this.device);
    };

    this.setDevice = function (dev) {
        this.device = dev;
        if (generator)
            generator.setDevice(dev);
    };
    this.setDevice(device);

    this.setOpttan = function (clk1, nibble) {

        this.displayField(0, clk1);
        if (nibble) {
            this.displayField(1, vtab[nibble][3]);
            this.displayField(2, vtab[nibble][2]);
            this.displayField(3, vtab[nibble][1]);
            this.displayField(4, vtab[nibble][0]);
        }
    };

    this.displayField = function (fld, show) {
        if (show)
            generator.showField(fld);
        else
            generator.hideField(fld);
    };

    this.nextTimer = function (time) {
        if (this.interval)
            window.clearTimeout(this.interval);
        var self = this;
        var nextDelay = self.delay - (time - self.lastTime);
        nextDelay = nextDelay < 0 ? 0 : nextDelay;
        this.interval = setTimeout(function () {
            self.lastTime = new Date().getTime();
            self.timer();
        }, nextDelay);
    };

    this.timer = function () {
        if (this.stopped) return false;
        switch (usState) {
            case ST_CLK1_UP :
                this.setOpttan(high, data[usPos]);
                usState = ST_CLK1_DN;
                break;
            case ST_CLK1_DN :
                this.setOpttan(low, data[usPos]);
                usState = ST_CLK1_UP;
                if (startDelay < 4) {
                    startDelay++;
                    break;
                }
                usPos++;
                if (usPos >= data.length) {
                    RsctOpttan.opttanApp.opttanRestart();
                    usPos = 0;
                }
                break;
        }
        return this.nextTimer(new Date().getTime());
    };

    this.sortBytes = function (input) {
        var new_data = "";
        for (var i = 0; i < input.length; i = i + 2) {
            new_data = new_data + input.substr(i + 1, 1) + input.substr(i, 1);
        }
        return new_data;
    };

    this.start = function () {
        usPos = 0;
        startDelay = 0;
        this.stopped = false;
        this.lastTime = new Date().getTime();
        this.nextTimer(this.lastTime);
    };

    this.stop = function () {
        this.stopped = true;
    };

    this.setFps = function (fps) {
        this.delay = Math.round(1000 / fps);
    };

    var data = "0FF"; // SYNC
    data = (data + this.sortBytes(input).toUpperCase()).split('');
};

// Class
// Gif Implementation
RsctOpttan.GifOpttan = function (data, device) {
    if (!device) alert('No device given');

    this.fps = opttanConfig.gifFPS;
    this.data = data;
    this.device = device;

    this.setDevice = function (dev) {
        this.device = dev;
    };

    var html = function () {
        if (!opttanConfig.gifGeneratorPath)
            return "Fehler: Der Pfad zum Gif-Generator ist nicht gesetzt (Konfiguration: gifGeneratorPath)!";
        return "<img src='' id='rsct-opttan-gif-app' alt='' />";
    };

    this.init = function () {
        document.getElementById('rsct-opttan-app').innerHTML = html();
    };

    this.start = function () {
        var src = opttanConfig.gifGeneratorPath + "?data=" + this.data + "&fps=" + this.fps + "&timeout=" + opttanConfig.animTimeout + "&device=" + this.device + "&" + Math.random();
        document.getElementById("rsct-opttan-gif-app").src = src;
    };

};

// Class
// Opttan Frame Implementation
RsctOpttan.Opttan = function (data, opttan_path, type) {
    opttanConfig.path = opttan_path;
    opttanConfig.imgPath = opttanConfig.imgPath ? opttanConfig.imgPath : 'images/';
    this.cookie_prefix = opttanConfig.cookiePrefix;
    var selected_type = false;
    type = type ? parseInt(type) : 0;
    this.types = ['auto', 'js', 'gif'];
    this.app = false;
    this.settings = [];
    this.run_timer = false;
    this.stopped = true;
    this.delay = opttanConfig.defaultDelay;
    this.start_size = [];

    this.opttanRestart = function () {
        if (this.stopped) {
            this.stop();
        }
    };

    this.stop = function () {
        var app = this.app;
        if (app.stop) app.stop();
        clearTimeout(this.run_timer);
        var id = "rsct-opttan-generation";
        RsctOpttan.Helper.removeClass(document.getElementById(id), "rsct-opttan-running");
    };

    this.start = function () {
        var self = this;
        var app = this.app;
        clearTimeout(this.run_timer);
        var id = "rsct-opttan-generation";
        RsctOpttan.Helper.addClass(document.getElementById(id), "rsct-opttan-running");
        if (app.start) app.start();
        this.stopped = false;
        this.run_timer = setTimeout(function () {
            self.stopped = true;
            if (selected_type == 3) // we have to stop gif generator manually
                self.opttanRestart();
        }, opttanConfig.animTimeout * 1000);
    };

    this.fold = function () {
        var id = "rsct-opttan-generation";
        RsctOpttan.Helper.addClass(document.getElementById(id), "rsct-opttan-fold");
        this.stop();
        this.setCookie('fold', 1);
    };

    this.unfold = function () {
        var id = "rsct-opttan-generation";
        RsctOpttan.Helper.removeClass(document.getElementById(id), "rsct-opttan-fold");
        this.setCookie('fold', 0);
    };

    this.resizeWarning = function (newwidth) {
        this.newwidth = newwidth;
        // return true if user accepted resize
        if (this.getCookieValue('resizeOK') == 1)
            return true;
        // return true if new size does not exceed limit
        if (this.start_size[this.app.device] * (opttanConfig.resizeLimit / 100 + 1) > newwidth)
            return true;
        // show warning to user
        RsctOpttan.opttanApp.stop();
        document.getElementById('rsct-opttan-resize-warning').className = 'rsct-opttan-display';
        return false;
    };

    this.resizeWarningCancel = function () {
        document.getElementById('rsct-opttan-resize-warning').className = 'rsct-opttan-hide';
        RsctOpttan.opttanApp.start();
    };

    this.resizeWarningOK = function () {
        this.setCookie('resizeOK', 1);
        document.getElementById('rsct-opttan-resize-warning').className = 'rsct-opttan-hide';
        RsctOpttan.opttanApp.start();
        this.resizeWH(this.newwidth);
    };

    this.resizeWH = function (newwidth) {
        if (!newwidth) return false;
        //if (!document.getElementById('rsct-opttan-app')) return false;
        if (newwidth < 1) return true;
        if (newwidth > 78) return true;

        newwidth = Math.round(newwidth);

        var device = this.app.device;
        // check resize warning
        if (!this.resizeWarning(newwidth, device))
            return false;

        document.getElementById('rsct-opttan-resize-warning').className = 'rsct-opttan-hide';
        document.getElementById('rsct-opttan-device').className = "rsct-opttan-size-" + newwidth;
        this.setCookie('width_' + device, newwidth);

        return true;
    };

    // hold configuration in own cookie
    // by overwriting cookie_prefix (e.g. for training files)
    // and save to real cookie later
    this.saveCookie = function () {
        var old_prefix = this.cookie_prefix;
        this.cookie_prefix = opttanConfig.cookiePrefix;
        this.writeSettings();
        this.cookie_prefix = old_prefix;
    };

    this.resetCookie = function () {
        this.setCookie('width', '');
    };

    this.getWidth = function () {
        var o = document.getElementById('rsct-opttan-device');
        var current = RsctOpttan.Helper.classList(o)[0].split("-");
        return parseInt(current[current.length - 1]);
    };

    this.resize = function (step) {
        this.resizeWH(this.getWidth() + step);
    };

    this.customize = function () {
        var img = new Image();
        RsctOpttan.Helper.addLoadEvent(img, function () {
            document.getElementById('rsct-opttan-bg-image').src = img.src;
        });
        img.src = opttanConfig.path + (opttanConfig.customPath ? opttanConfig.customPath : 'custom_images') + "/rsct_" + this.app.device + "_bg-" + opttanConfig.version + ".png";
    };

    this.setup = function () {
        // setup event handlers
        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-larger', function () {
            RsctOpttan.opttanApp.resize(1);
            return false;
        });
        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-smaller', function () {
            RsctOpttan.opttanApp.resize(-1);
        });

        RsctOpttan.Helper.addClickEvent('rsct-opttan-app-faster', function () {
            RsctOpttan.opttanApp.setDelay(-1);
        });
        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-faster', function () {
            RsctOpttan.opttanApp.setDelay(-1);
        });
        RsctOpttan.Helper.addClickEvent('rsct-opttan-app-slower', function () {
            RsctOpttan.opttanApp.setDelay(1);
        });
        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-slower', function () {
            RsctOpttan.opttanApp.setDelay(1);
        });

        RsctOpttan.Helper.addClickEvent('rsct-opttan-app-button-start', function () {
            RsctOpttan.opttanApp.start();
        });
        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-start', function () {
            RsctOpttan.opttanApp.start();
        });
        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-stop', function () {
            RsctOpttan.opttanApp.stop();
        });

        RsctOpttan.Helper.addClickEvent('rsct-opttan-warning-cancel', function () {
            RsctOpttan.opttanApp.resizeWarningCancel();
        });
        RsctOpttan.Helper.addClickEvent('rsct-opttan-warning-ok', function () {
            RsctOpttan.opttanApp.resizeWarningOK();
        });

        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-fold', function () {
            // RsctOpttan.opttanApp.fold();
        });
        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-unfold', function () {
            // RsctOpttan.opttanApp.unfold();
        });


        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-opttan_m', function () {
            RsctOpttan.opttanApp.rotate('opttan_mr');
        });
        RsctOpttan.Helper.addClickEvent('rsct-opttan-button-opttan_mr', function () {
            RsctOpttan.opttanApp.rotate('opttan_m');
        });

        var dev = this.getCookieValue('rotate') == '1' ? 'opttan_mr' : 'opttan_m';

        this.app.init();
        this.showDevice(dev, opttanConfig.defaultSize);
        RsctOpttan.opttanApp.customize();

        if (opttanConfig.foldButton) {
            var hide = this.getCookieValue('fold');
            if (hide == 1 || (hide === null && opttanConfig.foldOpttanMini)) this.fold();
        }
    };

    this.setDelay = function (value) {
        var newdelay = 1000 / (this.getFps(this.delay) - value);
        if (newdelay < RsctOpttan.opttanApp.getMaxDelay())
            newdelay = RsctOpttan.opttanApp.getMaxDelay();
        else if (newdelay > 500) // 2Hz Mindest-Frequenz
            newdelay = 500;
        this.delay = newdelay;
        this.app.setFps(this.getFps(newdelay));
        this.showSpeedo();
        RsctOpttan.opttanApp.setCookie('delay', newdelay);
    };

    this.getFps = function (ms) {
        return Math.round(1000 / ms);
    };

    this.showSpeedo = function () {
        var thisC = this;
        if (this.speedo_timer)
            window.clearTimeout(this.speedo_timer);
        var x = this.getFps(this.delay);
        var d = (100 - 10) / (this.getFps(opttanConfig.defaultDelay) - 2);
        var y = d * x + (10 - d * 2);
        thisC.speedo = document.getElementById('rsct-opttan-speedo');
        thisC.speedo.innerHTML = y + ' %';
        thisC.speedo.className = "rsct-opttan-visible";
        this.speedo_timer = window.setTimeout(function () {
            thisC.speedo.className = "rsct-opttan-hidden";
        }, 1000);
    };

    this.setCookie = function (key, value, ignore) {
        this.readSettings();
        this.settings[key] = value;
        this.writeSettings();
    };

    this.getCookieValue = function (key) {
        this.readSettings();
        if (this.settings[key])
            return (this.settings[key]);
        else
            return null;
    };

    this.readSettings = function () {
        var settings = '';
        if (opttanConfig.userSettingsId && document.getElementById(opttanConfig.userSettingsId)) {
            settings = unescape(document.getElementById(opttanConfig.userSettingsId).value);
        } else {
            var name = this.cookie_prefix + "_data";
            var usersettings = typeof(document) != 'undefined' ? document.cookie : '';
            var found = usersettings.indexOf(name + "=");
            if (found > -1) {
                var start = found + name.length + 1;
                var end = usersettings.indexOf('; ', start);
                if (end == -1) {
                    end = usersettings.length;
                }
                settings = unescape(usersettings.substring(start, end));
            }
        }

        if (settings !== "") {
            var temp = settings.split("&");
            for (var i = 0; i < temp.length; i++) {
                var t2 = temp[i].split("=");
                this.settings[t2[0]] = t2[1];
            }
        }
    };

    this.writeSettings = function () {
        var strtmp = [];
        for (var key in this.settings) {
            if (key !== "") strtmp.push(key + "=" + this.settings[key]);
        }
        if (opttanConfig.userSettingsId && document.getElementById(opttanConfig.userSettingsId)) {
            document.getElementById(opttanConfig.userSettingsId).value = escape(strtmp.join('&'));
        } else {
            var cookie_string = this.cookie_prefix + "_data=" + escape(strtmp.join('&'));
            if (opttanConfig.cookieExpire > 0) {
                var expires = new Date((new Date()).getTime() + 1000 * opttanConfig.cookieExpire);
                cookie_string += "; expires=" + expires.toGMTString();
            }
            cookie_string += "; path=/";
            document.cookie = cookie_string;
        }
    };

    this.displayDevice = function (device) {
        if (!device) alert('No device given');
        this.delay = this.getDelay();
        var app = selectApp(device, this.delay);
        var out = "<table id='rsct-opttan-generation' class='rsct_" + device + "'>";
        out += this.showTitlebar(device);
        out += "<tr id='rsct-opttan-area'>";
        out += "<td><div id='rsct-opttan-device'>";
        out += showBackground(device);
        out += "<div id='rsct-opttan-app'></div>";
        out += appControls();
        out += appPlay();
        // resize warning
        out += "<div id='rsct-opttan-resize-warning'><img src='" + opttanConfig.path + opttanConfig.resizeImage + "' alt='Warnung' /><p>" + opttanConfig.resizeText + "<br/><br/><span id='rsct-opttan-warning-cancel'>" + opttanConfig.resizeCancel + "</span><span id='rsct-opttan-warning-ok'>" + opttanConfig.resizeOK + "</span><br /></p></div>";
        out += "</div>";
        out += "</td>";
        out += "</tr>";
        out += "</table>";
        this.app = app;
        return out;
    };

    this.rotate = function (device) {
        this.stop();
        switch (device) {
            case 'opttan_mr':
                this.showDevice('opttan_mr');
                this.setCookie('rotate', 1);
                break;
            case 'opttan_m':
                this.showDevice('opttan_m');
                this.setCookie('rotate', 0);
                break;
        }
        RsctOpttan.opttanApp.customize();
    };

    this.showDevice = function (device, size) {
        if (!size) size = 1;
        this.stop();
        document.getElementById('rsct-opttan-generation').className = "rsct-" + device;
        document.getElementById('rsct-opttan-bg-image').src = opttanConfig.path + opttanConfig.imgPath + "rsct_" + device + "_bg-" + opttanConfig.version + ".png";
        this.app.setDevice(device);

        // reset width and height
        var startSize = 70;
        var elem = document.getElementById('rsct-opttan-device');
        elem.className = "rsct-opttan-size-" + startSize;

        if (!this.start_size[device])
            this.start_size[device] = startSize * opttanConfig.defaultSize;
        if (this.resizeWH((this.getCookieValue('width_' + device) ? this.getCookieValue('width_' + device) : startSize * size)))
            this.start();
    };

    function selectApp(device, delay) {
        if (!device) alert('No device given');
        selected_type = type;
        if (selected_type === 0) {
            selected_type = isTerminalServer() ? 3 : 2;
        }
        if (selected_type == 2) return new RsctOpttan.JsOpttan(data, device, delay);
        if (selected_type == 3) return new RsctOpttan.GifOpttan(data, device);
        return alert('wrong type:' + type);
    }

    this.getDelay = function () {
        if (this.getCookieValue('delay')) {
            var value = parseInt(this.getCookieValue('delay'));
            if (value < this.getMaxDelay() || value > 500)
                value = opttanConfig.defaultDelay;
            return value;
        } else {
            return this.delay;
        }
    };

    this.getMaxDelay = function () {
        return opttanConfig.maxDelay ? opttanConfig.maxDelay : opttanConfig.defaultDelay;
    };

    function isTerminalServer() {
        try {
            if (navigator.userAgent.indexOf("Windows NT 5.2") != -1) return true; //win 2003 server
            if (navigator.userAgent.indexOf("WTS") != -1) return true; //windows terminal server
        } catch (e) {
            // do nothing
        }

        try {
            var a = new ActiveXObject("RsctFt.RsctFtCtrl.1");
        } catch (e) {
            return false;
        }
        return true;
    }

    this.showTitlebar = function (device) {
        if (!device) alert('No device given');

        var content = '';
        content += "<tr><td class='rsct-opttan-titlebar' colspan='2'>";

        if (opttanConfig.foldButton) {
            content += "<span id='rsct-opttan-button-fold'>"
            // "<img src='" + opttanConfig.path + opttanConfig.imgPath + "rsct_unfold-" + opttanConfig.version + ".png' alt='" + opttanConfig.text.fold + "' title='" + opttanConfig.text.fold + "' /></span>";
            content += "<span id='rsct-opttan-button-unfold'>" +
                "<img src='" + opttanConfig.path + opttanConfig.imgPath + "rsct_fold-" + opttanConfig.version + ".png' alt='" + opttanConfig.text.fold + "' title='" + opttanConfig.text.fold + "' /></span>";
        }
        content += "<div id='rsct-opttan-titlebar-left'>";

        content += "<span id='rsct-opttan-button-start' class='rsct-opttan-hide'><img src='" + opttanConfig.path + opttanConfig.imgPath + "rsct_play-" + opttanConfig.version + ".png' alt='" + opttanConfig.text.play + "' title='" + opttanConfig.text.play + "' /></span>";
        content += "<span id='rsct-opttan-button-stop'><img src='" + opttanConfig.path + opttanConfig.imgPath + "rsct_pause-" + opttanConfig.version + ".png' alt='" + opttanConfig.text.pause + "' title='" + opttanConfig.text.pause + "' /></span>";
        if (opttanConfig.speedButtons && selected_type != 3) {
            content += "<span id='rsct-opttan-button-slower'>-</span>";
            content += "<span id='rsct-opttan-button-faster'>+</span>";
        }
        content += "<span id='rsct-opttan-button-smaller'>-</span>";
        content += "<span id='rsct-opttan-button-larger'>+</span>";

        content += "<span id='rsct-opttan-button-opttan_m' class='rsct-opttan_mr-hide'><img src='" + opttanConfig.path + opttanConfig.imgPath + "rsct_rotate_left-" + opttanConfig.version + ".png' alt='" + opttanConfig.text.rotate + "' title='" + opttanConfig.text.rotate + "' /></span>";
        content += "<span id='rsct-opttan-button-opttan_mr' class='rsct-opttan_m-hide'><img src='" + opttanConfig.path + opttanConfig.imgPath + "rsct_rotate_right-" + opttanConfig.version + ".png' alt='" + opttanConfig.text.rotate + "' title='" + opttanConfig.text.rotate + "' /></span>";
        content += "</div>&nbsp;";
        content += "</div></td></tr>";
        return content;
    };

    function appPlay() {
        return "<div id='rsct-opttan-app-button-start'>" +
            "<img src='" + opttanConfig.path + opttanConfig.playImage + "' alt='" + opttanConfig.text.play + "' title='" + opttanConfig.text.play + "' /></div>";
    }

    function appControls() {
        return "<div id='rsct-opttan-app-controls'>" +
            "<div id='rsct-opttan-app-slower'></div><div id='rsct-opttan-app-faster'></div>" +
            "<div id='rsct-opttan-speedo' class='rsct-opttan-hidden'>100%</div></div>";
    }

    function showBackground(device) {
        return "<img id='rsct-opttan-bg-image' src='" + opttanConfig.path + opttanConfig.imgPath + "rsct_" + device + "_bg-" + opttanConfig.version + ".png' alt='' />";
    }

    this.tanHeader = function () {
        return "<tr><td class='rsct-opttan-titlebar' colspan='2'>&nbsp;" + opttanConfig.textHeader + "</td></tr>";
    };

    this.display = function () {
        var out = '';
        if (opttanConfig.showHeader)
            out += this.tanHeader();
        return this.displayDevice("opttan_m");
    };

    this.checkCookie = function () {
        this.setCookie('test', true);
        if (!this.getCookieValue('test'))
            alert(opttanConfig.text.no_cookie);
    };

};

// Method
// Initialize the opttan application
RsctOpttan.init = function (containerId) {
    var container = document.getElementById(containerId);
    if (container) {
        var code = container.getAttribute("data-code");
        var path = container.getAttribute("data-path");
        var type = container.getAttribute("data-type");
        RsctOpttan.opttanApp = new RsctOpttan.Opttan(code, path, type);
        container.innerHTML = RsctOpttan.opttanApp.display();
        RsctOpttan.opttanApp.setup();
    }
};

// Class
// JS Helpers
RsctOpttan.Helper = function () {

    // IE8 Compatibility
    var addEvent = function (elem, f, e) {
        if (elem.addEventListener) {
            elem.addEventListener(e, f);
        } else {
            elem.attachEvent("on" + e, f);
        }
    }

    var addClickEvent = function (id, f) {
        var elem = document.getElementById(id);
        addEvent(elem, f, "click");
    }

    var addLoadEvent = function (elem, f) {
        addEvent(elem, f, "load");
    }

    var addContentLoadedEvent = function (f) {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", f);
        } else {
            document.attachEvent("onreadystatechange", f);
        }
    }

    var hasClass = function (node, name) {
        var a = classList(node);
        for (var i = 0; i < a.length; i++) {
            if (a[i] === name) {
                return true;
            }
        }
        return false;
    };

    var classList = function (node) {
        return node.className.split(" ");
    };

    var addClass = function (node, name) {
        if (!hasClass(node, name)) {
            node.className = node.className + " " + name;
        }
    };

    var removeClass = function (node, name) {
        var list = classList(node);
        var newlist = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i] !== name) {
                newlist.push(list[i]);
            }
        }
        node.className = newlist.join(" ");
    };

    var oPublic =
        {
            addClickEvent: addClickEvent,
            addLoadEvent: addLoadEvent,
            addContentLoadedEvent: addContentLoadedEvent,
            hasClass: hasClass,
            classList: classList,
            addClass: addClass,
            removeClass: removeClass
        };

    return oPublic;

}();
