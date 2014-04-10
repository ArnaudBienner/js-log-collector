/*!
 * js-log-collector - http://github.com/ArnaudBienner/js-log-collector
 * Arnaud Bienner
 * js-log-collector may be freely distributed under the MIT license.
 *
 * Extends the js-logger developed by Jonny Reeves:
 * js-logger - http://github.com/jonnyreeves/js-logger 
 */

(function (window) {
    "use strict";

  // Some default values:
  // How many log we want to keep
  var DEFAULT_NB_LOG_TO_KEEP = 10;
  // When LEVEL_SEND is reach, we send logs
  var DEFAULT_LEVEL_SEND = Logger.ERROR;
  // Below this level, we don't keep logs
  var DEFAULT_LEVEL_RETAIN = Logger.DEBUG;
  var DEFAULT_TARGET_URL = "http://localhost:10000/";

  var defineMode = function (value, name) {
    return { value: value, name: name };
  }
  Logger.PRD_MODE = defineMode(0, 'PRD');
  Logger.DEV_MODE = defineMode(0, 'DEV');
  var DEFAULT_MODE = Logger.DEV_MODE;

  Logger.saveLogs = function(messages) {
    for (var i = 0; i < messages.length; i++) {
      if (this.logBuffer.length > this.nb_log_to_keep) {
        this.logBuffer.shift()
      }
      this.logBuffer.push(messages[i]);
    }
  }

  Logger.getLogs = function() {
    return logBuffer;
  }

  Logger.sendLogs = function() {
    var req = new XMLHttpRequest();
    req.open("POST", this.target_url, true);
    //var data = this.logBuffer.toString(); // JSON.stringify(logBuffer);
    var data = JSON.stringify(this.logBuffer);
    req.send(data);
    // Empty log array
    this.logBuffer.length = 0;
  }
  
  Logger.useLogReport = function(
    target_url,
    mode,
    level_retain,
    level_send,
    nb_log_to_keep
    ) {

    Logger.target_url = target_url || DEFAULT_TARGET_URL;
    Logger.mode = mode || DEFAULT_MODE;
    //console.log(mode);
    Logger.level_send = level_send || DEFAULT_LEVEL_SEND;
    Logger.level_retain = level_retain || DEFAULT_LEVEL_RETAIN;
    Logger.nb_log_to_keep = nb_log_to_keep || DEFAULT_NB_LOG_TO_KEEP;

    Logger.setLevel(Logger.DEBUG);

    // Log we keep in memory for some time
    Logger.logBuffer = new Array();

    Logger.setHandler(function(messages, context) {
      var console = window.console;
      var hdlr = console.log;

      // Prepend the logger's name to the log message for easy identification.
      if (context.name) {
        messages[0] = "[" + context.name + "] " + messages[0];
      }
      var timestamp = Date.now()
      messages[0] = timestamp + " " + context.level.name + ": " + messages[0];

      if (Logger.mode == Logger.DEV_MODE) {
        // Delegate through to custom warn/error loggers if present on the console.
        if (context.level === Logger.WARN && console.warn) {
          hdlr = console.warn;
        } else if (context.level === Logger.ERROR && console.error) {
          hdlr = console.error;
        } else if (context.level === Logger.INFO && console.info) {
          hdlr = console.info;
        }
      }

      hdlr.apply(console, messages);
      Logger.saveLogs(messages);

      if (context.level.value >= Logger.level_send.value) {
        Logger.sendLogs();
      }

    });
  };

}(window))
