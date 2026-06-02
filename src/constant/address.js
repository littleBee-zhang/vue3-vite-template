/** 判断当前环境，并设置地址 **/ 
const isProd = import.meta.env.PROD;
export const baseURL = !isProd 
  ? "http://10.1.32.123:8080/jeecg-boot" 
  : "http://120.26.36.53:8080/jeecg-boot";

/** 直接读取 .env 中的 VITE_BASE_URL **/ 
export const BASE_URL = import.meta.env.VITE_BASE_URL;
