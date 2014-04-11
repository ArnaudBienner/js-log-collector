/*!
 * js-log-collector - http://github.com/ArnaudBienner/js-log-collector
 * Arnaud Bienner
 * js-log-collector may be freely distributed under the MIT license.
 */

test("Logger collector", function() {
  this.logger = window.Logger;

  // Keep no more than 3 logs (with level >= info) and send them (+ clean buffer) on Logger.ERROR
  this.logger.useLogReport("http://localhost:10000", Logger.ERROR, Logger.INFO, 3, Logger.PRD_MODE);

  this.logger.warn("log message");
  strictEqual(Logger.logBuffer.length, 1, "We should have one message in our buffer");

  this.logger.debug("debug message");
  strictEqual(Logger.logBuffer.length, 1, "Should be ignored (level < info)");

  this.logger.warn("log message");
  this.logger.info("log message");
  strictEqual(Logger.logBuffer.length, 3, "We should have 3 messages in our buffer now");

  this.logger.info("log message");
  strictEqual(Logger.logBuffer.length, 3, "Buffer is full: shouldn't increase anymore");

  this.logger.error("error message");
  strictEqual(Logger.logBuffer.length, 0, "Should send logs and empty buffer");

  this.logger.info("log message");
  strictEqual(Logger.logBuffer.length, 1, "Should start filling logBuffer again");
});
