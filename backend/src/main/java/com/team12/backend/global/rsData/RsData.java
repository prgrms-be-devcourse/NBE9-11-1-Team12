//package com.team12.backend.global.rsData;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//
//public record RsData<T>(
//        String resultCode,
//        String msg,
//        T data
//) {
//
//    public RsData(String resultCode, String msg){
//        this(resultCode, msg, null);
//    }
//
//    @JsonIgnore
//    public int getStatusCode() {
//        return Integer.parseInt(resultCode.split("-")[0]);
//    }
//}
