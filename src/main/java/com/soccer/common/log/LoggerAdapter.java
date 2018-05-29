/**
 * 2014-03-20 10:45
 */
package com.soccer.common.log;

/**
 * @author pfma 自定义的日志接口，用来对接其他的日志框架
 */
public interface LoggerAdapter {
	public void info(String msg);

	public void info(Throwable ex);

	public void info(String msg, Throwable ex);

	public void debug(String msg, Throwable ex);

	public void debug(String msg);

	public void debug(Throwable ex);

	public void error(String msg, Throwable ex);

	public void error(String msg);

	public void error(Throwable ex);

	public void warn(String msg);

	public void warn(Throwable ex);

	public void warn(String msg, Throwable ex);

}
