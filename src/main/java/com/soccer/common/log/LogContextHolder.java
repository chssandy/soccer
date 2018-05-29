package com.soccer.common.log;

public class LogContextHolder
{
   public static final  ThreadLocal<Integer> contextHolder  = new ThreadLocal<Integer>();
   
   public static int getLogID(){
      return  contextHolder.get();
   }
   
   public static void setLogID(int logID){
       contextHolder.set(logID);
   }
    
}
