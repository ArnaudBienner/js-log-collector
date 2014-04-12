# JavaScript log collector
================

Extends [Jonny Reeves js-logger library](https://github.com/jonnyreeves/js-logger/) by adding the ability to collect logs and to send them to a specified location when a specified level of log is reached.

Useful when you want to gather information about your Web application and get reports if it behaves wrongly.

## Installation
js-log-collector depends on js-logger. You need to include it on your page first.
You can get it directly from Github:

	<script src="https://raw.github.com/jonnyreeves/js-logger/master/src/logger.min.js"></script>

Then you should include js-log-collector:

	<script src="https://raw.githubusercontent.com/ArnaudBienner/js-log-collector/master/src/js-log-collector.js"></script>

## Usage
js-log-collector implements the js-logger's setHandler function to collect the last X messages logged.

To activate it, use

	Logger.useLogReport("https://www.myurlforlogprocessing.net");

Then, when a message of a specified log level is logged (Logger.ERROR by default), it is sent, together with the X last log messages (to allow to have some context) to a specified URL.
While js-log-collector has default values for every parameter, you can configure them when calling useLogReport; e.g.:

	Logger.useLogReport("http://localhost:10000", Logger.ERROR, Logger.INFO, 42, Logger.PRD_MODE);

will activate log collection and redirect logs to localhost:10000 when a message of level >= Logger.ERROR is received.
The Logger.INFO parameter here specifies that messages with level < Logger.INFO will be ignored (e.g. debug messages).
Last parameter (42) is the number of logs you want to keep in the buffer (i.e. the buffer size).
Finally, you can specify the mode: Logger.PRD or Logger.DEV (the default). The only difference is that in DEV mode, messages will be output to the console.log as well.

