using SimpleTcp;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SampleTcp
{
    public class TcpListening
    {
        private SimpleTcpServer TcpServer;

        /// <summary>
        /// 客户端的 ip 端口
        /// </summary>
        public string ClientsIpPort { get;private set; } = "0";


        public bool IsClientConnected
        {
            get
            {
                return ClientsIpPort == "0" ? false : true;
            }
        }


        /// <summary>
        /// 服务器ip+port
        /// </summary>
        public string ServerIpPort { get; private set; } = "127.0.0.1:12000";


        public event EventHandler<TcpDataRecivedEventArgs> TcpDataRecivedHandler;


        public TcpListening(string ipPort)
        {

            TcpServer = new SimpleTcpServer(ipPort);
            ServerIpPort = ipPort;
            // set events
            TcpServer.Events.ClientConnected += ClientConnected;
            TcpServer.Events.ClientDisconnected += ClientDisconnected;
            TcpServer.Events.DataReceived += DataReceived;
        }

        public void DoConnect()
        {
            if (TcpServer != null && !TcpServer.IsListening)
            {
                TcpServer.Start();
            }
        }

        public async Task Connect()
        {
            if (TcpServer != null && !TcpServer.IsListening)
            {
                await TcpServer.StartAsync();
            }
        }

        private void ClientConnected(object sender, ClientConnectedEventArgs e)
        {
            //Console.WriteLine("[" + e.IpPort + "] client connected");
            if (e.IpPort!=ClientsIpPort)
            {
                TcpServer.DisconnectClient(ClientsIpPort);
                ClientsIpPort = e.IpPort;
                
            }
        }

        private void ClientDisconnected(object sender, ClientDisconnectedEventArgs e)
        {
            //Console.WriteLine("[" + e.IpPort + "] client disconnected: " + e.Reason.ToString());
            if (e.IpPort == ClientsIpPort)
            {
                ClientsIpPort = "0";
            }
        }

        private void DataReceived(object sender, DataReceivedEventArgs e)
        {
            //if (e.IpPort == clientipPort)
            //{
            //    Console.WriteLine("[" + e.IpPort + "]: " + Encoding.UTF8.GetString(e.Data));
            //}
            TcpDataRecivedHandler?.Invoke(this, new TcpDataRecivedEventArgs(e.IpPort, e.Data));
        }

        public async Task SendDataAsync(string data)
        {
            if(ClientsIpPort!="0")
            {
                await TcpServer.SendAsync(ClientsIpPort, data);
            }
            
            //if (ClientsIpPort.Contains(ipPort))
            //{
            //    await TcpServer.SendAsync(ipPort, data);
            //}
        }

        public void SendData(string data)
        {
            if(ClientsIpPort!="0")
            {
                TcpServer.Send(ClientsIpPort, data);
            }
            
            //if (ClientsIpPort.Contains(ipPort))
            //{
            //    TcpServer.Send(ipPort, data);
            //}
        }
    }

    public class TcpDataRecivedEventArgs : EventArgs
    {



        public TcpDataRecivedEventArgs(string ipPort, byte[] data)
        {
            IpPort = ipPort;
            Data = data;
        }


        /// <summary>
        /// 客户端IP+:port
        /// </summary>
        public string IpPort { get; set; }

        /// <summary>
        /// 数据
        /// </summary>
        public byte[] Data { get; set; }

        public override string ToString()
        {
            return Encoding.UTF8.GetString(Data);
        }

    }
}
