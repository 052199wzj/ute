using Opc.Ua;
using Opc.Ua.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static ShrisCommunicationCore.Focas1;

namespace ShrisCommunicationCore
{


    public class SimpleFanucClient : ServerClient
    {

        static SimpleFanucClient()
        {
            Fanuc.SetDllDirectory(AppDomain.CurrentDomain.BaseDirectory);
        }


        #region private properties



        private ushort ServerClientID = 0;


        private FanucServerDescription BaseServerDescription
        {
            get
            {
                if (_serverDescription != null && _serverDescription is FanucServerDescription)
                {
                    return (FanucServerDescription)_serverDescription;

                }
                return new FanucServerDescription();

            }
        }


        public String NCProgramName
        {
            get
            {
                return String.Concat(obexe.name);
            }
        }
        public int NCProgramNo
        {
            get
            {
                return obexe.o_num;
            }
        }
        /// <summary>
        /// 程序
        /// </summary>
        private Fanuc.ODBEXEPRG obexe = new ODBEXEPRG();

        /// <summary>
        /// 设备状态
        /// </summary>
        private Fanuc.ODBST obst = new Focas1.ODBST();



        /// <summary>
        /// 报警信息
        /// </summary>
        private Fanuc.ODBALMMSG2 msg = new Focas1.ODBALMMSG2();


        /// <summary>
        /// 轴位置数据
        /// </summary>
        private Fanuc.ODBPOS fos = new Focas1.ODBPOS();

        /// <summary>
        /// 主轴加载值
        /// </summary>
        private Fanuc.ODBSPLOAD sp = new Focas1.ODBSPLOAD();

        /// <summary>
        /// 进给轴加载值
        /// </summary>
        private Fanuc.ODBSVLOAD sv = new Focas1.ODBSVLOAD();

        //进给轴速度
        private Focas1.ODBACT obact = new Focas1.ODBACT();



        #endregion private properties



        #region Constructors

        /// <summary>
        /// FanucServerDescription.Configured=true 时，按照配置文件创建客户端，用户名及安全策略由FanucServerDescription指定
        /// FanucServerDescription.Configured=false 时，创建默认匿名，不安全连接，忽视其他参数
        /// </summary>
        /// <param name="serverDescription">OPC服务器配置</param>
        public SimpleFanucClient(FanucServerDescription serverDescription) : base(serverDescription)
        {

        }

        #endregion Constructors



        #region connect/disconnect

        /// <summary>
        /// connect to server
        /// </summary>
        /// <returns></returns>
        public override async Task Connect()
        {
            await ConnectServer(BaseServerDescription.ServerUrl,
                (ushort)BaseServerDescription.ServerPort, BaseServerDescription.TimeOutSecond);
        }


        /// <summary>
        /// Creates a new session.
        /// </summary>
        /// <returns>The new session object.</returns>
        private Task ConnectServer(string wIP, ushort wPort, int wTimeOut)
        {
            // disconnect from existing session.
            Disconnect();


            int ret = Fanuc.cnc_allclibhndl3(wIP, wPort, wTimeOut, out ServerClientID);
            if (ret == Fanuc.EW_OK)
            {

                DoConnectComplete(null);
                UpdateStatus(true, DateTime.Now, "Connected");

            }
            else
            {

            }

            return Task.CompletedTask;
        }

        /// <summary>
        /// Report the client status
        /// </summary>
        /// <param name="isNormal">Whether the status represents an error.</param>
        /// <param name="time">The time associated with the status.</param>
        /// <param name="status">The status message.</param>
        /// <param name="args">Arguments used to format the status message.</param>
        private void UpdateStatus(bool isConnected, DateTime time, string status, params object[] args)
        {
            IsConnected = isConnected;
            m_StatusChange?.Invoke(this, new ServerStatusEventArgs(isConnected, time, status, args));

        }

        /// <summary>
        /// Raises the connect complete event on the main GUI thread.
        /// </summary>


        /// <summary>
        /// Disconnects from the server. is all clean
        /// </summary>
        public override void Disconnect()
        {


            // stop any reconnect operation.
            if (ThreadRunState && RunThread != null)
            {
                ThreadRunState = false;
            }

            IsConnected = false;
            // disconnect any existing session.
            if (ServerClientID > 0)
            {
                //所有订阅移除
                RemoveAllSubscription();
                Fanuc.cnc_resetconnect(ServerClientID);
                Fanuc.cnc_freelibhndl(ServerClientID);

                ServerClientID = 0;
            }


            // update the client status
            IsConnected = false;

            // raise an event.
            DoDisConnectComplete(null);
            UpdateStatus(false, DateTime.UtcNow, "Disconnected");
        }

        /// <summary>
        /// Raises the connect complete event on the main GUI thread.
        /// </summary>
        private void DoDisConnectComplete(object state)
        {
            m_DisConnectComplete?.Invoke(this, null);
        }

        #endregion

        #region keep alive handler

        /// <summary>
        /// 获取连接状态
        /// </summary>
        /// <param name="wClient"></param>
        /// <returns></returns>
        private int ClientStatus(int wClient)
        {

            return 0;
        }





        /// <summary>
        /// 重连
        /// </summary>
        /// <param name="State"></param>
        protected override void RunStart()
        {
            if (ReconnectPeriod < 3000)
                ReconnectPeriod = 3000;

            while (ThreadRunState)
            {

                Thread.Sleep(ReconnectPeriod);

                if (!IsConnected)
                {
                    if (ServerClientID > 0)
                    {
                        //所有订阅移除
                        RemoveAllSubscription();
                        ///Fanuc.cnc_resetconnect(ServerClientID);
                        Fanuc.cnc_freelibhndl(ServerClientID);

                        ServerClientID = 0;
                    }

                    ushort wServerClientID = 0;
                    int ret =
                        Fanuc.cnc_allclibhndl3(BaseServerDescription.ServerUrl,
                        (ushort)BaseServerDescription.ServerPort, BaseServerDescription.TimeOutSecond, out wServerClientID);
                    if (ret == Fanuc.EW_OK)
                    {
                        IsConnected = true;
                        ServerClientID = wServerClientID;
                        Server_ReconnectComplete();
                        UpdateStatus(true, DateTime.Now, "Connected");

                    }
                }
                this.SubscriptionsCall();
            }
        }

        /// <summary>
        /// 监控是否断开链接，并开启重连机制  
        ///    任何调用都需要执行此函数 作为回调 
        /// </summary>
        /// <param name="ret"></param>
        private void Client_KeepAlive(int ret)
        {
            try
            {

                // start reconnect sequence on communication error.
                if (ret == ((short)Focas1.focas_ret.EW_PROTOCOL) || ret == ((short)Focas1.focas_ret.EW_SOCKET)
                    || ret == ((short)Focas1.focas_ret.EW_HANDLE) || ret == ((short)Focas1.focas_ret.EW_RESET))
                {
                    UpdateStatus(false, DateTime.Now, "Communication Error ({0})", ret);

                    // raise any additional notifications.
                    m_KeepAliveComplete?.Invoke(this, null);
                }
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }



        /// <summary>
        /// 重连完成回调函数 
        /// </summary>
        private void Server_ReconnectComplete()
        {

            // raise any additional notifications.
            m_ReconnectComplete?.Invoke(this, null);

        }



        #endregion keep alive handler


        public void RemoveAllSubscription()
        {


        }




        private void SubscriptionsCall()
        {
            try
            {
                List<BaseMonitoredItem> wFanucMonitoredItemList1 = null;
                List<BaseMonitoredItem> wFanucMonitoredItemList2 = null;

                if (!IsConnected)
                {
                    if (read_dic_subscriptions.ContainsKey(1))
                    {
                        wFanucMonitoredItemList2 = read_dic_subscriptions[1].FindAll(p => (p.SourceAddress == null || p.SourceAddress.Length < 7));
                        if (wFanucMonitoredItemList2 != null && wFanucMonitoredItemList2.Count > 0)
                        {
                            wFanucMonitoredItemList2[0].ChangeData(0);
                        }
                    }
                    return;
                }


                foreach (var wCatalog in CatalogList)
                {

                    if (!read_dic_subscriptions.ContainsKey(wCatalog)
                    || read_dic_subscriptions[wCatalog] == null
                    || read_dic_subscriptions[wCatalog].Count <= 0)
                        return;


                    wFanucMonitoredItemList1 = read_dic_subscriptions[wCatalog].FindAll(p => (p.SourceAddress != null && p.SourceAddress.Length >= 7));

                    wFanucMonitoredItemList2 = read_dic_subscriptions[wCatalog].FindAll(p => (p.SourceAddress == null || p.SourceAddress.Length < 7));

                    switch (wCatalog)
                    {
                        case 1: //状态 
                            if (wFanucMonitoredItemList2.Count > 0)
                            {
                                wFanucMonitoredItemList2[0].ChangeData(this.GetDeviceStatus());
                            }
                            break;
                        case 2://实时报警
                            if (wFanucMonitoredItemList2.Count > 0)
                            {
                                wFanucMonitoredItemList2[0].ChangeData(this.GetAlarmMsg());
                            }
                            break;
                        case 3://实时参数
                            if (wFanucMonitoredItemList2.Count > 0)
                            {
                                wFanucMonitoredItemList2[0].ChangeData(this.GetParams());
                            }
                            break;
                        case 8://工艺参数 NC 
                        case 4://作业参数 
                        case 5://能源参数 
                        case 6://质量参数 
                        case 7://控制参数 
                        case 9://位置参数
                            foreach (var item in wFanucMonitoredItemList1)
                            {
                                item.RealValueSet(this.ReadNode(item.SourceAddress));
                            }
                            break;
                        default:
                            break;
                    }

                }
            }
            catch (Exception ex)
            {
                Utils.Trace("SubscriptionsCall Fanuc Error:{0} ", ex.Message);
                Console.WriteLine(ex.ToString());
            }
        }


        /// <summary>
        /// 设备状态获取
        /// </summary>
        /// <returns></returns>
        public int GetDeviceStatus()
        {
            int wStatus = 0;
            if (!IsConnected)
            {
                return wStatus;
            }

            int ret = Fanuc.cnc_statinfo(ServerClientID, obst);


            if (ret != Fanuc.EW_OK)
            {
                Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_statinfo", ServerClientID, ret));
                this.Client_KeepAlive(ret);
                return wStatus;
            }


            wStatus = wStatus | ((int)StatusEnum.TurnOn);

            if (obst.run == 1)
            {
                wStatus = wStatus | ((int)StatusEnum.Wait);
            }
            else if (obst.run > 0)
            {
                wStatus = wStatus | ((int)StatusEnum.Run);
            }
            else
            {
                wStatus = wStatus | ((int)StatusEnum.Stop);
            }

            if (obst.aut > 0)
            {
                wStatus = wStatus | ((int)StatusEnum.Auto);
            }
            else
            {
                wStatus = wStatus | ((int)StatusEnum.Manual);
            }

            if (obst.alarm > 0)
            {
                wStatus = wStatus | ((int)StatusEnum.Run);
            }

            if (obst.emergency > 0)
            {
                wStatus = wStatus | ((int)StatusEnum.NCStop);
            }

            return wStatus;
        }


        /// <summary>
        /// 设备报警消息列表10条
        /// </summary>
        /// <returns></returns>
        public Dictionary<String, String> GetAlarmMsg()
        {

            Dictionary<String, String> wAlarmMsg = new Dictionary<string, string>();
            if (!IsConnected)
            {
                return wAlarmMsg;
            }
            short b = 10;

            short ret = Fanuc.cnc_rdalmmsg2(ServerClientID, -1, ref b, msg);
            if (ret != Fanuc.EW_OK)
            {

                Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_rdalmmsg2", ServerClientID, ret));
                this.Client_KeepAlive(ret);
                return wAlarmMsg;
            }

            if (b > 0) wAlarmMsg.Add(msg.msg1.alm_no.ToString(), msg.msg1.alm_msg);
            if (b > 1) wAlarmMsg.Add(msg.msg2.alm_no.ToString(), msg.msg2.alm_msg);
            if (b > 2) wAlarmMsg.Add(msg.msg3.alm_no.ToString(), msg.msg3.alm_msg);
            if (b > 3) wAlarmMsg.Add(msg.msg4.alm_no.ToString(), msg.msg4.alm_msg);
            if (b > 4) wAlarmMsg.Add(msg.msg5.alm_no.ToString(), msg.msg5.alm_msg);
            if (b > 5) wAlarmMsg.Add(msg.msg6.alm_no.ToString(), msg.msg6.alm_msg);
            if (b > 6) wAlarmMsg.Add(msg.msg7.alm_no.ToString(), msg.msg7.alm_msg);
            if (b > 7) wAlarmMsg.Add(msg.msg8.alm_no.ToString(), msg.msg8.alm_msg);
            if (b > 8) wAlarmMsg.Add(msg.msg9.alm_no.ToString(), msg.msg9.alm_msg);
            if (b > 9) wAlarmMsg.Add(msg.msg10.alm_no.ToString(), msg.msg10.alm_msg);

            return wAlarmMsg;
        }

        /// <summary>
        /// 主轴参数位置信息
        /// </summary>
        public Dictionary<String, String> GetParams()
        {
            Dictionary<String, String> wParamsResult = new Dictionary<string, String>();

            if (!IsConnected)
            {
                return wParamsResult;
            }
            short ret = Fanuc.EW_OK;

            ret = Fanuc.cnc_exeprgname(ServerClientID, obexe);
            if (ret != Fanuc.EW_OK)
            {

                Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_rdalmmsg2", ServerClientID, ret));
                this.Client_KeepAlive(ret);
                return wParamsResult;
            }


            short num = Fanuc.MAX_AXIS;
            short type = -1;
            //主轴位置  

            ret = Fanuc.cnc_rdposition(ServerClientID, type, ref num, fos);
            if (ret != Fanuc.EW_OK)
            {
                Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_rdalmmsg2", ServerClientID, ret));
                this.Client_KeepAlive(ret);
                return wParamsResult;
            }


            if (num > 0)
            {
                wParamsResult.Add("AbsolutePosition" + fos.p1.abs.name.ToString(), (fos.p1.abs.data * Math.Pow(10, -fos.p1.abs.dec)).ToString());
                wParamsResult.Add("RelativePosition" + fos.p1.rel.name.ToString(), (fos.p1.rel.data * Math.Pow(10, -fos.p1.rel.dec)).ToString());
                wParamsResult.Add("MachinePosition" + fos.p1.mach.name.ToString(), (fos.p1.mach.data * Math.Pow(10, -fos.p1.mach.dec)).ToString());
                wParamsResult.Add("DistancePosition" + fos.p1.dist.name.ToString(), (fos.p1.dist.data * Math.Pow(10, -fos.p1.dist.dec)).ToString());
            }
            if (num > 1)
            {
                wParamsResult.Add("AbsolutePosition" + fos.p2.abs.name.ToString(), (fos.p2.abs.data * Math.Pow(10, -fos.p2.abs.dec)).ToString());
                wParamsResult.Add("RelativePosition" + fos.p2.rel.name.ToString(), (fos.p2.rel.data * Math.Pow(10, -fos.p2.rel.dec)).ToString());
                wParamsResult.Add("MachinePosition" + fos.p2.mach.name.ToString(), (fos.p2.mach.data * Math.Pow(10, -fos.p2.mach.dec)).ToString());
                wParamsResult.Add("DistancePosition" + fos.p2.dist.name.ToString(), (fos.p2.dist.data * Math.Pow(10, -fos.p2.dist.dec)).ToString());
            }
            if (num > 2)
            {
                wParamsResult.Add("AbsolutePosition" + fos.p3.abs.name.ToString(), (fos.p3.abs.data * Math.Pow(10, -fos.p3.abs.dec)).ToString());
                wParamsResult.Add("RelativePosition" + fos.p3.rel.name.ToString(), (fos.p3.rel.data * Math.Pow(10, -fos.p3.rel.dec)).ToString());
                wParamsResult.Add("MachinePosition" + fos.p3.mach.name.ToString(), (fos.p3.mach.data * Math.Pow(10, -fos.p3.mach.dec)).ToString());
                wParamsResult.Add("DistancePosition" + fos.p3.dist.name.ToString(), (fos.p3.dist.data * Math.Pow(10, -fos.p3.dist.dec)).ToString());
            }
            if (num > 3)
            {
                wParamsResult.Add("AbsolutePosition" + fos.p4.abs.name.ToString(), (fos.p4.abs.data * Math.Pow(10, -fos.p4.abs.dec)).ToString());
                wParamsResult.Add("RelativePosition" + fos.p4.rel.name.ToString(), (fos.p4.rel.data * Math.Pow(10, -fos.p4.rel.dec)).ToString());
                wParamsResult.Add("MachinePosition" + fos.p4.mach.name.ToString(), (fos.p4.mach.data * Math.Pow(10, -fos.p4.mach.dec)).ToString());
                wParamsResult.Add("DistancePosition" + fos.p4.dist.name.ToString(), (fos.p4.dist.data * Math.Pow(10, -fos.p4.dist.dec)).ToString());
            }
            if (num > 4)
            {
                wParamsResult.Add("AbsolutePosition" + fos.p5.abs.name.ToString(), (fos.p5.abs.data * Math.Pow(10, -fos.p5.abs.dec)).ToString());
                wParamsResult.Add("RelativePosition" + fos.p5.rel.name.ToString(), (fos.p5.rel.data * Math.Pow(10, -fos.p5.rel.dec)).ToString());
                wParamsResult.Add("MachinePosition" + fos.p5.mach.name.ToString(), (fos.p5.mach.data * Math.Pow(10, -fos.p5.mach.dec)).ToString());
                wParamsResult.Add("DistancePosition" + fos.p5.dist.name.ToString(), (fos.p5.dist.data * Math.Pow(10, -fos.p5.dist.dec)).ToString());
            }
            if (num > 5)
            {
                wParamsResult.Add("AbsolutePosition" + fos.p6.abs.name.ToString(), (fos.p6.abs.data * Math.Pow(10, -fos.p6.abs.dec)).ToString());
                wParamsResult.Add("RelativePosition" + fos.p6.rel.name.ToString(), (fos.p6.rel.data * Math.Pow(10, -fos.p6.rel.dec)).ToString());
                wParamsResult.Add("MachinePosition" + fos.p6.mach.name.ToString(), (fos.p6.mach.data * Math.Pow(10, -fos.p6.mach.dec)).ToString());
                wParamsResult.Add("DistancePosition" + fos.p6.dist.name.ToString(), (fos.p6.dist.data * Math.Pow(10, -fos.p6.dist.dec)).ToString());
            }
            if (num > 6)
            {
                wParamsResult.Add("AbsolutePosition" + fos.p7.abs.name.ToString(), (fos.p7.abs.data * Math.Pow(10, -fos.p7.abs.dec)).ToString());
                wParamsResult.Add("RelativePosition" + fos.p7.abs.name.ToString(), (fos.p7.rel.data * Math.Pow(10, -fos.p7.rel.dec)).ToString());
                wParamsResult.Add("MachinePosition" + fos.p7.mach.name.ToString(), (fos.p7.mach.data * Math.Pow(10, -fos.p7.mach.dec)).ToString());
                wParamsResult.Add("DistancePosition" + fos.p7.dist.name.ToString(), (fos.p7.dist.data * Math.Pow(10, -fos.p7.dist.dec)).ToString());
            }
            if (num > 7)
            {
                wParamsResult.Add("AbsolutePosition" + fos.p8.abs.name.ToString(), (fos.p8.abs.data * Math.Pow(10, -fos.p8.abs.dec)).ToString());
                wParamsResult.Add("RelativePosition" + fos.p8.rel.name.ToString(), (fos.p8.rel.data * Math.Pow(10, -fos.p8.rel.dec)).ToString());
                wParamsResult.Add("MachinePosition" + fos.p8.mach.name.ToString(), (fos.p8.mach.data * Math.Pow(10, -fos.p8.mach.dec)).ToString());
                wParamsResult.Add("DistancePosition" + fos.p8.dist.name.ToString(), (fos.p8.dist.data * Math.Pow(10, -fos.p8.dist.dec)).ToString());
            }

            //  0 主轴压力, 1 速度  -1全取

            num = 6;

            ret = Fanuc.cnc_rdspmeter(ServerClientID, -1, ref num, sp);

            if (ret != Fanuc.EW_OK)
            {
                Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_rdalmmsg2", ServerClientID, ret));
                this.Client_KeepAlive(ret);
                return wParamsResult;
            }


            if (num > 0)
            {
                wParamsResult.Add("SpLoad1", (sp.spload1.spload.data * Math.Pow(10, -sp.spload1.spload.dec)).ToString());
                wParamsResult.Add("SpSpeed1", (sp.spload1.spspeed.data * Math.Pow(10, -sp.spload1.spspeed.dec)).ToString());
            }
            if (num > 1)
            {
                wParamsResult.Add("SpLoad2", (sp.spload1.spload.data * Math.Pow(10, -sp.spload2.spload.dec)).ToString());
                wParamsResult.Add("SpSpeed2", (sp.spload1.spspeed.data * Math.Pow(10, -sp.spload2.spspeed.dec)).ToString());
            }
            if (num > 2)
            {
                wParamsResult.Add("SpLoad3", (sp.spload1.spload.data * Math.Pow(10, -sp.spload3.spload.dec)).ToString());
                wParamsResult.Add("SpSpeed3", (sp.spload1.spspeed.data * Math.Pow(10, -sp.spload3.spspeed.dec)).ToString());
            }
            if (num > 3)
            {
                wParamsResult.Add("SpLoad4", (sp.spload4.spload.data * Math.Pow(10, -sp.spload4.spload.dec)).ToString());
                wParamsResult.Add("SpSpeed4", (sp.spload4.spspeed.data * Math.Pow(10, -sp.spload4.spspeed.dec)).ToString());
            }





            //伺服轴的数量
            ret = Fanuc.cnc_rdsvmeter(ServerClientID, ref num, sv);

            if (ret != Fanuc.EW_OK)
            {
                Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_rdalmmsg2", ServerClientID, ret));
                this.Client_KeepAlive(ret);
                return wParamsResult;
            }



            if (num > 0)
            {
                wParamsResult.Add("SvLoad" + sv.svload1.name, (sv.svload1.data * Math.Pow(10, -sv.svload1.dec)).ToString());
            }
            if (num > 1)
            {
                wParamsResult.Add("SvLoad" + sv.svload2.name, (sv.svload2.data * Math.Pow(10, -sv.svload2.dec)).ToString());
            }
            if (num > 2)
            {
                wParamsResult.Add("SvLoad" + sv.svload3.name, (sv.svload3.data * Math.Pow(10, -sv.svload3.dec)).ToString());
            }
            if (num > 3)
            {
                wParamsResult.Add("SvLoad" + sv.svload4.name, (sv.svload4.data * Math.Pow(10, -sv.svload4.dec)).ToString());
            }
            if (num > 4)
            {
                wParamsResult.Add("SvLoad" + sv.svload5.name, (sv.svload5.data * Math.Pow(10, -sv.svload5.dec)).ToString());
            }
            if (num > 5)
            {
                wParamsResult.Add("SvLoad" + sv.svload6.name, (sv.svload6.data * Math.Pow(10, -sv.svload6.dec)).ToString());
            }
            if (num > 6)
            {
                wParamsResult.Add("SvLoad" + sv.svload7.name, (sv.svload7.data * Math.Pow(10, -sv.svload7.dec)).ToString());
            }
            if (num > 7)
            {
                wParamsResult.Add("SvLoad" + sv.svload8.name, (sv.svload8.data * Math.Pow(10, -sv.svload8.dec)).ToString());
            }

            ret = Fanuc.cnc_actf(ServerClientID, obact);

            if (ret != Fanuc.EW_OK)
            {
                Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_rdalmmsg2", ServerClientID, ret));

                this.Client_KeepAlive(ret);
                return wParamsResult;
            }


            wParamsResult.Add("SvSpeedC", obact.data.ToString());


            //ret = Fanuc.cnc_absolute(ServerClientID, -1, (short)(4 + 4 * num), obaxis);
            //if (ret != Fanuc.EW_OK)
            //{
            //    this.Client_KeepAlive(ret);
            //    return wParamsResult;
            //}

            //for (int i = 1; i <= obaxis.data.Length; i++)
            //{
            //    wParamsResult.Add("SvPosition" + i, obaxis.data[i - 1]);
            //}

            //主轴转速倍率 

            wParamsResult.Add("SpMagnification", this.ReadNode("G0030[B,1]").ToString());


            //机床门打开 


            wParamsResult.Add("MachineDoor", this.ReadNode("X0008.3[B,1]").ToString());

            //当前刀具号
            wParamsResult.Add("WorkTool", this.ReadNode("R0406[B,1]").ToString());

            //当前模式
            int[] wPMCResult = this.ReadNodeArray("R0100[B,2]");

            if (wPMCResult != null && wPMCResult.Length > 0)
            {
                wParamsResult.Add("EditMethod", ((wPMCResult[0] & 0b00000001) > 0 ? 1 : 0).ToString());
                wParamsResult.Add("AutoMethod", ((wPMCResult[0] & 0b00000010) > 0 ? 1 : 0).ToString());
                wParamsResult.Add("MDIMethod", ((wPMCResult[0] & 0b00000100) > 0 ? 1 : 0).ToString());
                wParamsResult.Add("HandMethod", ((wPMCResult[0] & 0b00001000) > 0 ? 1 : 0).ToString());
                wParamsResult.Add("X1Method", ((wPMCResult[0] & 0b00010000) > 0 ? 1 : 0).ToString());
                wParamsResult.Add("X10Method", ((wPMCResult[0] & 0b00100000) > 0 ? 1 : 0).ToString());
                wParamsResult.Add("X100Method", ((wPMCResult[0] & 0b01000000) > 0 ? 1 : 0).ToString());
                wParamsResult.Add("JOGMethod", ((wPMCResult[0] & 0b10000000) > 0 ? 1 : 0).ToString());
            }
            if (wPMCResult != null && wPMCResult.Length > 1)
            {
                wParamsResult.Add("HomeMethod", ((wPMCResult[1] & 0b00000001) > 0 ? 1 : 0).ToString());
                wParamsResult.Add("HomeToolMethod", ((wPMCResult[1] & 0b00000010) > 0 ? 1 : 0).ToString());
            }

            return wParamsResult;
        }


        public List<Fanuc.ODBTG> GetToolLife(out List<String> wError,short wGroupNum = 1, short wEnd = 12)//读取获得刀片的有关信息
        {
            List<Fanuc.ODBTG> wResult = new List<ODBTG>();
            wError = new List<string>();

            ushort wServerClientID = 0;
            short ret =
                Fanuc.cnc_allclibhndl3(BaseServerDescription.ServerUrl,
                (ushort)BaseServerDescription.ServerPort, BaseServerDescription.TimeOutSecond, out wServerClientID);

            if (ret != Fanuc.EW_OK)
            {
                wError.Add(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_allclibhndl3", wServerClientID, ret));
                return wResult; 
            } 

            Fanuc.ODBTLIFE2 tool1 = new Focas1.ODBTLIFE2();
             ret = Fanuc.cnc_rdngrp(wServerClientID, tool1);//刀片组的全部数量
            if (ret != Fanuc.EW_OK)
            {
                wError.Add(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_rdngrp", wServerClientID, ret));
                return wResult;
            }
           
            Fanuc.ODBTG btg;
            for (short i = 1; i <= tool1.data; i++)
            {
                btg = new Focas1.ODBTG();
                ret = Fanuc.cnc_rdtoolgrp(wServerClientID, i, (short)(20 + 20 * wEnd), btg);//根据刀组号读出所有信息，很重要； 
                if (ret != Fanuc.EW_OK)
                {
                    wError.Add(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "cnc_rdtoolgrp", wServerClientID, ret)); 
                    continue;
                }

                wResult.Add(btg);
            }

            Fanuc.cnc_freelibhndl(wServerClientID); 

            return wResult;
        }


        #region Read & Write Macro

        public Object ReadNodesMacro(String wAddress)
        {

            Object wResult = new object();

            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return wResult;

            Fanuc.ODBM wODBM = new Focas1.ODBM();

            int ret = Fanuc.cnc_rdmacro(ServerClientID, (short)wFanucAddress.start, (short)wFanucAddress.end, wODBM);
            if (ret != Fanuc.EW_OK)
            {
                this.Client_KeepAlive(ret);
                return wResult;
            }
            //需要确定值怎么计算
            //wResult = (wODBM.mcr_val + 0.0) / Math.Pow(10, wODBM.dec_val);
            if (wODBM.mcr_val.ToString().Length - wODBM.dec_val < 0)
            {
                wODBM.dec_val = ((short)wODBM.mcr_val.ToString().Length);
            }
            try
            {
                wResult = Double.Parse((0 + wODBM.mcr_val.ToString()).Insert(1 + (wODBM.mcr_val.ToString().Length - wODBM.dec_val), "."));
            }
            catch (Exception)
            {
                wResult = (0 + wODBM.mcr_val.ToString()).Insert(1 + (wODBM.mcr_val.ToString().Length - wODBM.dec_val), ".");
            }
            return wResult;

        }


        public bool WriteNodeMacro(String wAddress, string value)
        {
            //将wAddress 分解 前缀+起始地址+|结束地址 []

            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return false;

            if (value == null)
            {
                return false;
            }
            int wValueInt = 0;
            double wValueDouble = 0;

            ushort wServerClientID = 0;
            short ret =
                Fanuc.cnc_allclibhndl3(BaseServerDescription.ServerUrl,
                (ushort)BaseServerDescription.ServerPort, BaseServerDescription.TimeOutSecond, out wServerClientID);
            if (value.Equals("true", StringComparison.CurrentCultureIgnoreCase) || value.Equals("false", StringComparison.CurrentCultureIgnoreCase))
            {
                ret = Fanuc.cnc_wrmacro(wServerClientID, (short)wFanucAddress.start, (short)wFanucAddress.end, (value.Equals("true", StringComparison.CurrentCultureIgnoreCase) ? 1 : 0) * 1000, 3);
            }
            else if (Int32.TryParse(value, out wValueInt))
            {
                ret = Fanuc.cnc_wrmacro(wServerClientID, (short)wFanucAddress.start, (short)wFanucAddress.end, wValueInt * 1000, 3);
            }
            else if (Double.TryParse(value, out wValueDouble))
            {
                ret = Fanuc.cnc_wrmacro(wServerClientID, (short)wFanucAddress.start, (short)wFanucAddress.end, ((int)(wValueDouble * 1000)), 3);
            }
            else
            {
                ret = 1;
            }
            Fanuc.cnc_freelibhndl(wServerClientID);


            return ret == Fanuc.EW_OK;
        }


        public bool WriteNodeMacro<T>(String wAddress, T value)
        {
            //将wAddress 分解 前缀+起始地址+|结束地址 []

            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return false;

            if (value == null)
            {
                return false;
            }
            ushort wServerClientID = 0;
            short ret =
                Fanuc.cnc_allclibhndl3(BaseServerDescription.ServerUrl,
                (ushort)BaseServerDescription.ServerPort, BaseServerDescription.TimeOutSecond, out wServerClientID);



            if (value is bool)
            {
                ret = Fanuc.cnc_wrmacro(wServerClientID, (short)wFanucAddress.start, (short)wFanucAddress.end, (Convert.ToBoolean(value) ? 1 : 0) * 1000, 3);
            }
            else if (value is int)
            {
                ret = Fanuc.cnc_wrmacro(wServerClientID, (short)wFanucAddress.start, (short)wFanucAddress.end, Convert.ToInt32(value) * 1000, 3);
            }
            else if (value is byte)
            {
                ret = Fanuc.cnc_wrmacro(wServerClientID, (short)wFanucAddress.start, (short)wFanucAddress.end, Convert.ToByte(value) * 1000, 3);
            }
            else if (value is float)
            {
                ret = Fanuc.cnc_wrmacro(wServerClientID, (short)wFanucAddress.start, (short)wFanucAddress.end, ((int)(Convert.ToSingle(value) * 1000)), 3);
            }
            else if (value is double)
            {
                ret = Fanuc.cnc_wrmacro(wServerClientID, (short)wFanucAddress.start, (short)wFanucAddress.end, ((int)(Convert.ToDouble(value) * 1000)), 3);
            }
            else
            {
                ret = 1;
            }
            Fanuc.cnc_freelibhndl(wServerClientID);


            return ret == Fanuc.EW_OK;
        }


        #endregion

        #region Read & Write  pmc
        /// <summary>
        ///  //G0005[D,10]  {1位地址码}{4位起始地址}[{数据类型},{长度}]
        /// </summary>
        /// <param name="wAddress"></param>
        /// <returns></returns>
        public int[] ReadNodes(String wAddress, ushort wServerClientID)
        {

            int[] wResult = new int[1];
            //if (!IsConnected)
            //    return wResult;


            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return wResult;

            int ret = 0;


            switch (wFanucAddress.type)
            {
                case ((int)FanucAddressTypes.Byte):

                    Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();

                    ret = Fanuc.pmc_rdpmcrng(wServerClientID, wFanucAddress.kind,
               wFanucAddress.type, wFanucAddress.start, wFanucAddress.end, wFanucAddress.length, iodbpmc0);
                    if (ret == Fanuc.EW_OK)
                    {

                        wResult = iodbpmc0.cdata.FanucDataSetResult();
                    }

                    break;
                case ((int)FanucAddressTypes.Word):

                    Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();

                    ret = Fanuc.pmc_rdpmcrng(wServerClientID, wFanucAddress.kind,
               wFanucAddress.type, wFanucAddress.start, wFanucAddress.end, wFanucAddress.length, iodbpmc1);
                    if (ret == Fanuc.EW_OK)
                    {

                        wResult = iodbpmc1.idata.FanucDataSetResult();
                    }

                    break;

                case ((int)FanucAddressTypes.Dword):

                    Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();

                    ret = Fanuc.pmc_rdpmcrng(wServerClientID, wFanucAddress.kind,
               wFanucAddress.type, wFanucAddress.start, wFanucAddress.end, wFanucAddress.length, iodbpmc2);

                    if (ret == Fanuc.EW_OK)
                    {
                        wResult = iodbpmc2.ldata;
                    }

                    break;
                default:
                    return wResult;
            }


            if (ret != Fanuc.EW_OK)
            {
                Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "pmc_rdpmcrng", wServerClientID, ret));
                wResult[0] = ret;
            }

            if (wResult != null && wResult.Length > 0 && wFanucAddress.Index >= 0 && wFanucAddress.Index < 8 && wFanucAddress.type == (int)FanucAddressTypes.Byte)
            {
                wResult[0] = (wResult[0] & (1 << wFanucAddress.Index)) > 0 ? 1 : 0;
            }
            return wResult;
        }


        private int[] ReadNodeArray(String wAddress)
        {
            int[] wResult = this.ReadNodes(wAddress, ServerClientID);

            if (wResult.Length == 1 && wResult[0] != Fanuc.EW_OK)
            {
                Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "pmc_rdpmcrng", ServerClientID, wResult[0]));
                this.Client_KeepAlive(wResult[0]);
                wResult = new int[0];
            }
            return wResult;
        }

        private int ReadNode(String wAddress)
        {
            int[] wResultArray = this.ReadNodeArray(wAddress);

            if (wResultArray == null || wResultArray.Length <= 0)
                return 0;
            return wResultArray[0];
        }

        public int ReadNodeInt(String wAddress)
        {
            ushort wServerClientID = 0;
            short ret =
                Fanuc.cnc_allclibhndl3(BaseServerDescription.ServerUrl,
                (ushort)BaseServerDescription.ServerPort, BaseServerDescription.TimeOutSecond, out wServerClientID);

            int[] wResultArray = this.ReadNodes(wAddress, wServerClientID);
            if (wResultArray.Length == 1 && wResultArray[0] != Fanuc.EW_OK)
            {
                wResultArray = new int[0];
            }

            Fanuc.cnc_freelibhndl(wServerClientID);
            if (wResultArray == null || wResultArray.Length <= 0)
                return 0;
            return wResultArray[0];
        }

        ///// <summary>
        ///// 默认采用ASCII  
        ///// </summary>
        ///// <param name="wAddress"></param>
        ///// <returns></returns>
        //public String ReadNodeString(String wAddress)
        //{

        //    String wResult = "";

        //    FanucAddress wFanucAddress = wAddress.FanucAddressObject();

        //    if (wFanucAddress == null)
        //        return wResult;




        //    List<byte> wBytes = new List<byte>();
        //    int ret = 0;
        //    lock (mLockHandle)
        //    {

        //        switch (wFanucAddress.type)
        //        {
        //            case ((int)FanucAddressTypes.Byte):

        //                Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();

        //                ret = Fanuc.pmc_rdpmcrng(ServerClientID, wFanucAddress.kind,
        //           wFanucAddress.type, wFanucAddress.start, wFanucAddress.end, wFanucAddress.length, iodbpmc0);
        //                if (ret == Fanuc.EW_OK)
        //                {
        //                    if (iodbpmc0.cdata != null && iodbpmc0.cdata.Length > 0)
        //                    {

        //                        wBytes = iodbpmc0.cdata.ToList();

        //                    }
        //                }

        //                break;
        //            case ((int)FanucAddressTypes.Word):

        //                Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();

        //                ret = Fanuc.pmc_rdpmcrng(ServerClientID, wFanucAddress.kind,
        //                    wFanucAddress.type, wFanucAddress.start, wFanucAddress.end, wFanucAddress.length, iodbpmc1);
        //                if (ret == Fanuc.EW_OK)
        //                {

        //                    if (iodbpmc1.idata != null && iodbpmc1.idata.Length > 0)
        //                    {

        //                        foreach (var item in iodbpmc1.idata)
        //                        {
        //                            wBytes.AddRange(BitConverter.GetBytes(item));

        //                        }
        //                    }

        //                }

        //                break;

        //            case ((int)FanucAddressTypes.Dword):

        //                Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();

        //                ret = Fanuc.pmc_rdpmcrng(ServerClientID, wFanucAddress.kind,
        //           wFanucAddress.type, wFanucAddress.start, wFanucAddress.end, wFanucAddress.length, iodbpmc2);

        //                if (ret == Fanuc.EW_OK)
        //                {

        //                    if (iodbpmc2.ldata != null && iodbpmc2.ldata.Length > 0)
        //                    {
        //                        foreach (var item in iodbpmc2.ldata)
        //                        {
        //                            wBytes.AddRange(BitConverter.GetBytes(item));

        //                        }
        //                    }

        //                }

        //                break;
        //            default:
        //                return wResult;
        //        }
        //    }

        //    if (ret != Fanuc.EW_OK)
        //    {
        //        Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "pmc_rdpmcrng", ServerClientID, ret));
        //        this.Client_KeepAlive(ret);
        //    }


        //    wResult = System.Text.Encoding.ASCII.GetString(wBytes.ToArray());

        //    return wResult;
        //}



        //public String ReadNodeStringUTF8(String wAddress)
        //{

        //    String wResult = "";

        //    FanucAddress wFanucAddress = wAddress.FanucAddressObject();

        //    if (wFanucAddress == null)
        //        return wResult;


        //    List<byte> wBytes = new List<byte>();
        //    int ret = 0;
        //    lock (mLockHandle)
        //    {
        //        switch (wFanucAddress.type)
        //        {
        //            case ((int)FanucAddressTypes.Byte):

        //                Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();

        //                ret = Fanuc.pmc_rdpmcrng(ServerClientID, wFanucAddress.kind,
        //           wFanucAddress.type, wFanucAddress.start, wFanucAddress.end, wFanucAddress.length, iodbpmc0);
        //                if (ret == Fanuc.EW_OK)
        //                {
        //                    if (iodbpmc0.cdata != null && iodbpmc0.cdata.Length > 0)
        //                    {

        //                        wBytes = iodbpmc0.cdata.ToList();

        //                    }
        //                }

        //                break;
        //            case ((int)FanucAddressTypes.Word):

        //                Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();

        //                ret = Fanuc.pmc_rdpmcrng(ServerClientID, wFanucAddress.kind,
        //                    wFanucAddress.type, wFanucAddress.start, wFanucAddress.end, wFanucAddress.length, iodbpmc1);
        //                if (ret == Fanuc.EW_OK)
        //                {

        //                    if (iodbpmc1.idata != null && iodbpmc1.idata.Length > 0)
        //                    {

        //                        foreach (var item in iodbpmc1.idata)
        //                        {
        //                            wBytes.AddRange(BitConverter.GetBytes(item));

        //                        }
        //                    }

        //                }

        //                break;

        //            case ((int)FanucAddressTypes.Dword):

        //                Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();

        //                ret = Fanuc.pmc_rdpmcrng(ServerClientID, wFanucAddress.kind,
        //           wFanucAddress.type, wFanucAddress.start, wFanucAddress.end, wFanucAddress.length, iodbpmc2);

        //                if (ret == Fanuc.EW_OK)
        //                {

        //                    if (iodbpmc2.ldata != null && iodbpmc2.ldata.Length > 0)
        //                        foreach (var item in iodbpmc2.ldata)
        //                        {
        //                            wBytes.AddRange(BitConverter.GetBytes(item));

        //                        }

        //                }

        //                break;
        //            default:
        //                return wResult;
        //        }

        //    }
        //    if (ret != Fanuc.EW_OK)
        //    {
        //        Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "pmc_rdpmcrng", ServerClientID, ret));
        //        this.Client_KeepAlive(ret);
        //    }


        //    wResult = System.Text.Encoding.UTF8.GetString(wBytes.ToArray());

        //    return wResult;
        //}



        public override bool WriteNode(String wAddress, string value)
        {

            if (value == null)
            {
                return false;
            }
            ushort wServerClientID = 0;
            short ret =
                Fanuc.cnc_allclibhndl3(BaseServerDescription.ServerUrl,
                (ushort)BaseServerDescription.ServerPort, BaseServerDescription.TimeOutSecond, out wServerClientID);

            if (value.Equals("true", StringComparison.CurrentCultureIgnoreCase) || value.Equals("false", StringComparison.CurrentCultureIgnoreCase))
            {
                ret = this.WriteNode(wAddress, value.Equals("true", StringComparison.CurrentCultureIgnoreCase), wServerClientID);

            }
            else if (Byte.TryParse(value, out Byte wValueByte))
            {
                ret = this.WriteNode(wAddress, wValueByte, wServerClientID);

            }
            else if (Int16.TryParse(value, out Int16 wValueShort))
            {
                ret = this.WriteNode(wAddress, wValueShort, wServerClientID);

            }
            else if (Int32.TryParse(value, out Int32 wValueInt))
            {
                ret = this.WriteNode(wAddress, wValueInt, wServerClientID);

            }
            else if (Single.TryParse(value, out Single wValueSingle))
            {
                ret = this.WriteNode(wAddress, wValueSingle, wServerClientID);

            }
            else if (Double.TryParse(value, out Double wValueDouble))
            {
                ret = this.WriteNode(wAddress, wValueDouble, wServerClientID);
            }
            else
            {
                ret = this.WriteNodeString(wAddress, value, wServerClientID);
            }
            Fanuc.cnc_freelibhndl(wServerClientID);

            return ret == Fanuc.EW_OK;
        }



        public short WriteNodeString(String wAddress, String value, ushort wServerClientID)
        {

            short ret = 0;
            if (value == null)
                value = "";

            //将wAddress 分解 前缀+起始地址+|结束地址 []

            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return ret;



            switch (wFanucAddress.type)
            {
                case ((int)FanucAddressTypes.Byte):
                    Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();
                    iodbpmc0.datano_s = (short)wFanucAddress.start;
                    iodbpmc0.datano_e = (short)wFanucAddress.end;
                    iodbpmc0.type_a = wFanucAddress.kind;
                    iodbpmc0.type_d = wFanucAddress.type;

                    iodbpmc0.cdata = value.FanucDataWriteByteResult();

                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc0);

                    break;
                case ((int)FanucAddressTypes.Word):
                    Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();
                    iodbpmc1.datano_s = (short)wFanucAddress.start;
                    iodbpmc1.datano_e = (short)wFanucAddress.end;
                    iodbpmc1.type_a = wFanucAddress.kind;
                    iodbpmc1.type_d = wFanucAddress.type;

                    iodbpmc1.idata = value.FanucDataWriteShortResult();
                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc1);
                    break;
                case ((int)FanucAddressTypes.Dword):
                    Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();
                    iodbpmc2.datano_s = (short)wFanucAddress.start;
                    iodbpmc2.datano_e = (short)wFanucAddress.end;
                    iodbpmc2.type_a = wFanucAddress.kind;
                    iodbpmc2.type_d = wFanucAddress.type;

                    iodbpmc2.ldata = value.FanucDataWriteIntResult();
                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc2);
                    break;
                default:
                    return ret;
            }

            return ret;

        }



        private short WriteNode(String wAddress, bool value, ushort wServerClientID)
        {

            //将wAddress 分解 前缀+起始地址+|结束地址 []
            short ret = 0;
            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return ret;

            if (wFanucAddress.Index < 0)
            {
                wFanucAddress.Index = 0;
            }

            switch (wFanucAddress.type)
            {
                case ((int)FanucAddressTypes.Byte):
                    Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();
                    iodbpmc0.datano_s = (short)wFanucAddress.start;
                    iodbpmc0.datano_e = (short)wFanucAddress.end;
                    iodbpmc0.type_a = wFanucAddress.kind;
                    iodbpmc0.type_d = wFanucAddress.type;

                    iodbpmc0.cdata = new byte[5];
                    if (value)
                    {
                        iodbpmc0.cdata[0] |= ((byte)(1 << wFanucAddress.Index));
                    }

                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc0);

                    break;
                case ((int)FanucAddressTypes.Word):
                    Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();
                    iodbpmc1.datano_s = (short)wFanucAddress.start;
                    iodbpmc1.datano_e = (short)wFanucAddress.end;
                    iodbpmc1.type_a = wFanucAddress.kind;
                    iodbpmc1.type_d = wFanucAddress.type;

                    iodbpmc1.idata = new short[5];
                    if (value)
                    {
                        iodbpmc1.idata[0] |= ((short)(1 << wFanucAddress.Index));
                    }

                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc1);
                    break;
                case ((int)FanucAddressTypes.Dword):
                    Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();
                    iodbpmc2.datano_s = (short)wFanucAddress.start;
                    iodbpmc2.datano_e = (short)wFanucAddress.end;
                    iodbpmc2.type_a = wFanucAddress.kind;
                    iodbpmc2.type_d = wFanucAddress.type;

                    iodbpmc2.ldata = new int[5];

                    if (value)
                    {
                        iodbpmc2.ldata[0] |= (1 << wFanucAddress.Index);
                    }

                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc2);
                    break;
                default:
                    break;
            }

            return ret;

        }

        private short WriteNode(String wAddress, int value, ushort wServerClientID)
        {

            //将wAddress 分解 前缀+起始地址+|结束地址 []

            short ret = 0;
            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return ret;




            Byte[] buf = null;

            switch (wFanucAddress.type)
            {
                case ((int)FanucAddressTypes.Byte):
                    Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();
                    iodbpmc0.datano_s = (short)wFanucAddress.start;
                    iodbpmc0.datano_e = (short)wFanucAddress.end;
                    iodbpmc0.type_a = wFanucAddress.kind;
                    iodbpmc0.type_d = wFanucAddress.type;

                    iodbpmc0.cdata = new byte[5];

                    buf = BitConverter.GetBytes(value);

                    Array.Copy(buf, iodbpmc0.cdata, buf.Length);


                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc0);

                    break;
                case ((int)FanucAddressTypes.Word):
                    Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();
                    iodbpmc1.datano_s = (short)wFanucAddress.start;
                    iodbpmc1.datano_e = (short)wFanucAddress.end;
                    iodbpmc1.type_a = wFanucAddress.kind;
                    iodbpmc1.type_d = wFanucAddress.type;

                    iodbpmc1.idata = BitConverter.GetBytes(value).FanucDataWriteShortResult();


                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc1);
                    break;
                case ((int)FanucAddressTypes.Dword):
                    Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();
                    iodbpmc2.datano_s = (short)wFanucAddress.start;
                    iodbpmc2.datano_e = (short)wFanucAddress.end;
                    iodbpmc2.type_a = wFanucAddress.kind;
                    iodbpmc2.type_d = wFanucAddress.type;

                    iodbpmc2.ldata = new int[5];

                    iodbpmc2.ldata[0] = value;

                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc2);
                    break;
                default:
                    break;
            }


            return ret;

        }


        private short WriteNode(String wAddress, float value, ushort wServerClientID)
        {

            //将wAddress 分解 前缀+起始地址+|结束地址 []
            short ret = 0;
            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return ret;


            Byte[] buf = null;

            switch (wFanucAddress.type)
            {
                case ((int)FanucAddressTypes.Byte):
                    Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();
                    iodbpmc0.datano_s = (short)wFanucAddress.start;
                    iodbpmc0.datano_e = (short)wFanucAddress.end;
                    iodbpmc0.type_a = wFanucAddress.kind;
                    iodbpmc0.type_d = wFanucAddress.type;

                    iodbpmc0.cdata = new byte[5];

                    buf = BitConverter.GetBytes(value);

                    Array.Copy(buf, iodbpmc0.cdata, buf.Length);


                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc0);

                    break;
                case ((int)FanucAddressTypes.Word):
                    Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();
                    iodbpmc1.datano_s = (short)wFanucAddress.start;
                    iodbpmc1.datano_e = (short)wFanucAddress.end;
                    iodbpmc1.type_a = wFanucAddress.kind;
                    iodbpmc1.type_d = wFanucAddress.type;

                    iodbpmc1.idata = BitConverter.GetBytes(value).FanucDataWriteShortResult();


                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc1);
                    break;
                case ((int)FanucAddressTypes.Dword):
                    Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();
                    iodbpmc2.datano_s = (short)wFanucAddress.start;
                    iodbpmc2.datano_e = (short)wFanucAddress.end;
                    iodbpmc2.type_a = wFanucAddress.kind;
                    iodbpmc2.type_d = wFanucAddress.type;

                    iodbpmc2.ldata = new int[5];

                    iodbpmc2.ldata[0] = ((int)(value * 1000));

                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc2);
                    break;
                default:
                    break;
            }



            return ret;

        }

        private short WriteNode(String wAddress, double value, ushort wServerClientID)
        {

            //将wAddress 分解 前缀+起始地址+|结束地址 []
            short ret = 0;
            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return ret;

            Byte[] buf = null;

            switch (wFanucAddress.type)
            {
                case ((int)FanucAddressTypes.Byte):
                    Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();
                    iodbpmc0.datano_s = (short)wFanucAddress.start;
                    iodbpmc0.datano_e = (short)wFanucAddress.end;
                    iodbpmc0.type_a = wFanucAddress.kind;
                    iodbpmc0.type_d = wFanucAddress.type;

                    iodbpmc0.cdata = new byte[5];

                    buf = BitConverter.GetBytes(value);

                    Array.Copy(buf, iodbpmc0.cdata, buf.Length);


                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc0);

                    break;
                case ((int)FanucAddressTypes.Word):
                    Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();
                    iodbpmc1.datano_s = (short)wFanucAddress.start;
                    iodbpmc1.datano_e = (short)wFanucAddress.end;
                    iodbpmc1.type_a = wFanucAddress.kind;
                    iodbpmc1.type_d = wFanucAddress.type;

                    iodbpmc1.idata = BitConverter.GetBytes(value).FanucDataWriteShortResult();


                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc1);
                    break;
                case ((int)FanucAddressTypes.Dword):
                    Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();
                    iodbpmc2.datano_s = (short)wFanucAddress.start;
                    iodbpmc2.datano_e = (short)wFanucAddress.end;
                    iodbpmc2.type_a = wFanucAddress.kind;
                    iodbpmc2.type_d = wFanucAddress.type;

                    iodbpmc2.ldata = new int[5];

                    iodbpmc2.ldata[0] = ((int)(value * 1000));

                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc2);
                    break;
                default:
                    break;
            }



            return ret;

        }
        private short WriteNode(String wAddress, byte value, ushort wServerClientID)
        {

            //将wAddress 分解 前缀+起始地址+|结束地址 []
            short ret = 0;
            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return ret;

            Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();
            iodbpmc0.datano_s = (short)wFanucAddress.start;
            iodbpmc0.datano_e = (short)wFanucAddress.end;
            iodbpmc0.type_a = wFanucAddress.kind;
            iodbpmc0.type_d = wFanucAddress.type;

            iodbpmc0.cdata = new byte[5];

            iodbpmc0.cdata[0] = value;

            ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc0);

            return ret;

        }
        private short WriteNode(String wAddress, short value, ushort wServerClientID)
        {

            //将wAddress 分解 前缀+起始地址+|结束地址 []
            short ret = 0;
            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return ret;


            Byte[] buf = null;

            switch (wFanucAddress.type)
            {
                case ((int)FanucAddressTypes.Byte):
                    Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();
                    iodbpmc0.datano_s = (short)wFanucAddress.start;
                    iodbpmc0.datano_e = (short)wFanucAddress.end;
                    iodbpmc0.type_a = wFanucAddress.kind;
                    iodbpmc0.type_d = wFanucAddress.type;

                    iodbpmc0.cdata = new byte[5];

                    buf = BitConverter.GetBytes(value);

                    Array.Copy(buf, iodbpmc0.cdata, buf.Length);


                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc0);

                    break;
                case ((int)FanucAddressTypes.Word):
                    Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();
                    iodbpmc1.datano_s = (short)wFanucAddress.start;
                    iodbpmc1.datano_e = (short)wFanucAddress.end;
                    iodbpmc1.type_a = wFanucAddress.kind;
                    iodbpmc1.type_d = wFanucAddress.type;

                    iodbpmc1.idata = new short[5];

                    iodbpmc1.idata[0] = value;

                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc1);
                    break;
                case ((int)FanucAddressTypes.Dword):
                    Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();
                    iodbpmc2.datano_s = (short)wFanucAddress.start;
                    iodbpmc2.datano_e = (short)wFanucAddress.end;
                    iodbpmc2.type_a = wFanucAddress.kind;
                    iodbpmc2.type_d = wFanucAddress.type;

                    iodbpmc2.ldata = new int[5];

                    iodbpmc2.ldata[0] = value;

                    ret = Fanuc.pmc_wrpmcrng(wServerClientID, wFanucAddress.length, iodbpmc2);
                    break;
                default:
                    break;
            }


            return ret;


        }

        public override bool WriteNode<T>(String wAddress, T value)
        {
            //将wAddress 分解 前缀+起始地址+|结束地址 []

            FanucAddress wFanucAddress = wAddress.FanucAddressObject();

            if (wFanucAddress == null)
                return false;

            if (value == null)
            {
                return false;
            }

            ushort wServerClientID = 0;
            short ret =
                Fanuc.cnc_allclibhndl3(BaseServerDescription.ServerUrl,
                (ushort)BaseServerDescription.ServerPort, BaseServerDescription.TimeOutSecond, out wServerClientID);


            if (value is bool)
            {
                ret = this.WriteNode(wAddress, Convert.ToBoolean(value), wServerClientID);

            }
            else if (value is int)
            {
                ret = this.WriteNode(wAddress, Convert.ToInt32(value), wServerClientID);
            }
            else if (value is byte)
            {
                ret = this.WriteNode(wAddress, Convert.ToByte(value), wServerClientID);
            }
            else if (value is float)
            {
                ret = this.WriteNode(wAddress, Convert.ToSingle(value), wServerClientID);
            }
            else if (value is double)
            {
                ret = this.WriteNode(wAddress, Convert.ToDouble(value), wServerClientID);
            }
            else
            {
                ret = 1; ;
            }

            Fanuc.cnc_freelibhndl(wServerClientID);
            return ret == Fanuc.EW_OK;
        }





        ///// <summary>
        /////  暂不支持
        ///// </summary>
        ///// <param name="wAddress"></param>
        ///// <param name="value"></param>
        //public void WriteNodes(String wAddress, int[] value)
        //{

        //    //将wAddress 分解 前缀+起始地址+|结束地址 []

        //    FanucAddress wFanucAddress = wAddress.FanucAddressObject();

        //    if (wFanucAddress == null)
        //        return;


        //    Fanuc.IODBPMC2 iodbpmc2 = new Focas1.IODBPMC2();
        //    iodbpmc2.datano_s = (short)wFanucAddress.start;
        //    iodbpmc2.datano_e = (short)wFanucAddress.end;
        //    iodbpmc2.type_a = wFanucAddress.kind;
        //    iodbpmc2.type_d = wFanucAddress.type;

        //    iodbpmc2.ldata = new int[5];

        //    Array.Copy(value, iodbpmc2.ldata, value.Length > 5 ? 5 : value.Length);
        //     
        //        int ret = Fanuc.pmc_wrpmcrng(ServerClientID, wFanucAddress.length, iodbpmc2);

        //        if (ret != Fanuc.EW_OK)
        //        {
        //            Client_KeepAlive(ret);
        //        }
        //    

        //}
        //public void WriteNodes(String wAddress, short[] value)
        //{

        //    //将wAddress 分解 前缀+起始地址+|结束地址 []

        //    FanucAddress wFanucAddress = wAddress.FanucAddressObject();

        //    if (wFanucAddress == null)
        //        return;

        //    Fanuc.IODBPMC1 iodbpmc1 = new Focas1.IODBPMC1();
        //    iodbpmc1.datano_s = (short)wFanucAddress.start;
        //    iodbpmc1.datano_e = (short)wFanucAddress.end;
        //    iodbpmc1.type_a = wFanucAddress.kind;
        //    iodbpmc1.type_d = wFanucAddress.type;

        //    iodbpmc1.idata = new short[5];

        //    Array.Copy(value, iodbpmc1.idata, value.Length > 5 ? 5 : value.Length);
        //     
        //        int ret = Fanuc.pmc_wrpmcrng(ServerClientID, wFanucAddress.length, iodbpmc1);

        //        if (ret != Fanuc.EW_OK)
        //        {
        //            Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "pmc_wrpmcrng", ServerClientID, ret));
        //            Client_KeepAlive(ret);
        //        }
        //    

        //}
        //public void WriteNodes(String wAddress, byte[] value)
        //{

        //    //将wAddress 分解 前缀+起始地址+|结束地址 []

        //    FanucAddress wFanucAddress = wAddress.FanucAddressObject();

        //    if (wFanucAddress == null)
        //        return;

        //    Fanuc.IODBPMC0 iodbpmc0 = new Focas1.IODBPMC0();
        //    iodbpmc0.datano_s = (short)wFanucAddress.start;
        //    iodbpmc0.datano_e = (short)wFanucAddress.end;
        //    iodbpmc0.type_a = wFanucAddress.kind;
        //    iodbpmc0.type_d = wFanucAddress.type;

        //    iodbpmc0.cdata = new byte[5];

        //    Array.Copy(value, iodbpmc0.cdata, value.Length > 5 ? 5 : value.Length);
        // 
        //        int ret = Fanuc.pmc_wrpmcrng(ServerClientID, wFanucAddress.length, iodbpmc0);
        //        if (ret != Fanuc.EW_OK)
        //        {
        //            Console.WriteLine(String.Format("Function:{0} ServerClientID:{1} ret:{2} ", "pmc_wrpmcrng", ServerClientID, ret));
        //            Client_KeepAlive(ret);
        //        }
        //    

        //}




        #endregion
    }

    public class ConnectLock
    {
        public int Index = 0;
        public ConnectLock() { }
    }
}
