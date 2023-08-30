using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class ServiceResult<T>
    {
        private const Object DefaultValue = null;

        public ServiceResult()
        {
        }

        public ServiceResult(T wT)
        {
            Result = wT;
        }

        /**
         * ==返回对象
         */
        public T Result;

        /**
         * ==错误代码
         */
        public String FaultCode = "";

        public int ErrorCode = 0;
         

        /**
         * ==自定义返回结果 慎用
         */
        public Dictionary<String, Object> CustomResult = new Dictionary<String, Object>();

        public T getResult()
        {
            return Result;
        }

        public T GetResult()
        {
            return Result;
        }

        public void setResult(T result)
        {
            Result = result;
        }

        public String getFaultCode()
        {
            return FaultCode;
        }

        public void setFaultCode(String faultCode)
        {
            FaultCode = faultCode;
        }

        public void put(Dictionary<String, Object> customResult)
        {
            if (customResult == null)
                return;
            foreach (String key in customResult.Keys)
            {
                if (CustomResult.ContainsKey(key))
                    CustomResult[key] = customResult[key];
                else
                    CustomResult.Add(key, customResult[key]);
            }
        }

        /**
         * 获取自定义返回数据
         * 
         * @param customKey
         * @return
         */
        public Object Get(String customKey)
        {

            if (!CustomResult.ContainsKey(customKey))
                return DefaultValue;

            return CustomResult[customKey];
        }

        /**
         * 添加自定义返回数据
         * 
         * @param customKey
         * @param customValue
         */
        public void Put(String customKey, Object customValue)
        {
            if (CustomResult.ContainsKey(customKey))
                CustomResult[customKey] = customValue;
            else
                CustomResult.Add(customKey, customValue);
        }

        public int getErrorCode()
        {
            return ErrorCode;
        }

        public void setErrorCode(int errorCode)
        {
            ErrorCode = errorCode;
        }

    }

}
