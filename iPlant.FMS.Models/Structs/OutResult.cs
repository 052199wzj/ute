using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class OutResult<T>
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OutResult<T>));
        public OutResult()
        {
            // TODO Auto-generated constructor stub
        }

        public OutResult(T wT)
        {
            Result = wT;
        }

        public T Result;

        public T get()
        {
            return Result;
        }

        private Dictionary<String, Object> CustomResult = new Dictionary<String, Object>();

        public Object get(String wKey)
        {
            if (!CustomResult.ContainsKey(wKey))
                return new Object();
            return CustomResult[wKey];
        }

      public  T1 get<T1>(String wKey)
        {
            T1 wResult = default(T1);
            try
            {
                if (CustomResult.ContainsKey(wKey))
                {
                    wResult = (T1)CustomResult[wKey];
                }

                if (wResult == null)
                {
                    wResult = default(T1);
                }
            }
            catch (Exception e)
            {
                logger.Error("get", e);
            }
             
            return wResult;

        }

        public void put(Dictionary<String, Object> customResult)
        {
            if (customResult == null)
                return;
            foreach (String key in customResult.Keys)
            {
                CustomResult.Add(key, customResult[key]);
            }
        }

        public void set(T wResult)
        {

            Result = wResult;
        }

        public void put(String key, Object value)
        {
            if (CustomResult.ContainsKey(key))
                CustomResult[key] = value;
            else
                CustomResult.Add(key, value);
        }

        public void Add(String key, Object value)
        {
            if (CustomResult.ContainsKey(key))
                CustomResult[key] = value;
            else
                CustomResult.Add(key, value);
        }

        public void clear()
        {
            CustomResult.Clear();
            CustomResult = new Dictionary<String, Object>();
        }
    }
}
