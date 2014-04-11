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
  var DEFAULT_TARGET_URL = "http://localhost:10000/";
  // When LEVEL_SEND is reach, we send logs
  var DEFAULT_LEVEL_SEND = Logger.ERROR;
  // Below this level, we don't keep logs
  var DEFAULT_LEVEL_RETAIN = Logger.DEBUG;
  // How many log we want to keep
  var DEFAULT_NB_LOG_TO_KEEP = 100;

  var defineMode = function (value, name) {
    return { value: value, name: name };
  }
  Logger.PRD_MODE = defineMode(0, 'PRD');
  Logger.DEV_MODE = defineMode(0, 'DEV');
  var DEFAULT_MODE = Logger.DEV_MODE;

  Logger.saveLogs = function(messages) {
    this.logBuffer.push(messages);
    if (this.logBuffer.length > this.nb_log_to_keep) {
      this.logBuffer.shift()
    }
  }

  Logger.getLogs = function() {
    return logBuffer;
  }

  Logger.sendLogs = function() {
    var req = new XMLHttpRequest();
    req.open("POST", this.target_url, true);
    var data = JSON.stringify(this.logBuffer);
    req.send(data);
    // Empty log array
    this.logBuffer.length = 0;
  }
  
  Logger.useLogReport = function(
    target_url,
    level_send,
    level_retain,
    nb_log_to_keep,
    mode
    ) {

    Logger.target_url = target_url || DEFAULT_TARGET_URL;
    Logger.level_send = level_send || DEFAULT_LEVEL_SEND;
    Logger.level_retain = level_retain || DEFAULT_LEVEL_RETAIN;
    Logger.nb_log_to_keep = nb_log_to_keep || DEFAULT_NB_LOG_TO_KEEP;
    Logger.mode = mode || DEFAULT_MODE;

    Logger.setLevel(Logger.DEBUG);

    // Logs we keep in memory for some time. Acts like a FIFO with nb_log_to_keep elements
    Logger.logBuffer = new Array();

    Logger.setHandler(function(messages, context) {
      var console = window.console;
      var hdlr = console.log;

      if (context.name) {
        messages.logger_name = context.name;
      }
      var timestamp = Date.now()
      messages.timestamp = timestamp;
      messages.level = context.level.name;

      if (Logger.mode == Logger.DEV_MODE) {
        // Delegate through to custom warn/error loggers if present on the console.
        if (context.level === Logger.WARN && console.warn) {
          hdlr = console.warn;
        } else if (context.level === Logger.ERROR && console.error) {
          hdlr = console.error;
        } else if (context.level === Logger.INFO && console.info) {
          hdlr = console.info;
        }
        hdlr.apply(console, messages);
      }

      if (context.level.value >= Logger.level_retain.value) {
        Logger.saveLogs(messages);
      }

      if (context.level.value >= Logger.level_send.value) {
        Logger.sendLogs();
      }

    });
  };

}(window))
