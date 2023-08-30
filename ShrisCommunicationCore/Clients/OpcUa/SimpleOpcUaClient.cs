using Opc.Ua;
using Opc.Ua.Client;
using Opc.Ua.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ShrisCommunicationCore
{
    public class SimpleOpcUaClient : ServerClient, IDisposable
    {
        #region develop commit

        ///连接方式及安全性依据服务器配置来
        ///OpcUa 服务器登录前需要账户验证
        ///如果服务启用允许匿名连接，则不需要用户名和密码
        ///如果设置了 不允许匿名登录，则连接时需要用户名和密码
        ///不同用户组 对不同功能的访问有限制
        ///主要权限如下：
        ///Dynamic Addressing
        ///I/O Tags
        ///System Tags
        ///Internal Tags
        ///Browsing
        ///不同用户组可能不能访问其中的某项权限

        ///用户名 密码验证完毕后
        ///交互数据需要匹配 Opc 服务器的 数据安全策略
        ///主要安全策略有：
        ///Basic256sha
        ///Basic256
        ///Basic128rsa15
        ///无安全策略

        ///查看证书路径
        ///C:\Users\Haojie.Wang\AppData\Local\OPC Foundation\pki

        #endregion develop commit

        #region private properties

        private OpcUaServerDescription BaseServerDescription
        {
            get
            {
                if (_serverDescription != null && _serverDescription is OpcUaServerDescription)
                {
                    return (OpcUaServerDescription)_serverDescription;

                }
                return new OpcUaServerDescription();

            }
        }
        private ApplicationInstance application;

        private ApplicationConfiguration m_configuration { get { return application.ApplicationConfiguration; } }
        private bool autoAccept = false;
        bool haveAppCertificate = false;
        private Session m_session;

        /// <summary>
        ///   系统所有的节点信息 
        /// </summary>
        private Dictionary<string, Subscription> dic_subscriptions;



        #endregion private properties



        #region Constructors

        /// <summary>
        /// OpcUaServerDescription.Configured=true 时，按照配置文件创建客户端，用户名及安全策略由OpcUaServerDescription指定
        /// OpcUaServerDescription.Configured=false 时，创建默认匿名，不安全连接，忽视其他参数
        /// </summary>
        /// <param name="serverDescription">OPC服务器配置</param>
        public SimpleOpcUaClient(OpcUaServerDescription serverDescription) : base(serverDescription)
        {

            application = new ApplicationInstance
            {
                ApplicationName = serverDescription.ClientName,
                ApplicationType = ApplicationType.Client,
                ConfigSectionName = serverDescription.ConfigurationSectionName
            };

            if (serverDescription.Configured)
            {
                LoadConfiguration();
            }
            else
            {
                CreateClientConfiguration();
            }
            dic_subscriptions = new Dictionary<string, Subscription>();
        }

        #endregion Constructors


        #region  create configuration

        /// <summary>
        /// load configuration from xml setting
        /// </summary>
        private void LoadConfiguration()
        {

            try
            {

                // load the application configuration.
                //此处会覆盖 ApplicationName
                ApplicationConfiguration config = null;
                if (BaseServerDescription.IsFilePath)
                {
                    config = application.LoadApplicationConfiguration(true, BaseServerDescription.ConfigurationSectionName).Result;
                }
                else
                {
                    config = application.LoadApplicationConfiguration(true).Result;
                }


                // check the application certificate.
                haveAppCertificate = application.CheckApplicationInstanceCertificate(true, 0).Result;
                if (!haveAppCertificate)
                {
                    throw new Exception("Application instance certificate invalid!");
                }
                if (haveAppCertificate)
                {
                    config.ApplicationUri = Utils.GetApplicationUriFromCertificate(config.SecurityConfiguration.ApplicationCertificate.Certificate);
                    if (config.SecurityConfiguration.AutoAcceptUntrustedCertificates)
                    {
                        autoAccept = true;
                    }
                    config.CertificateValidator.CertificateValidation += new CertificateValidationEventHandler(CertificateValidator_CertificateValidation);
                }

                else
                {
                    throw new Exception("    WARN: missing application certificate, using unsecure connection.");
                }

                application.ApplicationConfiguration = config;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void CreateClientConfiguration()
        {

            //BaseServerDescription.IsAnonymous = true;
            BaseServerDescription.SecerityPolic = 1;
            autoAccept = true;

            var certificateValidator = new CertificateValidator();
            certificateValidator.CertificateValidation += new CertificateValidationEventHandler(CertificateValidator_CertificateValidation);

            SecurityConfiguration securityConfigurationc = new SecurityConfiguration
            {
                AutoAcceptUntrustedCertificates = true,
                RejectSHA1SignedCertificates = false,
                MinimumCertificateKeySize = 1024,
            };
            certificateValidator.Update(securityConfigurationc).Wait();

            ApplicationConfiguration configuration = new ApplicationConfiguration();
            configuration.ApplicationName = BaseServerDescription.ClientName;
            configuration.ApplicationType = ApplicationType.Client;
            configuration.CertificateValidator = certificateValidator;
            configuration.ServerConfiguration = new ServerConfiguration
            {
                MaxSubscriptionCount = 100000,
                MaxMessageQueueSize = 1000000,
                MaxNotificationQueueSize = 1000000,
                MaxPublishRequestCount = 10000000,
            };
            configuration.SecurityConfiguration = securityConfigurationc;
            configuration.TransportQuotas = new TransportQuotas
            {
                OperationTimeout = 6000000,
                MaxStringLength = int.MaxValue,
                MaxByteStringLength = int.MaxValue,
                MaxArrayLength = 65535,
                MaxMessageSize = 419430400,
                MaxBufferSize = 65535,
                ChannelLifetime = -1,
                SecurityTokenLifetime = -1
            };
            configuration.ClientConfiguration = new ClientConfiguration
            {
                DefaultSessionTimeout = -1,
                MinSubscriptionLifetime = -1,
            };
            configuration.DisableHiResClock = true;

            application.ApplicationConfiguration = configuration;
        }


        #endregion create configuration


        #region connect/disconnect

        /// <summary>
        /// connect to server
        /// </summary>
        /// <returns></returns>
        public override async Task Connect()
        {
            m_session = await ConnectServer(BaseServerDescription.ServerUrl);
        }


        /// <summary>
        /// Creates a new session.
        /// </summary>
        /// <returns>The new session object.</returns>
        private async Task<Session> ConnectServer(string serverUrl)
        {
            // disconnect from existing session.
            Disconnect();

            if (m_configuration == null)
            {
                throw new ArgumentNullException("m_configuration");
            }

            EndpointDescription endpointDescription = null;
            if (BaseServerDescription.SecerityPolic == 0)
            {
                // select the best endpoint.
                endpointDescription = CoreClientUtils.SelectEndpoint(serverUrl, haveAppCertificate);
            }
            else
            {

                endpointDescription = CoreClientUtils.SpecifiedEndpoint(serverUrl, BaseServerDescription.SecerityPolic);
            }

            EndpointConfiguration endpointConfiguration = EndpointConfiguration.Create(m_configuration);
            ConfiguredEndpoint endpoint = new ConfiguredEndpoint(null, endpointDescription, endpointConfiguration);

            UserIdentity userIdentity = new UserIdentity();

            if (!BaseServerDescription.IsAnonymous)
            {
                userIdentity = new UserIdentity(BaseServerDescription.UserName, BaseServerDescription.Password);
            }

            m_session = await Session.Create(
                m_configuration,
                endpoint,
                false,
                m_configuration.ApplicationName,
                60000,
                userIdentity,
                null,
                BaseServerDescription.IgnoreVaildServerNonce);

            // set up keep alive callback.
            m_session.KeepAlive += new KeepAliveEventHandler(Session_KeepAlive);

            // update the client status
            IsConnected = true;

            // raise an event.
            DoConnectComplete(null);

            UpdateStatus(true, DateTime.Now, "Connected");

            // return the new session.
            return m_session;
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
            m_StatusChange?.Invoke(this, new ServerStatusEventArgs(isConnected, time, status, args));

        }

     

        /// <summary>
        /// Disconnects from the server.
        /// </summary>
        public override void Disconnect()
        {
            // stop any reconnect operation.
            if (m_reconnectHandler != null)
            {
                m_reconnectHandler.Dispose();
                m_reconnectHandler = null;
            }

            // disconnect any existing session.
            if (m_session != null)
            {
                //所有订阅移除
                RemoveAllSubscription();
                m_session.Close(10000);
                m_session = null;
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
        /// Handles a keep alive event from a session.
        /// </summary>
        private void Session_KeepAlive(Session session, KeepAliveEventArgs e)
        {
            try
            {
                // check for events from discarded sessions.
                if (!Object.ReferenceEquals(session, m_session))
                {
                    return;
                }

                // start reconnect sequence on communication error.
                if (ServiceResult.IsBad(e.Status))
                {
                    UpdateStatus(false, e.CurrentTime, "Communication Error ({0})", e.Status);
                    if (ReconnectPeriod <= 0)
                    {
                        return;
                    }

                    UpdateStatus(false, e.CurrentTime, "Reconnecting in {0}s", ReconnectPeriod);

                    if (m_reconnectHandler == null)
                    {
                        m_ReconnectStarting?.Invoke(this, e);
                        m_reconnectHandler = new SessionReconnectHandler();
                        m_reconnectHandler.BeginReconnect(m_session, ReconnectPeriod * 1000, Server_ReconnectComplete);
                    }
                    return;
                }

                // update status.
                UpdateStatus(true, e.CurrentTime, "Connected [{0}]", session.Endpoint.EndpointUrl);

                // raise any additional notifications.
                m_KeepAliveComplete?.Invoke(this, e);
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }




        private SessionReconnectHandler m_reconnectHandler;

        /// <summary>
        /// Handles a reconnect event complete from the reconnect handler.
        /// </summary>
        private void Server_ReconnectComplete(object sender, EventArgs e)
        {

            try
            {
                // ignore callbacks from discarded objects.
                if (!Object.ReferenceEquals(sender, m_reconnectHandler))
                {
                    return;
                }

                m_session = m_reconnectHandler.Session;
                m_reconnectHandler.Dispose();
                m_reconnectHandler = null;

                // raise any additional notifications.
                m_ReconnectComplete?.Invoke(this, e);
            }
            catch (Exception exception)
            {
                throw exception;

            }
        }



        #endregion keep alive handler

        #region certifacate events
        private void CertificateValidator_CertificateValidation(CertificateValidator validator, CertificateValidationEventArgs e)
        {
            if (e.Error.StatusCode == StatusCodes.BadCertificateUntrusted)
            {
                e.Accept = autoAccept;
                if (autoAccept)
                {
                    Console.WriteLine("Accepted Certificate: {0}", e.Certificate.Subject);
                }
                else
                {
                    Console.WriteLine("Rejected Certificate: {0}", e.Certificate.Subject);
                }
            }
        }

        #endregion certifacate events



        #region Node Write/Read Support

        /// <summary>
        /// Read a value node from server
        /// </summary>
        /// <param name="nodeId">node id</param>
        /// <returns>DataValue</returns>
        public DataValue ReadNode(NodeId nodeId)
        {

            ReadValueIdCollection nodesToRead = new ReadValueIdCollection
            {
                new ReadValueId( )
                {
                    NodeId = nodeId,
                    AttributeId = Attributes.Value
                }
            };
            if (m_session != null)
            {

                // read the current value
                m_session.Read(
                null,
                0,
                TimestampsToReturn.Neither,
                nodesToRead,
                out DataValueCollection results,
                out DiagnosticInfoCollection diagnosticInfos);

                ClientBase.ValidateResponse(results, nodesToRead);
                ClientBase.ValidateDiagnosticInfos(diagnosticInfos, nodesToRead);


                return results[0];
            }

            return null;

        }

        /// <summary>
        /// Read a value node from server
        /// </summary>
        /// <param name="tag">node id</param>
        /// <returns></returns>
        public DataValue ReadNode(string tag)
        {
            DataValue dataValue = ReadNode(new NodeId(tag));
            return dataValue;
        }

        /// <summary>
        /// Read a value node from server
        /// </summary>
        /// <param name="tag">node id</param>
        /// <returns></returns>
        public string ReadNodeValue(string tag)
        {
            DataValue dataValue = ReadNode(new NodeId(tag));
            return dataValue.GetStringValue(0);
        }


        /// <summary>
        /// Read a value node from server
        /// </summary>
        /// <typeparam name="T">type of value</typeparam>
        /// <param name="tag">node id</param>
        /// <returns>实际值</returns>
        public T ReadNode<T>(string tag)
        {
            DataValue dataValue = ReadNode(new NodeId(tag));
            return (T)dataValue.Value;
        }

        /// <summary>
        /// read several value nodes from server
        /// </summary>
        /// <param name="nodeIds">all NodeIds</param>
        /// <returns>all values</returns>
        public List<DataValue> ReadNodes(List<NodeId> nodeIds)
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            for (int i = 0; i < nodeIds.Count; i++)
            {
                nodesToRead.Add(new ReadValueId()
                {
                    NodeId = nodeIds[i],
                    AttributeId = Attributes.Value
                }); ;
            }

            try
            {
                // 读取当前的值
                m_session.Read(
                    null,
                    0,
                    TimestampsToReturn.Neither,
                    nodesToRead,
                    out DataValueCollection results,
                    out DiagnosticInfoCollection diagnosticInfos);

                ClientBase.ValidateResponse(results, nodesToRead);
                ClientBase.ValidateDiagnosticInfos(diagnosticInfos, nodesToRead);


                //m_session.read

                return results.ToList();
            }
            catch (Exception)
            {
                return null;
            }

        }

        /// <summary>
        /// read several value nodes from server
        /// </summary>
        /// <param name="nodeIds">all NodeIds</param>
        /// <returns>all values</returns>
        public List<DataValue> ReadNodes(List<string> tags)
        {
            List<NodeId> nodeIds = new List<NodeId>();
            for (int i = 0; i < tags.Count; i++)
            {
                nodeIds.Add(new NodeId(tags[i]));
            }

            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            for (int j = 0; j < nodeIds.Count; j++)
            {
                nodesToRead.Add(new ReadValueId()
                {
                    NodeId = nodeIds[j],
                    AttributeId = Attributes.Value
                });
            }

            try
            {
                // 读取当前的值
                if (m_session != null)
                {
                    m_session.Read(
                    null,
                    0,
                    TimestampsToReturn.Neither,
                    nodesToRead,
                    out DataValueCollection results,
                    out DiagnosticInfoCollection diagnosticInfos);

                    ClientBase.ValidateResponse(results, nodesToRead);
                    ClientBase.ValidateDiagnosticInfos(diagnosticInfos, nodesToRead);


                    //m_session.read
                    return results.ToList();

                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }

        }

        public List<String> ReadNodesValue(List<string> tags)
        {
            List<String> wResult = new List<string>();
            List<DataValue> wDataValueList = this.ReadNodes(tags);
            if (wDataValueList != null && wDataValueList.Count > 0)
            {
                foreach (var item in wDataValueList)
                {
                    if (item.Value == null)
                    {
                        wResult.Add("");
                        continue;
                    }
                    if (item.Value is DateTime)
                    {
                        wResult.Add(((DateTime)(item.Value)).ToString("yyyy-MM-dd HH:mm:ss"));
                    }
                    else
                    {
                        wResult.Add(item.Value.ToString());
                    }
                }
            }
            return wResult;
        }


        /// <summary>
        /// Read a tag asynchronously
        /// </summary>
        /// <typeparam name="T">The type of tag to read</typeparam>
        /// <param name="tag">tag值</param>
        /// <returns>The value retrieved from the OPC</returns>
        public Task<T> ReadNodeAsync<T>(string tag)
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection
            {
                new ReadValueId()
                {
                    NodeId = new NodeId(tag),
                    AttributeId = Attributes.Value
                }
            };

            // Wrap the ReadAsync logic in a TaskCompletionSource, so we can use C# async/await syntax to call it:
            var taskCompletionSource = new TaskCompletionSource<T>();
            m_session.BeginRead(
                requestHeader: null,
                maxAge: 0,
                timestampsToReturn: TimestampsToReturn.Neither,
                nodesToRead: nodesToRead,
                callback: ar =>
                {
                    DataValueCollection results;
                    DiagnosticInfoCollection diag;
                    var response = m_session.EndRead(
                      result: ar,
                      results: out results,
                      diagnosticInfos: out diag);

                    try
                    {
                        CheckReturnValue(response.ServiceResult);
                        CheckReturnValue(results[0].StatusCode);
                        var val = results[0];
                        taskCompletionSource.TrySetResult((T)val.Value);
                    }
                    catch (Exception ex)
                    {
                        taskCompletionSource.TrySetException(ex);
                    }
                },
                asyncState: null);

            return taskCompletionSource.Task;
        }

        /// <summary>
        /// read several value nodes from server
        /// </summary>
        /// <param name="nodeIds">all NodeIds</param>
        /// <returns>all values</returns>
        public Task<List<DataValue>> ReadNodesAsync(List<NodeId> nodeIds)
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            for (int i = 0; i < nodeIds.Count; i++)
            {
                nodesToRead.Add(new ReadValueId()
                {
                    NodeId = nodeIds[i],
                    AttributeId = Attributes.Value
                });
            }

            var taskCompletionSource = new TaskCompletionSource<List<DataValue>>();
            // 读取当前的值
            m_session.BeginRead(
                null,
                0,
                TimestampsToReturn.Neither,
                nodesToRead,
                callback: ar =>
                {
                    DataValueCollection results;
                    DiagnosticInfoCollection diag;
                    var response = m_session.EndRead(
                      result: ar,
                      results: out results,
                      diagnosticInfos: out diag);

                    try
                    {
                        CheckReturnValue(response.ServiceResult);
                        taskCompletionSource.TrySetResult(results.ToList());
                    }
                    catch (Exception ex)
                    {
                        taskCompletionSource.TrySetException(ex);
                    }
                },
                asyncState: null);

            return taskCompletionSource.Task;
        }



        /// <summary>
        /// read several value nodes from server
        /// </summary>
        /// <param name="tags">all NodeIds</param>
        /// <returns>all values</returns>
        public Task<List<T>> ReadNodesAsync<T>(List<string> tags)
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            for (int i = 0; i < tags.Count; i++)
            {
                nodesToRead.Add(new ReadValueId()
                {
                    NodeId = new NodeId(tags[i]),
                    AttributeId = Attributes.Value
                });
            }

            var taskCompletionSource = new TaskCompletionSource<List<T>>();
            // 读取当前的值
            m_session.BeginRead(
                null,
                0,
                TimestampsToReturn.Neither,
                nodesToRead,
                callback: ar =>
                {
                    DataValueCollection results;
                    DiagnosticInfoCollection diag;
                    var response = m_session.EndRead(
                      result: ar,
                      results: out results,
                      diagnosticInfos: out diag);

                    try
                    {
                        CheckReturnValue(response.ServiceResult);
                        List<T> result = new List<T>();
                        foreach (var item in results)
                        {
                            result.Add((T)item.Value);
                        }
                        taskCompletionSource.TrySetResult(result);
                    }
                    catch (Exception ex)
                    {
                        taskCompletionSource.TrySetException(ex);
                    }
                },
                asyncState: null);

            return taskCompletionSource.Task;
        }



        public Task<List<Object>> ReadNodesAsync(List<string> tags)
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            for (int i = 0; i < tags.Count; i++)
            {
                nodesToRead.Add(new ReadValueId()
                {
                    NodeId = new NodeId(tags[i]),
                    AttributeId = Attributes.Value
                });
            }

            var taskCompletionSource = new TaskCompletionSource<List<Object>>();
            // 读取当前的值
            m_session.BeginRead(
                null,
                0,
                TimestampsToReturn.Neither,
                nodesToRead,
                callback: ar =>
                {
                    DataValueCollection results;
                    DiagnosticInfoCollection diag;
                    var response = m_session.EndRead(
                      result: ar,
                      results: out results,
                      diagnosticInfos: out diag);

                    try
                    {
                        CheckReturnValue(response.ServiceResult);
                        List<Object> result = new List<Object>();
                        foreach (var item in results)
                        {
                            result.Add(item.Value);
                        }
                        taskCompletionSource.TrySetResult(result);
                    }
                    catch (Exception ex)
                    {
                        taskCompletionSource.TrySetException(ex);
                    }
                },
                asyncState: null);

            return taskCompletionSource.Task;
        }


        /// <summary>
        /// write a note to server(you should use try catch)
        /// </summary>
        /// <typeparam name="T">The type of tag to write on</typeparam>
        /// <param name="tag">节点名称</param>
        /// <param name="value">值</param>
        /// <returns>if success True,otherwise False</returns>
        public override bool WriteNode<T>(string tag, T value)
        {
            WriteValue valueToWrite = new WriteValue()
            {
                NodeId = new NodeId(tag),
                AttributeId = Attributes.Value
            };
            valueToWrite.Value.Value = value;
            valueToWrite.Value.StatusCode = StatusCodes.Good;
            valueToWrite.Value.ServerTimestamp = DateTime.MinValue;
            valueToWrite.Value.SourceTimestamp = DateTime.MinValue;

            WriteValueCollection valuesToWrite = new WriteValueCollection
            {
                valueToWrite
            };

            // 写入当前的值
            /**
             * LYC修改于2021.4.22
             * 增加try catch 防止没有连上OPC服务器时，m_session为null，write方法报错。
             * 奇怪的是，加了try catch，运行项目也报错。所以再加一层null值判断
             */
            try
            {
                if (m_session != null)
                {
                    m_session.Write(
                null,
                valuesToWrite,
                out StatusCodeCollection results,
                out DiagnosticInfoCollection diagnosticInfos);
                    ClientBase.ValidateResponse(results, valuesToWrite);
                    ClientBase.ValidateDiagnosticInfos(diagnosticInfos, valuesToWrite);

                    if (StatusCode.IsBad(results[0]))
                    {
                        throw new ServiceResultException(results[0]);
                    }

                    return !StatusCode.IsBad(results[0]);
                }
                else
                {
                    return false;
                }

            }
            catch (Exception ex)
            {
                Utils.Trace(ex, "SimpleOpcUaClient WriteNode");
                return false;
            }

        }

        /// <summary>
        /// 按字符串类型写入一个节点值
        /// </summary>
        /// <param name="tag">节点名称</param>
        /// <param name="value">写入数据的字符串类型</param>
        /// <returns>if success True,otherwise False</returns>
        public override bool WriteNode(string tag, string value)
        {
            //Create a collection of values to write
            WriteValueCollection valuesToWrite = new WriteValueCollection();
            //Create a collection for StatusCodes
            StatusCodeCollection results = new StatusCodeCollection();
            //Create a collection for DiagnosticInfos
            DiagnosticInfoCollection diagnostics = new DiagnosticInfoCollection();

            //Create a nodeId
            NodeId nodeId = new NodeId(tag);
            //Create a dataValue
            DataValue dataValue = new DataValue();
            //Read the dataValue
            try
            {
                dataValue = m_session.ReadValue(nodeId);
            }
            catch (Exception e)
            {
                //handle Exception here
                throw e;
            }
            Type wType;
            if (dataValue.Value == null)
            {
                wType = "".GetType();
            }
            else
            {
                wType = dataValue.Value.GetType();
            }

            //Get the data type of the read dataValue
            //Handle Arrays here: TBD
            Variant variant = 0;
            try
            {
                variant = new Variant(Convert.ChangeType(value, wType));
            }
            catch //no base data type
            {
                //Handle different arrays types here: TBD
                if (wType.Name == "string[]")
                {
                    string[] arrString = value.Split(';');
                    variant = new Variant(arrString);
                }
                else if (wType.Name == "Byte[]")
                {
                    string[] arrString = value.Split(';');
                    Byte[] arrInt = new Byte[arrString.Length];

                    for (int i = 0; i < arrString.Length; i++)
                    {
                        arrInt[i] = Convert.ToByte(arrString[i]);
                    }
                    variant = new Variant(arrInt);
                }
                else if (wType.Name == "Int16[]")
                {
                    string[] arrString = value.Split(';');
                    Int16[] arrInt = new Int16[arrString.Length];

                    for (int i = 0; i < arrString.Length; i++)
                    {
                        arrInt[i] = Convert.ToInt16(arrString[i]);
                    }
                    variant = new Variant(arrInt);
                }
            }

            //Overwrite the dataValue with a new constructor using read dataType
            dataValue = new DataValue(variant);

            //Create a WriteValue using the NodeId, dataValue and attributeType
            WriteValue valueToWrite = new WriteValue();
            valueToWrite.Value = dataValue;
            valueToWrite.NodeId = nodeId;
            valueToWrite.AttributeId = Attributes.Value;

            //Add the dataValues to the collection
            valuesToWrite.Add(valueToWrite);

            try
            {
                //Write the collection to the server
                m_session.Write(null, valuesToWrite, out results, out diagnostics);
                bool result = true;
                foreach (StatusCode code in results)
                {
                    if (code != 0)
                    {
                        Exception ex = new Exception(code.ToString());
                        result = false;
                        break;
                    }
                }

                return result;

            }
            catch (Exception e)
            {
                //handle Exception here
                throw e;
            }
        }

        /// <summary>
        /// Write a value on the specified opc tag asynchronously
        /// </summary>
        /// <typeparam name="T">The type of tag to write on</typeparam>
        /// <param name="tag">The fully-qualified identifier of the tag. You can specify a subfolder by using a comma delimited name. E.g: the tag `foo.bar` writes on the tag `bar` on the folder `foo`</param>
        /// <param name="value">The value for the item to write</param>
        public Task<bool> WriteNodeAsync<T>(string tag, T value)
        {
            WriteValue valueToWrite = new WriteValue()
            {
                NodeId = new NodeId(tag),
                AttributeId = Attributes.Value,
            };
            valueToWrite.Value.Value = value;
            valueToWrite.Value.StatusCode = StatusCodes.Good;
            valueToWrite.Value.ServerTimestamp = DateTime.MinValue;
            valueToWrite.Value.SourceTimestamp = DateTime.MinValue;
            WriteValueCollection valuesToWrite = new WriteValueCollection
            {
                valueToWrite
            };

            // Wrap the WriteAsync logic in a TaskCompletionSource, so we can use C# async/await syntax to call it:
            var taskCompletionSource = new TaskCompletionSource<bool>();
            m_session.BeginWrite(
                requestHeader: null,
                nodesToWrite: valuesToWrite,
                callback: ar =>
                {
                    var response = m_session.EndWrite(
                      result: ar,
                      results: out StatusCodeCollection results,
                      diagnosticInfos: out DiagnosticInfoCollection diag);

                    try
                    {
                        ClientBase.ValidateResponse(results, valuesToWrite);
                        ClientBase.ValidateDiagnosticInfos(diag, valuesToWrite);
                        taskCompletionSource.SetResult(StatusCode.IsGood(results[0]));
                    }
                    catch (Exception ex)
                    {
                        taskCompletionSource.TrySetException(ex);
                    }
                },
                asyncState: null);
            return taskCompletionSource.Task;
        }


        /// <summary>
        /// 所有的节点都写入成功，返回<c>True</c>，否则返回<c>False</c>
        /// </summary>
        /// <param name="tags">节点名称数组</param>
        /// <param name="values">节点的值数据</param>
        /// <returns>所有的是否都写入成功</returns>
        public bool WriteNodes(List<string> tags, List<object> values)
        {
            WriteValueCollection valuesToWrite = new WriteValueCollection();

            for (int i = 0; i < tags.Count; i++)
            {
                if (i < values.Count)
                {
                    WriteValue valueToWrite = new WriteValue()
                    {
                        NodeId = new NodeId(tags[i]),
                        AttributeId = Attributes.Value
                    };
                    valueToWrite.Value.Value = values[i];
                    valueToWrite.Value.StatusCode = StatusCodes.Good;
                    valueToWrite.Value.ServerTimestamp = DateTime.MinValue;
                    valueToWrite.Value.SourceTimestamp = DateTime.MinValue;
                    valuesToWrite.Add(valueToWrite);
                }
            }

            // 写入当前的值

            m_session.Write(
                null,
                valuesToWrite,
                out StatusCodeCollection results,
                out DiagnosticInfoCollection diagnosticInfos);

            ClientBase.ValidateResponse(results, valuesToWrite);
            ClientBase.ValidateDiagnosticInfos(diagnosticInfos, valuesToWrite);

            bool result = true;
            foreach (var r in results)
            {
                if (StatusCode.IsBad(r))
                {
                    result = false;
                    break;
                }
            }

            return result;
        }

        public bool WriteNodes(List<String> tags, List<String> values)
        {
            //Create a collection of values to write
            WriteValueCollection valuesToWrite = new WriteValueCollection();
            //Create a collection for StatusCodes
            StatusCodeCollection results = new StatusCodeCollection();
            //Create a collection for DiagnosticInfos
            DiagnosticInfoCollection diagnostics = new DiagnosticInfoCollection();

            foreach (String str in tags)
            {
                //Create a nodeId
                NodeId nodeId = new NodeId(str);
                //Create a dataValue
                DataValue dataValue = new DataValue();
                //Read the dataValue
                try
                {
                    dataValue = m_session.ReadValue(nodeId);
                }
                catch (Exception e)
                {
                    //handle Exception here
                    throw e;
                }

                string test = dataValue.Value.GetType().Name;
                //Get the data type of the read dataValue
                //Handle Arrays here: TBD
                Variant variant = 0;
                try
                {
                    variant = new Variant(Convert.ChangeType(values[tags.IndexOf(str)], dataValue.Value.GetType()));
                }
                catch //no base data type
                {
                    //Handle different arrays types here: TBD
                    if (dataValue.Value.GetType().Name == "string[]")
                    {
                        string[] arrString = values[tags.IndexOf(str)].Split(';');
                        variant = new Variant(arrString);
                    }
                    else if (dataValue.Value.GetType().Name == "Byte[]")
                    {
                        string[] arrString = values[tags.IndexOf(str)].Split(';');
                        Byte[] arrInt = new Byte[arrString.Length];

                        for (int i = 0; i < arrString.Length; i++)
                        {
                            arrInt[i] = Convert.ToByte(arrString[i]);
                        }
                        variant = new Variant(arrInt);
                    }
                    else if (dataValue.Value.GetType().Name == "Int16[]")
                    {
                        string[] arrString = values[tags.IndexOf(str)].Split(';');
                        Int16[] arrInt = new Int16[arrString.Length];

                        for (int i = 0; i < arrString.Length; i++)
                        {
                            arrInt[i] = Convert.ToInt16(arrString[i]);
                        }
                        variant = new Variant(arrInt);
                    }
                }

                //Overwrite the dataValue with a new constructor using read dataType
                dataValue = new DataValue(variant);

                //Create a WriteValue using the NodeId, dataValue and attributeType
                WriteValue valueToWrite = new WriteValue();
                valueToWrite.Value = dataValue;
                valueToWrite.NodeId = nodeId;
                valueToWrite.AttributeId = Attributes.Value;

                //Add the dataValues to the collection
                valuesToWrite.Add(valueToWrite);
            }

            try
            {
                //Write the collection to the server
                m_session.Write(null, valuesToWrite, out results, out diagnostics);
                bool result = true;
                foreach (StatusCode code in results)
                {
                    if (code != 0)
                    {
                        Exception ex = new Exception(code.ToString());
                        result = false;
                        break;
                    }
                }

                return result;

            }
            catch (Exception e)
            {
                //handle Exception here
                throw e;
            }
        }


        /// <summary>
        /// 写入debug 方法
        /// </summary>
        /// <param name="tags">参数地址</param>
        /// <param name="values">参数值</param>
        /// <returns>结果列表</returns>
        public List<string> WriteNodesDebug(List<string> tags, List<string> values)
        {
            WriteValueCollection valuesToWrite = new WriteValueCollection();

            for (int i = 0; i < tags.Count; i++)
            {
                if (i < values.Count)
                {
                    WriteValue valueToWrite = new WriteValue()
                    {
                        NodeId = new NodeId(tags[i]),
                        AttributeId = Attributes.Value
                    };
                    valueToWrite.Value.Value = values[i];
                    valueToWrite.Value.StatusCode = StatusCodes.Good;
                    valueToWrite.Value.ServerTimestamp = DateTime.MinValue;
                    valueToWrite.Value.SourceTimestamp = DateTime.MinValue;
                    valuesToWrite.Add(valueToWrite);
                }
            }

            // 写入当前的值

            m_session.Write(
                null,
                valuesToWrite,
                out StatusCodeCollection results,
                out DiagnosticInfoCollection diagnosticInfos);

            ClientBase.ValidateResponse(results, valuesToWrite);
            ClientBase.ValidateDiagnosticInfos(diagnosticInfos, valuesToWrite);

            List<string> result = new List<string>();
            foreach (var r in results)
            {
                result.Add(r.ToString());

            }

            return result;
        }

        private void CheckReturnValue(StatusCode status)
        {
            if (!StatusCode.IsGood(status))
                throw new Exception(string.Format("Invalid response from the server. (Response Status: {0})", status));
        }

        #endregion

        #region Monitor Support


        public void MonitoredItemNotificationEventHandler()
        {
        }



        /// <summary>
        /// Create a new subscription
        /// </summary>
        /// <param name="subscriptionKey">订阅名称</param>
        /// <param name="publishInterval">订阅发布间隔 default=1000,发布间隔决定了回调的最小时间间隔，若大于sample 可能会丢值</param>
        /// <param name="sample">监控变量的采样周期 采样周期决定了缓存容量，如果发布周期是1000，采样周期是200，缓存为5才能不会数据丢失</param>
        /// <param name="tags">变量地址</param>
        /// <param name="itemName">变量名称</param>
        /// <param name="handler">回调方法</param>
        public void CreateSubscription(SubscriptionParam wSubscriptionParam, MonitoredItemNotificationEventHandler handler)
        {
            if (wSubscriptionParam == null)
                return;


            if (dic_subscriptions.ContainsKey(wSubscriptionParam.subscriptionKey))
            {
                throw new Exception("Subscription has existed.");
            }

            if (wSubscriptionParam.tags.Count != wSubscriptionParam.itemName.Count)
            {
                throw new Exception("Node count not match");
            }

            try
            {
                Subscription m_subscription = new Subscription(m_session.DefaultSubscription);
                m_subscription.PublishingEnabled = true;
                m_subscription.PublishingInterval = wSubscriptionParam.publishInterval; 
                m_subscription.KeepAliveCount = uint.MaxValue;
                m_subscription.LifetimeCount = uint.MaxValue;
                m_subscription.MaxNotificationsPerPublish = uint.MaxValue;
                m_subscription.Priority = 100;
                m_subscription.DisplayName = wSubscriptionParam.subscriptionKey;

                for (int i = 0; i < wSubscriptionParam.tags.Count; i++)
                {
                    // Add the item and apply any changes to it.
                    string nodeId = wSubscriptionParam.tags[i];
                    string tag = wSubscriptionParam.itemName[i];
                    //if (m_NameSpaceIndex != 6)
                    //    nodeId = new NodeId(nodeId, m_NameSpaceIndex).ToString();
                    AddMonitoredItem(m_subscription, nodeId, tag, wSubscriptionParam.sample, handler);
                }

                m_session.AddSubscription(m_subscription);
                m_subscription.Create();

                lock (dic_subscriptions)
                {
                    if (dic_subscriptions.ContainsKey(wSubscriptionParam.subscriptionKey))
                    {
                        // remove 
                        dic_subscriptions[wSubscriptionParam.subscriptionKey].Delete(true);
                        m_session.RemoveSubscription(dic_subscriptions[wSubscriptionParam.subscriptionKey]);
                        dic_subscriptions[wSubscriptionParam.subscriptionKey].Dispose();
                        dic_subscriptions[wSubscriptionParam.subscriptionKey] = m_subscription;
                    }
                    else
                    {
                        dic_subscriptions.Add(wSubscriptionParam.subscriptionKey, m_subscription);
                    }
                }

            }
            catch (Exception e)
            {
                throw e;
            }


        }


        /// <summary>Ads a monitored item to an existing subscription</summary>
        /// <param name="subscription">The subscription</param>
        /// <param name="nodeIdString">The node Id as string</param>
        /// <param name="itemName">The name of the item to add</param>
        /// <param name="samplingInterval">The sampling interval</param>
        /// <returns>The added item</returns>
        /// <exception cref="Exception">Throws and forwards any exception with short error description.</exception>
        private MonitoredItem AddMonitoredItem(Subscription subscription, string nodeIdString, string itemName, int samplingInterval, MonitoredItemNotificationEventHandler handler)
        {
            int sample = 1;
            int queueSize = 1;
            //simatic net per sample can be  < 100ms
            if (samplingInterval <= 100)
            {
                sample = 1;
                queueSize = (subscription.PublishingInterval / 100) > 1 ? (subscription.PublishingInterval / 100) : 1;
            }
            else
            {
                sample = samplingInterval;
                queueSize = (subscription.PublishingInterval / sample) > 1 ? (subscription.PublishingInterval / sample) : 1;
            }


            //Create a monitored item
            MonitoredItem monitoredItem = new MonitoredItem();
            //Set the name of the item for assigning items and values later on; make sure item names differ
            monitoredItem.DisplayName = itemName;
            //Set the NodeId of the item
            monitoredItem.StartNodeId = nodeIdString;
            //Set the attribute Id (value here)
            monitoredItem.AttributeId = Attributes.Value;
            //Set reporting mode
            monitoredItem.MonitoringMode = MonitoringMode.Reporting;
            //monitoredItem.MonitoringMode = MonitoringMode.Sampling; //这个模式好像就不会触发 handler

            //Set the sampling interval (1 = fastest possible)
            monitoredItem.SamplingInterval = sample;
            //Set the queue size
            monitoredItem.QueueSize = (uint)queueSize;
            //Discard the oldest item after new one has been received
            monitoredItem.DiscardOldest = true;
            //Define event handler for this item and then add to monitoredItem
            monitoredItem.Notification += handler;
            try
            {
                //Add the item to the subscription
                subscription.AddItem(monitoredItem);
                //Apply changes to the subscription
                //subscription.ApplyChanges();
                return monitoredItem;
            }
            catch (Exception e)
            {
                //handle Exception here
                throw e;
            }
        }




        /// <summary>
        /// 移除订阅消息，如果该订阅消息是批量的，也直接移除
        /// </summary>
        /// <param name="key">订阅关键值</param>
        public void RemoveSubscription(string key)
        {
            lock (dic_subscriptions)
            {
                if (dic_subscriptions.ContainsKey(key))
                {
                    // remove 
                    dic_subscriptions[key].Delete(true);
                    m_session.RemoveSubscription(dic_subscriptions[key]);
                    dic_subscriptions[key].Dispose();
                    dic_subscriptions.Remove(key);
                }
            }
        }


        /// <summary>
        /// 移除所有的订阅消息
        /// </summary>
        public void RemoveAllSubscription()
        {
            lock (dic_subscriptions)
            {
                foreach (var item in dic_subscriptions)
                {
                    item.Value.Delete(true);
                    m_session.RemoveSubscription(item.Value);
                    item.Value.Dispose();
                }
                dic_subscriptions.Clear();
            }
        }


        #endregion

        #region Browse Nodes opc statndard
        /// <summary>
        /// Browses the address space and returns the references found.
        /// </summary>
        /// <param name="session">The session.</param>
        /// <param name="nodesToBrowse">The set of browse operations to perform.</param>
        /// <param name="throwOnError">if set to <c>true</c> a exception will be thrown on an error.</param>
        /// <returns>
        /// The references found. Null if an error occurred.
        /// </returns>
        public static ReferenceDescriptionCollection Browse(Session session, BrowseDescriptionCollection nodesToBrowse, bool throwOnError)
        {
            return Browse(session, null, nodesToBrowse, throwOnError);
        }

        /// <summary>
        /// Browses the address space and returns the references found.
        /// </summary>
        public static ReferenceDescriptionCollection Browse(Session session, ViewDescription view, BrowseDescriptionCollection nodesToBrowse, bool throwOnError)
        {
            try
            {
                ReferenceDescriptionCollection references = new ReferenceDescriptionCollection();
                BrowseDescriptionCollection unprocessedOperations = new BrowseDescriptionCollection();

                while (nodesToBrowse.Count > 0)
                {
                    // start the browse operation.
                    BrowseResultCollection results = null;
                    DiagnosticInfoCollection diagnosticInfos = null;

                    session.Browse(
                        null,
                        view,
                        0,
                        nodesToBrowse,
                        out results,
                        out diagnosticInfos);

                    ClientBase.ValidateResponse(results, nodesToBrowse);
                    ClientBase.ValidateDiagnosticInfos(diagnosticInfos, nodesToBrowse);

                    ByteStringCollection continuationPoints = new ByteStringCollection();

                    for (int ii = 0; ii < nodesToBrowse.Count; ii++)
                    {
                        // check for error.
                        if (StatusCode.IsBad(results[ii].StatusCode))
                        {
                            // this error indicates that the server does not have enough simultaneously active 
                            // continuation points. This request will need to be resent after the other operations
                            // have been completed and their continuation points released.
                            if (results[ii].StatusCode == StatusCodes.BadNoContinuationPoints)
                            {
                                unprocessedOperations.Add(nodesToBrowse[ii]);
                            }

                            continue;
                        }

                        // check if all references have been fetched.
                        if (results[ii].References.Count == 0)
                        {
                            continue;
                        }

                        // save results.
                        references.AddRange(results[ii].References);

                        // check for continuation point.
                        if (results[ii].ContinuationPoint != null)
                        {
                            continuationPoints.Add(results[ii].ContinuationPoint);
                        }
                    }

                    // process continuation points.
                    ByteStringCollection revisedContiuationPoints = new ByteStringCollection();

                    while (continuationPoints.Count > 0)
                    {
                        // continue browse operation.
                        session.BrowseNext(
                            null,
                            false,
                            continuationPoints,
                            out results,
                            out diagnosticInfos);

                        ClientBase.ValidateResponse(results, continuationPoints);
                        ClientBase.ValidateDiagnosticInfos(diagnosticInfos, continuationPoints);

                        for (int ii = 0; ii < continuationPoints.Count; ii++)
                        {
                            // check for error.
                            if (StatusCode.IsBad(results[ii].StatusCode))
                            {
                                continue;
                            }

                            // check if all references have been fetched.
                            if (results[ii].References.Count == 0)
                            {
                                continue;
                            }

                            // save results.
                            references.AddRange(results[ii].References);

                            // check for continuation point.
                            if (results[ii].ContinuationPoint != null)
                            {
                                revisedContiuationPoints.Add(results[ii].ContinuationPoint);
                            }
                        }

                        // check if browsing must continue;
                        revisedContiuationPoints = continuationPoints;
                    }

                    // check if unprocessed results exist.
                    nodesToBrowse = unprocessedOperations;
                }

                // return complete list.
                return references;
            }
            catch (Exception exception)
            {
                if (throwOnError)
                {
                    throw new ServiceResultException(exception, StatusCodes.BadUnexpectedError);
                }

                return null;
            }
        }

        /// <summary>
        /// Browses the address space and returns the references found.
        /// </summary>
        /// <param name="session">The session.</param>
        /// <param name="nodeToBrowse">The NodeId for the starting node.</param>
        /// <param name="throwOnError">if set to <c>true</c> a exception will be thrown on an error.</param>
        /// <returns>
        /// The references found. Null if an error occurred.
        /// </returns>
        public static ReferenceDescriptionCollection Browse(Session session, BrowseDescription nodeToBrowse, bool throwOnError)
        {
            return Browse(session, null, nodeToBrowse, throwOnError);
        }

        /// <summary>
        /// Browses the address space and returns the references found.
        /// </summary>
        public static ReferenceDescriptionCollection Browse(Session session, ViewDescription view, BrowseDescription nodeToBrowse, bool throwOnError)
        {
            try
            {
                ReferenceDescriptionCollection references = new ReferenceDescriptionCollection();

                // construct browse request.
                BrowseDescriptionCollection nodesToBrowse = new BrowseDescriptionCollection();
                nodesToBrowse.Add(nodeToBrowse);

                // start the browse operation.
                BrowseResultCollection results = null;
                DiagnosticInfoCollection diagnosticInfos = null;

                session.Browse(
                    null,
                    view,
                    0,
                    nodesToBrowse,
                    out results,
                    out diagnosticInfos);

                ClientBase.ValidateResponse(results, nodesToBrowse);
                ClientBase.ValidateDiagnosticInfos(diagnosticInfos, nodesToBrowse);

                do
                {
                    // check for error.
                    if (StatusCode.IsBad(results[0].StatusCode))
                    {
                        throw new ServiceResultException(results[0].StatusCode);
                    }

                    // process results.
                    for (int ii = 0; ii < results[0].References.Count; ii++)
                    {
                        references.Add(results[0].References[ii]);
                    }

                    // check if all references have been fetched.
                    if (results[0].References.Count == 0 || results[0].ContinuationPoint == null)
                    {
                        break;
                    }

                    // continue browse operation.
                    ByteStringCollection continuationPoints = new ByteStringCollection();
                    continuationPoints.Add(results[0].ContinuationPoint);

                    session.BrowseNext(
                        null,
                        false,
                        continuationPoints,
                        out results,
                        out diagnosticInfos);

                    ClientBase.ValidateResponse(results, continuationPoints);
                    ClientBase.ValidateDiagnosticInfos(diagnosticInfos, continuationPoints);
                }
                while (true);

                //return complete list.
                return references;
            }
            catch (Exception exception)
            {
                if (throwOnError)
                {
                    throw new ServiceResultException(exception, StatusCodes.BadUnexpectedError);
                }

                return null;
            }
        }

        /// <summary>
        /// Browses the address space and returns all of the supertypes of the specified type node.
        /// </summary>
        /// <param name="session">The session.</param>
        /// <param name="typeId">The NodeId for a type node in the address space.</param>
        /// <param name="throwOnError">if set to <c>true</c> a exception will be thrown on an error.</param>
        /// <returns>
        /// The references found. Null if an error occurred.
        /// </returns>
        public static ReferenceDescriptionCollection BrowseSuperTypes(Session session, NodeId typeId, bool throwOnError)
        {
            ReferenceDescriptionCollection supertypes = new ReferenceDescriptionCollection();

            try
            {
                // find all of the children of the field.
                BrowseDescription nodeToBrowse = new BrowseDescription();

                nodeToBrowse.NodeId = typeId;
                nodeToBrowse.BrowseDirection = BrowseDirection.Inverse;
                nodeToBrowse.ReferenceTypeId = ReferenceTypeIds.HasSubtype;
                nodeToBrowse.IncludeSubtypes = false; // more efficient to use IncludeSubtypes=False when possible.
                nodeToBrowse.NodeClassMask = 0; // the HasSubtype reference already restricts the targets to Types. 
                nodeToBrowse.ResultMask = (uint)BrowseResultMask.All;

                ReferenceDescriptionCollection references = Browse(session, nodeToBrowse, throwOnError);

                while (references != null && references.Count > 0)
                {
                    // should never be more than one supertype.
                    supertypes.Add(references[0]);

                    // only follow references within this server.
                    if (references[0].NodeId.IsAbsolute)
                    {
                        break;
                    }

                    // get the references for the next level up.
                    nodeToBrowse.NodeId = (NodeId)references[0].NodeId;
                    references = Browse(session, nodeToBrowse, throwOnError);
                }

                // return complete list.
                return supertypes;
            }
            catch (Exception exception)
            {
                if (throwOnError)
                {
                    throw new ServiceResultException(exception, StatusCodes.BadUnexpectedError);
                }

                return null;
            }
        }

        /// <summary>
        /// Returns the node ids for a set of relative paths.
        /// </summary>
        /// <param name="session">An open session with the server to use.</param>
        /// <param name="startNodeId">The starting node for the relative paths.</param>
        /// <param name="namespacesUris">The namespace URIs referenced by the relative paths.</param>
        /// <param name="relativePaths">The relative paths.</param>
        /// <returns>A collection of local nodes.</returns>
        public static List<NodeId> TranslateBrowsePaths(
            Session session,
            NodeId startNodeId,
            NamespaceTable namespacesUris,
            params string[] relativePaths)
        {
            // build the list of browse paths to follow by parsing the relative paths.
            BrowsePathCollection browsePaths = new BrowsePathCollection();

            if (relativePaths != null)
            {
                for (int ii = 0; ii < relativePaths.Length; ii++)
                {
                    BrowsePath browsePath = new BrowsePath();

                    // The relative paths used indexes in the namespacesUris table. These must be 
                    // converted to indexes used by the server. An error occurs if the relative path
                    // refers to a namespaceUri that the server does not recognize.

                    // The relative paths may refer to ReferenceType by their BrowseName. The TypeTree object
                    // allows the parser to look up the server's NodeId for the ReferenceType.

                    browsePath.RelativePath = RelativePath.Parse(
                        relativePaths[ii],
                        session.TypeTree,
                        namespacesUris,
                        session.NamespaceUris);

                    browsePath.StartingNode = startNodeId;

                    browsePaths.Add(browsePath);
                }
            }

            // make the call to the server.
            BrowsePathResultCollection results;
            DiagnosticInfoCollection diagnosticInfos;

            ResponseHeader responseHeader = session.TranslateBrowsePathsToNodeIds(
                null,
                browsePaths,
                out results,
                out diagnosticInfos);

            // ensure that the server returned valid results.
            Session.ValidateResponse(results, browsePaths);
            Session.ValidateDiagnosticInfos(diagnosticInfos, browsePaths);

            // collect the list of node ids found.
            List<NodeId> nodes = new List<NodeId>();

            for (int ii = 0; ii < results.Count; ii++)
            {
                // check if the start node actually exists.
                if (StatusCode.IsBad(results[ii].StatusCode))
                {
                    nodes.Add(null);
                    continue;
                }

                // an empty list is returned if no node was found.
                if (results[ii].Targets.Count == 0)
                {
                    nodes.Add(null);
                    continue;
                }

                // Multiple matches are possible, however, the node that matches the type model is the
                // one we are interested in here. The rest can be ignored.
                BrowsePathTarget target = results[ii].Targets[0];

                if (target.RemainingPathIndex != UInt32.MaxValue)
                {
                    nodes.Add(null);
                    continue;
                }

                // The targetId is an ExpandedNodeId because it could be node in another server. 
                // The ToNodeId function is used to convert a local NodeId stored in a ExpandedNodeId to a NodeId.
                nodes.Add(ExpandedNodeId.ToNodeId(target.TargetId, session.NamespaceUris));
            }

            // return whatever was found.
            return nodes;
        }
        #endregion

        #region Browse siemens
        /// <summary>Browses the root folder of an OPC UA server.</summary>
        /// <returns>ReferenceDescriptionCollection of found nodes</returns>
        /// <exception cref="Exception">Throws and forwards any exception with short error description.</exception>
        public ReferenceDescriptionCollection BrowseRoot()
        {
            //Create a collection for the browse results
            ReferenceDescriptionCollection referenceDescriptionCollection;
            //Create a continuationPoint
            byte[] continuationPoint;
            try
            {
                //Browse the RootFolder for variables, objects and methods
                m_session.Browse(null, null, ObjectIds.RootFolder, 0u, BrowseDirection.Forward, ReferenceTypeIds.HierarchicalReferences, true, (uint)NodeClass.Variable | (uint)NodeClass.Object | (uint)NodeClass.Method, out continuationPoint, out referenceDescriptionCollection);
                return referenceDescriptionCollection;
            }
            catch (Exception e)
            {
                //handle Exception here
                throw e;
            }
        }

        /// <summary>Browses a node ID provided by a ReferenceDescription</summary>
        /// <param name="refDesc">The ReferenceDescription</param>
        /// <returns>ReferenceDescriptionCollection of found nodes</returns>
        /// <exception cref="Exception">Throws and forwards any exception with short error description.</exception>
        public ReferenceDescriptionCollection BrowseNode(ReferenceDescription refDesc)
        {
            //Create a collection for the browse results
            ReferenceDescriptionCollection referenceDescriptionCollection;
            ReferenceDescriptionCollection nextreferenceDescriptionCollection;
            //Create a continuationPoint
            byte[] continuationPoint;
            byte[] revisedContinuationPoint;
            //Create a NodeId using the selected ReferenceDescription as browsing starting point
            NodeId nodeId = ExpandedNodeId.ToNodeId(refDesc.NodeId, null);
            try
            {
                //Browse from starting point for all object types
                m_session.Browse(null, null, nodeId, 0u, BrowseDirection.Forward, ReferenceTypeIds.HierarchicalReferences, true, 0, out continuationPoint, out referenceDescriptionCollection);

                while (continuationPoint != null)
                {
                    m_session.BrowseNext(null, false, continuationPoint, out revisedContinuationPoint, out nextreferenceDescriptionCollection);
                    referenceDescriptionCollection.AddRange(nextreferenceDescriptionCollection);
                    continuationPoint = revisedContinuationPoint;
                }

                return referenceDescriptionCollection;
            }
            catch (Exception e)
            {
                //handle Exception here
                throw e;
            }
        }

        /// <summary>Browses a node ID provided by a ReferenceDescription</summary>
        /// <param name="refDesc">The ReferenceDescription</param>
        /// <param name="refTypeId">The reference type id</param>
        /// <returns>ReferenceDescriptionCollection of found nodes</returns>
        /// <exception cref="Exception">Throws and forwards any exception with short error description.</exception>
        public ReferenceDescriptionCollection BrowseNodeByReferenceType(ReferenceDescription refDesc, NodeId refTypeId)
        {
            //Create a collection for the browse results
            ReferenceDescriptionCollection referenceDescriptionCollection;
            ReferenceDescriptionCollection nextreferenceDescriptionCollection;
            //Create a continuationPoint
            byte[] continuationPoint;
            byte[] revisedContinuationPoint;
            //Create a NodeId using the selected ReferenceDescription as browsing starting point
            NodeId nodeId = ExpandedNodeId.ToNodeId(refDesc.NodeId, null);
            try
            {
                //Browse from starting point for all object types
                m_session.Browse(null, null, nodeId, 0u, BrowseDirection.Forward, refTypeId, true, 0, out continuationPoint, out referenceDescriptionCollection);

                while (continuationPoint != null)
                {
                    m_session.BrowseNext(null, false, continuationPoint, out revisedContinuationPoint, out nextreferenceDescriptionCollection);
                    referenceDescriptionCollection.AddRange(nextreferenceDescriptionCollection);
                    continuationPoint = revisedContinuationPoint;
                }

                return referenceDescriptionCollection;
            }
            catch (Exception e)
            {
                //handle Exception here
                throw e;
            }
        }
        #endregion

        #region Browse Helper

        /// <summary>
        /// 查找所有能连接的用户定义通道：过滤规则：Objects 下 ，以 “_” 开头的或者 Server 被过滤 
        /// </summary>
        /// <returns>可连接的用户通道</returns>
        public ReferenceDescriptionCollection FoundUserDefineChannels()
        {
            //查找所有根节点，找出object 节点
            ReferenceDescriptionCollection root = BrowseRoot();
            ReferenceDescription objectNode = null;
            foreach (var r in root)
            {
                if (r.BrowseName.Name == "Objects")
                {
                    objectNode = r;
                    break;
                }
            }

            if (objectNode == null)
            {
                throw new ArgumentNullException(nameof(objectNode));
            }

            //从 object 节点中剔除所有不是用户定义的channel 的节点
            ReferenceDescriptionCollection objectReferenceDescriptionsCollection = BrowseNode(objectNode);

            ReferenceDescriptionCollection targetCollection = new ReferenceDescriptionCollection();
            foreach (var c in objectReferenceDescriptionsCollection)
            {
                if (!c.DisplayName.Text.StartsWith("_") && c.DisplayName.Text != "Server")
                {
                    targetCollection.Add(c);
                }
            }

            if (targetCollection.Count < 1)
            {
                throw new Exception("No available channel");
            }

            return targetCollection;
        }

        /// <summary>
        /// 查找某个通道下所有用户定义的设备，过滤规则：以 “_” 开头的 被过滤
        /// </summary>
        /// <param name="channle"></param>
        /// <returns></returns>
        public ReferenceDescriptionCollection FoundUserDefineNodes(ReferenceDescription channle)
        {
            ReferenceDescriptionCollection userNodes = BrowseNode(channle);
            ReferenceDescriptionCollection targetCollection = new ReferenceDescriptionCollection();

            //从用户定义节点中 剔除 _System 和 _Statistics
            foreach (var u in userNodes)
            {
                if (!u.DisplayName.Text.StartsWith("_"))
                {
                    targetCollection.Add(u);
                }
            }

            if (targetCollection.Count < 1)
            {
                throw new Exception("No available Node");
            }

            return targetCollection;

        }

        /// <summary>
        /// 查找某个设备下所有用户定义的变量，过滤规则：只要NodeClass！=Variable 都被过滤
        /// </summary>
        /// <param name="nodeDescription"></param>
        /// <returns></returns>
        public ReferenceDescriptionCollection FoundUserDefineVariables(ReferenceDescription nodeDescription)
        {
            ReferenceDescriptionCollection userVariables = BrowseNode(nodeDescription);

            ReferenceDescriptionCollection targetCollection = new ReferenceDescriptionCollection();
            //从用户定义节点中 剔除 _System 和 _Statistics
            foreach (var v in userVariables)
            {
                if (v.NodeClass == NodeClass.Variable)
                {
                    targetCollection.Add(v);
                }
            }

            if (targetCollection.Count < 1)
            {
                throw new Exception("No available Variable");
            }

            return targetCollection;

        }

        /// <summary>
        /// 获取一个Variable 的指定属性的值
        /// </summary>
        /// <param name="variable">变量</param>
        /// <param name="attributeId">属性</param>
        /// <returns></returns>
        public int GetVariableDataType(ReferenceDescription variable, uint attributeId)
        {
            if (variable == null)
            {
                throw new ArgumentNullException(nameof(variable));
            }


            ReadValueIdCollection readCollections;
            DataValueCollection readResultCollections;
            DiagnosticInfoCollection diag;

            //建立读取变量的 属性标签集合
            BuildAttributeList(variable, out readCollections);

            //按照属性标签集合读取属性对应的值的集合
            try
            {
                m_session.Read(null, 0, Opc.Ua.TimestampsToReturn.Neither, readCollections, out readResultCollections, out diag);
            }
            catch (ServiceResultException e)
            {
                throw new ServiceResultException("An exception occured while reading: " + e.Message);
            }
            catch (Exception e)
            {
                throw new Exception("An exception occured while reading: " + e.Message);
            }

            //查找出指定查询的属性的值
            NodeId attributeValue = null;
            for (int i = 0; i < readCollections.Count - 1; i++)
            {
                if (readCollections[i].AttributeId == attributeId)
                {
                    if (readResultCollections[i].WrappedValue.Value != null)
                    {
                        attributeValue = (NodeId)readResultCollections[i].WrappedValue.Value;
                    }
                    break;
                }
            }

            int type = 0;
            if (attributeValue != null)
            {

                int.TryParse(attributeValue.Identifier.ToString(), out type);
            }

            return type;

        }

        #endregion

        #region attribute


        /// <summary>
        /// 读取节点信息
        /// </summary>
        /// <param name="nodeToRead"></param>
        /// <returns></returns>
        private DataValueCollection ReadAttributes(ReferenceDescription nodeToRead, out ReadValueIdCollection readValueCollection)
        {

            DataValueCollection results;
            DiagnosticInfoCollection diag;

            //ReferenceDescription refDescr = (ReferenceDescription)treeNodeToRead.Tag;
            if (nodeToRead == null)
            {
                throw new ArgumentNullException(nameof(nodeToRead));
            }

            // Create a read request.
            BuildAttributeList(nodeToRead, out readValueCollection);

            try
            {

                m_session.Read(null, 0, Opc.Ua.TimestampsToReturn.Neither,
                    readValueCollection, out results, out diag);
                return results;
            }
            catch (ServiceResultException e)
            {
                throw e;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        private void BuildAttributeList(ReferenceDescription refDescription, out ReadValueIdCollection nodesToRead)
        {
            // Build list of attributes to read.
            nodesToRead = new ReadValueIdCollection();

            // Add default attributes (for all nodeclasses)
            AddAttribute((NodeId)refDescription.NodeId, Attributes.NodeId, nodesToRead);
            AddAttribute((NodeId)refDescription.NodeId, Attributes.NodeClass, nodesToRead);
            AddAttribute((NodeId)refDescription.NodeId, Attributes.BrowseName, nodesToRead);
            AddAttribute((NodeId)refDescription.NodeId, Attributes.DisplayName, nodesToRead);
            AddAttribute((NodeId)refDescription.NodeId, Attributes.Description, nodesToRead);
            AddAttribute((NodeId)refDescription.NodeId, Attributes.WriteMask, nodesToRead);
            AddAttribute((NodeId)refDescription.NodeId, Attributes.UserWriteMask, nodesToRead);

            // Add nodeclass specific attributes
            switch (refDescription.NodeClass)
            {
                case NodeClass.Object:
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.EventNotifier, nodesToRead);
                    break;
                case NodeClass.Variable:
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.Value, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.DataType, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.ValueRank, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.ArrayDimensions, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.AccessLevel, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.UserAccessLevel, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.MinimumSamplingInterval, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.Historizing, nodesToRead);
                    break;
                case NodeClass.Method:
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.Executable, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.UserExecutable, nodesToRead);
                    break;
                case NodeClass.ObjectType:
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.IsAbstract, nodesToRead);
                    break;
                case NodeClass.VariableType:
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.Value, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.DataType, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.ValueRank, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.ArrayDimensions, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.IsAbstract, nodesToRead);
                    break;
                case NodeClass.ReferenceType:
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.IsAbstract, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.Symmetric, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.InverseName, nodesToRead);
                    break;
                case NodeClass.DataType:
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.IsAbstract, nodesToRead);
                    break;
                case NodeClass.View:
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.ContainsNoLoops, nodesToRead);
                    AddAttribute((NodeId)refDescription.NodeId, Attributes.EventNotifier, nodesToRead);
                    break;
                default:
                    break;
            }
        }


        private void AddAttribute(NodeId node, uint attributeId, ReadValueIdCollection nodesToRead)
        {
            // Get NodeId from tree node.
            ReadValueId attributeToRead = new ReadValueId();
            attributeToRead.NodeId = node;
            attributeToRead.AttributeId = attributeId;

            // Populate hashtable if called for the first time
            Hashtable m_hashAttributeNames = new Hashtable();

            m_hashAttributeNames.Add(Attributes.AccessLevel, "AccessLevel");
            m_hashAttributeNames.Add(Attributes.ArrayDimensions, "ArrayDimensions");
            m_hashAttributeNames.Add(Attributes.BrowseName, "BrowseName");
            m_hashAttributeNames.Add(Attributes.ContainsNoLoops, "ContainsNoLoops");
            m_hashAttributeNames.Add(Attributes.DataType, "DataType");
            m_hashAttributeNames.Add(Attributes.Description, "Description");
            m_hashAttributeNames.Add(Attributes.DisplayName, "DisplayName");
            m_hashAttributeNames.Add(Attributes.EventNotifier, "EventNotifier");
            m_hashAttributeNames.Add(Attributes.Executable, "Executable");
            m_hashAttributeNames.Add(Attributes.Historizing, "Historizing");
            m_hashAttributeNames.Add(Attributes.InverseName, "InverseName");
            m_hashAttributeNames.Add(Attributes.IsAbstract, "IsAbstract");
            m_hashAttributeNames.Add(Attributes.MinimumSamplingInterval, "MinimumSamplingInterval");
            m_hashAttributeNames.Add(Attributes.NodeClass, "NodeClass");
            m_hashAttributeNames.Add(Attributes.NodeId, "NodeId");
            m_hashAttributeNames.Add(Attributes.Symmetric, "Symmetric");
            m_hashAttributeNames.Add(Attributes.UserAccessLevel, "UserAccessLevel");
            m_hashAttributeNames.Add(Attributes.UserExecutable, "UserExecutable");
            m_hashAttributeNames.Add(Attributes.UserWriteMask, "UserWriteMask");
            m_hashAttributeNames.Add(Attributes.Value, "Value");
            m_hashAttributeNames.Add(Attributes.ValueRank, "ValueRank");
            m_hashAttributeNames.Add(Attributes.WriteMask, "WriteMask");

            //siemens code
            //if (m_hashAttributeNames == null)
            //{
            //    m_hashAttributeNames = new Hashtable();

            //    m_hashAttributeNames.Add(Attributes.AccessLevel, "AccessLevel");
            //    m_hashAttributeNames.Add(Attributes.ArrayDimensions, "ArrayDimensions");
            //    m_hashAttributeNames.Add(Attributes.BrowseName, "BrowseName");
            //    m_hashAttributeNames.Add(Attributes.ContainsNoLoops, "ContainsNoLoops");
            //    m_hashAttributeNames.Add(Attributes.DataType, "DataType");
            //    m_hashAttributeNames.Add(Attributes.Description, "Description");
            //    m_hashAttributeNames.Add(Attributes.DisplayName, "DisplayName");
            //    m_hashAttributeNames.Add(Attributes.EventNotifier, "EventNotifier");
            //    m_hashAttributeNames.Add(Attributes.Executable, "Executable");
            //    m_hashAttributeNames.Add(Attributes.Historizing, "Historizing");
            //    m_hashAttributeNames.Add(Attributes.InverseName, "InverseName");
            //    m_hashAttributeNames.Add(Attributes.IsAbstract, "IsAbstract");
            //    m_hashAttributeNames.Add(Attributes.MinimumSamplingInterval, "MinimumSamplingInterval");
            //    m_hashAttributeNames.Add(Attributes.NodeClass, "NodeClass");
            //    m_hashAttributeNames.Add(Attributes.NodeId, "NodeId");
            //    m_hashAttributeNames.Add(Attributes.Symmetric, "Symmetric");
            //    m_hashAttributeNames.Add(Attributes.UserAccessLevel, "UserAccessLevel");
            //    m_hashAttributeNames.Add(Attributes.UserExecutable, "UserExecutable");
            //    m_hashAttributeNames.Add(Attributes.UserWriteMask, "UserWriteMask");
            //    m_hashAttributeNames.Add(Attributes.Value, "Value");
            //    m_hashAttributeNames.Add(Attributes.ValueRank, "ValueRank");
            //    m_hashAttributeNames.Add(Attributes.WriteMask, "WriteMask");
            //}

            string ret = (string)m_hashAttributeNames[attributeId];

            attributeToRead.Handle = ret;
            nodesToRead.Add(attributeToRead);
        }

        protected override void RunStart()
        {

            while (ThreadRunState)
            {

                Thread.Sleep(ReconnectPeriod);

                if (!IsConnected)
                {
                    continue;
                }
                this.SubscriptionsCall();
            }

        }

        private void SubscriptionsCall()
        {
            try
            {
                List<BaseMonitoredItem> wBaseMonitoredItemList = new List<BaseMonitoredItem>();

                List<String> wTagList = new List<string>(); 
                foreach (var wCatalog in CatalogList)
                {

                    if (!read_dic_subscriptions.ContainsKey(wCatalog)
                    || read_dic_subscriptions[wCatalog] == null
                    || read_dic_subscriptions[wCatalog].Count <= 0)
                        return;

                    wTagList.Clear();
                    wBaseMonitoredItemList.Clear();

                    foreach (BaseMonitoredItem wBaseMonitoredItem in read_dic_subscriptions[wCatalog])
                    {
                        if (wBaseMonitoredItem.SourceAddress == null || wBaseMonitoredItem.SourceAddress.Length < 7)
                        {
                            continue;
                        }
                        if (!wTagList.Contains(wBaseMonitoredItem.SourceAddress))
                        {
                            wTagList.Add(wBaseMonitoredItem.SourceAddress);
                            wBaseMonitoredItemList.Add(wBaseMonitoredItem);
                        }
                    }
                    if (wTagList.Count <= 0|| wTagList.Count!= wBaseMonitoredItemList.Count)
                    { 
                        continue;
                    }
                    List<DataValue> wDataValueList = this.ReadNodes(wTagList);
                    if (wDataValueList == null || wDataValueList.Count <= 0 || wDataValueList.Count != wBaseMonitoredItemList.Count)
                        continue;

                    for (int i = 0; i < wTagList.Count; i++)
                    {
                        if (wDataValueList == null || wDataValueList.Count < i)
                        {
                            wBaseMonitoredItemList[i].RealValueSet("");
                        }
                        else {
                            wBaseMonitoredItemList[i].RealValueSet(wDataValueList[i].GetObjectValue(wBaseMonitoredItemList[i].DataTypeCode));
                        }
                       

                    }
                     

                }




            }
            catch (Exception ex)
            {
                Utils.Trace("SubscriptionsCall Fanuc Error:{0} ", ex.Message);
                Console.WriteLine(ex.ToString());
            }
        }

        #endregion
    }
}
