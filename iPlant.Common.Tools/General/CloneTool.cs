using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.Common.Tools
{
    public class CloneTool
    {
        public static T Clone<T>(T wObject)
        {

            string wJson = JsonTool.ObjectToJson<T>(wObject);

            return JsonTool.JsonToObject<T>(wJson);
        }

        public static T Clone<T>(Object wObject)
        {

            string wJson = JsonTool.ObjectToJson(wObject);
            return JsonTool.JsonToObject<T>(wJson);
        }

        public static List<T> CloneArray<T>(Object wObject)
        {


            string wJson = JsonTool.ObjectToJson(wObject);
            return JsonTool.JsonToObject<List<T>>(wJson);
        }

        public static Object Clone(Object wObject, Type type)
        { 
            string wJson = JsonTool.ObjectToJson(wObject, type);
            return JsonTool.JsonToObject(wJson, type); 
        }


        public static T2 Clone<T1, T2>(T1 wObject)
        {
             
            string wJson = JsonTool.ObjectToJson(wObject);
            return JsonTool.JsonToObject<T2>(wJson); 
        }

        public static T CloneService<T>(T wObject)
        {
            return CloneService<T>((object)wObject);
        }

        public static T CloneService<T>(Object wObject)
        {
            T wT = default;
            try
            {
                if (wObject is IDictionary)
                {
                    Dictionary<String, Object> wList = Clone<Dictionary<String, Object>>(wObject);
                    if (wList != null)
                    {
                        RemoveExtensionData(wList);
                        wT = Clone<T>(wList);
                    }
                }
                else if (wObject is ICollection)
                {
                    List<Dictionary<String, Object>> wList = Clone<List<Dictionary<String, Object>>>(wObject);

                    if (wList != null)
                    {
                        foreach (Dictionary<String, Object> item in wList)
                        {
                            RemoveExtensionData(item);
                        }
                        wT = Clone<T>(wList);
                    }
                }
                else
                {
                    Dictionary<String, Object> wItem = Clone<Dictionary<String, Object>>(wObject);

                    if (wItem != null)
                    {
                        RemoveExtensionData(wItem);

                        wT = Clone<T>(wItem);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("CloneTool CloneService error:" + ex.Message);
            }
            return wT;
        }

        private static void RemoveExtensionData(Dictionary<String, Object> wInput)
        {
            if (wInput.ContainsKey("ExtensionData"))
                wInput.Remove("ExtensionData");

            foreach (String wKey in wInput.Keys)
            {
                if (wInput[wKey] == null)
                    continue;
                if (wInput[wKey] is Dictionary<String, Object>)
                {
                    RemoveExtensionData((Dictionary<String, Object>)wInput[wKey]);
                    continue;
                }

                if (wInput[wKey] is List<Dictionary<String, Object>>)
                {
                    foreach (Dictionary<String, Object> item in (List<Dictionary<String, Object>>)wInput[wKey])
                    {
                        RemoveExtensionData(item);
                    }
                    continue;
                }
                if (wInput[wKey] is Dictionary<String, Object>[])
                {
                    foreach (Dictionary<String, Object> item in (Dictionary<String, Object>[])wInput[wKey])
                    {
                        RemoveExtensionData(item);
                    }
                    continue;
                }
                if (wInput[wKey] is ArrayList)
                {
                    //
                    foreach (var item in (ArrayList)wInput[wKey])
                    {
                        if (item is Dictionary<String, Object>)
                            RemoveExtensionData((Dictionary<String, Object>)item);
                    }
                    continue;
                }

                if (wInput[wKey] is Array)
                {
                    //
                    foreach (var item in (Array)wInput[wKey])
                    {
                        if (item is Dictionary<String, Object>)
                            RemoveExtensionData((Dictionary<String, Object>)item);
                    }
                    continue;
                }

            }

        }
    }
}
