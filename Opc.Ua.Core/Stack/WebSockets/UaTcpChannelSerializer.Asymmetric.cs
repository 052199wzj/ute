/* Copyright (c) 1996-2016, OPC Foundation. All rights reserved.

   The source code in this file is covered under a dual-license scenario:
     - RCL: for OPC Foundation members in good-standing
     - GPL V2: everybody else

   RCL license terms accompanied with this source code. See http://opcfoundation.org/License/RCL/1.00/

   GNU General Public License as published by the Free Software Foundation;
   version 2 of the License are accompanied with this source code. See http://opcfoundation.org/License/GPLv2

   This source code is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/

using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.IO;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace Opc.Ua.Bindings
{
    /// <summary>
    /// Manages the server side of a UA TCP channel.
    /// </summary>
    public partial class UaTcpChannelSerializer
    {
        #region IUaTcpSecureChannel Members
        /// <summary>
        /// Returns the endpoint description selected by the client.
        /// </summary>
        public EndpointDescription EndpointDescription
        {
            get { return m_selectedEndpoint; }
            set { m_selectedEndpoint = value; m_discoveryOnly = false; }
        }
        #endregion

        #region General Cryptographic Methods and Properties
        /// <summary>
        /// The certificate for the server.
        /// </summary>
        public X509Certificate2 ClientCertificate
        {
            get { return m_clientCertificate; }
        }
                
        /// <summary>
        /// The certificate for the server.
        /// </summary>
        public X509Certificate2 ServerCertificate
        {
            get { return m_serverCertificate; }
        }
                
        /// <summary>
        /// The security mode used with the channel.
        /// </summary>
        public MessageSecurityMode SecurityMode
        {
            get { return m_securityMode; }
        }
                
        /// <summary>
        /// The security policy used with the channel.
        /// </summary>
        public string SecurityPolicyUri
        {
            get { return m_securityPolicyUri; }
        }
                
        /// <summary>
        /// Whether the channel is restricted to discovery operations.
        /// </summary>
        protected bool DiscoveryOnly
        {
            get 
            { 
                return m_discoveryOnly; 
            }
        }
                
        /// <summary>
        /// Creates a new nonce.
        /// </summary>
        protected byte[] CreateNonce()
        {
            if (m_random == null)
            {
                m_random = new RNGCryptoServiceProvider();
            }
            
            byte[] bytes = new byte[GetNonceLength()];
            m_random.GetBytes(bytes);
            return bytes;
        }

        /// <summary>
        /// Returns the thumbprint as a uppercase string.
        /// </summary>
        protected static string GetThumbprintString(byte[] thumbprint)
        {
            if (thumbprint == null)
            {
                return null;
            }

            StringBuilder builder = new StringBuilder(thumbprint.Length*2);

            for (int ii = 0; ii < thumbprint.Length; ii++)
            {
                builder.AppendFormat("{0:X2}", thumbprint[ii]);
            }

            return builder.ToString();
        }

        /// <summary>
        /// Returns the thumbprint as a uppercase string.
        /// </summary>
        protected static byte[] GetThumbprintBytes(string thumbprint)
        {
            if (thumbprint == null)
            {
                return null;
            }

            byte[] bytes = new byte[thumbprint.Length/2];

            for (int ii = 0; ii < thumbprint.Length-1; ii += 2)
            {
                bytes[ii/2] = Convert.ToByte(thumbprint.Substring(ii, 2), 16);
            }

            return bytes;
        }
        
        /// <summary>
        /// Compares two certificates.
        /// </summary>
        protected static void CompareCertificates(X509Certificate2 expected, X509Certificate2 actual, bool allowNull)
        {
            bool equal = true;
            
            if (expected == null)
            {
                equal = actual == null;
                
                // accept everything if no expected certificate and nulls are allowed.
                if (allowNull)
                {
                    equal = true;
                }
            }
            else if (actual == null)
            {
                equal = allowNull;
            }
            else if (!Utils.IsEqual(expected.GetRawCertData(), actual.GetRawCertData()))
            {
                equal = false;
            }

            if (!equal)
            {
                throw ServiceResultException.Create(
                    StatusCodes.BadCertificateInvalid, 
                    "Certificate mismatch. Expecting '{0}'/{1},. Received '{2}'/{3}.",
                    (expected != null) ? expected.Subject : "(null)",
                    (expected != null) ? expected.Thumbprint : "(null)",
                    (actual != null) ? actual.Subject : "(null)",
                    (actual != null) ? actual.Thumbprint : "(null)");
            }
        }
        #endregion

        #region Asymmetric Cryptography Functions
        /// <summary>
        /// Returns the length of the symmetric encryption key.
        /// </summary>
        protected int GetNonceLength()
        {
            switch (SecurityPolicyUri)
            {
                case SecurityPolicies.Basic128Rsa15:
                {
                    return 16;
                }

                case SecurityPolicies.Basic256:
                {
                    return 32;
                }

                default:
                case SecurityPolicies.None:
                {
                    return 0;
                }
            }
        }

        /// <summary>
        /// Validates the nonce.
        /// </summary>
        protected bool ValidateNonce(byte[] nonce)
        {
            // no nonce needed for no security.
            if (SecurityMode == MessageSecurityMode.None)
            {
                return true;
            }

            // check the length.
            if (nonce == null || nonce.Length < GetNonceLength())
            {
                return false;
            }

            // try to catch programming errors by rejecting nonces with all zeros.
            for (int ii = 0; ii < nonce.Length; ii++)
            {
                if (nonce[ii] != 0)
                {
                    return true;
                }
            }
                   
            return false;
        }

        /// <summary>
        /// Returns the plain text block size for key in the specified certificate.
        /// </summary>
        protected int GetPlainTextBlockSize(X509Certificate2 receiverCertificate)
        {
            switch (SecurityPolicyUri)
            {
                case SecurityPolicies.Basic256:
                {
                    return Rsa_GetPlainTextBlockSize(receiverCertificate, true);
                }

                case SecurityPolicies.Basic128Rsa15:
                {
                    return Rsa_GetPlainTextBlockSize(receiverCertificate, false);
                }

                default:
                case SecurityPolicies.None:
                {
                    return 1;
                }
            }
        }

        /// <summary>
        /// Returns the cipher text block size for key in the specified certificate.
        /// </summary>
        protected int GetCipherTextBlockSize(X509Certificate2 receiverCertificate)
        {
            switch (SecurityPolicyUri)
            {
                case SecurityPolicies.Basic256:
                {
                    return Rsa_GetCipherTextBlockSize(receiverCertificate, true);
                }

                case SecurityPolicies.Basic128Rsa15:
                {
                    return Rsa_GetCipherTextBlockSize(receiverCertificate, false);
                }

                default:
                case SecurityPolicies.None:
                {
                    return 1;
                }
            }
        }

        /// <summary>
        /// Calculates the size of the asymmetric security header.
        /// </summary>
        protected int GetAsymmetricHeaderSize(
            string           securityPolicyUri,
            X509Certificate2 senderCertificate)
        {        
            int headerSize = 0;

            headerSize += TcpMessageLimits.BaseHeaderSize;
            headerSize += TcpMessageLimits.StringLengthSize;

            if (securityPolicyUri != null)
            {
                headerSize += new UTF8Encoding().GetByteCount(securityPolicyUri);
            }

            headerSize += TcpMessageLimits.StringLengthSize;
            headerSize += TcpMessageLimits.StringLengthSize;

            if (SecurityMode != MessageSecurityMode.None)
            {
                headerSize += senderCertificate.RawData.Length;
                headerSize += TcpMessageLimits.CertificateThumbprintSize;
            }

            if (headerSize >= SendBufferSize - TcpMessageLimits.SequenceHeaderSize - GetAsymmetricSignatureSize(senderCertificate) - 1)
            {
                throw ServiceResultException.Create(
                    StatusCodes.BadInternalError, 
                    "AsymmetricSecurityHeader is {0} bytes which is too large for the send buffer size of {1} bytes.",
                    headerSize,
                    SendBufferSize);
            }

            return headerSize;
        }

        /// <remarks/>
        protected int GetAsymmetricHeaderSize(
            string securityPolicyUri,
            X509Certificate2 senderCertificate,
            int senderCertificateSize)
        {
            int headerSize = 0;

            headerSize += TcpMessageLimits.BaseHeaderSize;
            headerSize += TcpMessageLimits.StringLengthSize;

            if (securityPolicyUri != null)
            {
                headerSize += new UTF8Encoding().GetByteCount(securityPolicyUri);
            }

            headerSize += TcpMessageLimits.StringLengthSize;
            headerSize += TcpMessageLimits.StringLengthSize;

            if (SecurityMode != MessageSecurityMode.None)
            {
                headerSize += senderCertificateSize;
                headerSize += TcpMessageLimits.CertificateThumbprintSize;
            }

            if (headerSize >= SendBufferSize - TcpMessageLimits.SequenceHeaderSize - GetAsymmetricSignatureSize(senderCertificate) - 1)
            {
                throw ServiceResultException.Create(
                    StatusCodes.BadInternalError,
                    "AsymmetricSecurityHeader is {0} bytes which is too large for the send buffer size of {1} bytes.",
                    headerSize,
                    SendBufferSize);
            }

            return headerSize;
        }

        /// <remarks/>
        protected int GetAsymmetricSignatureSize(X509Certificate2 senderCertificate)
        {
            switch (SecurityPolicyUri)
            {
                case SecurityPolicies.Basic256:
                case SecurityPolicies.Basic128Rsa15:
                {
                    return RsaPkcs15Sha1_GetSignatureLength(senderCertificate);
                }

                default:
                case SecurityPolicies.None:
                {
                    return 0;
                }
            }
        }

        /// <remarks/>
        protected void WriteAsymmetricMessageHeader(
            BinaryEncoder      encoder,
            uint               messageType,
            uint               secureChannelId,
            string             securityPolicyUri,
            X509Certificate2   senderCertificate, 
            X509Certificate2   receiverCertificate)
        {
            int start = encoder.Position;

            encoder.WriteUInt32(null, messageType);
            encoder.WriteUInt32(null, 0);
            encoder.WriteUInt32(null, secureChannelId);
            encoder.WriteString(null, securityPolicyUri);

            if (SecurityMode != MessageSecurityMode.None)
            {
                encoder.WriteByteString(null, senderCertificate.RawData);
                encoder.WriteByteString(null, GetThumbprintBytes(receiverCertificate.Thumbprint));
            }
            else
            {
                encoder.WriteByteString(null, null);
                encoder.WriteByteString(null, null);
            }
            
            if (encoder.Position - start > SendBufferSize)
            {
                throw ServiceResultException.Create(
                    StatusCodes.BadInternalError, 
                    "AsymmetricSecurityHeader is {0} bytes which is too large for the send buffer size of {1} bytes.",
                    encoder.Position - start,
                    SendBufferSize);
            }
        }

        private int GetMaxSenderCertificateSize(X509Certificate2 senderCertificate, string securityPolicyUri)
        {
            int occupiedSize = TcpMessageLimits.BaseHeaderSize //base header size
                + TcpMessageLimits.StringLengthSize;           //security policy uri length

            if (securityPolicyUri != null)
            {
                occupiedSize += new UTF8Encoding().GetByteCount(securityPolicyUri);   //security policy uri size
            }

            occupiedSize += TcpMessageLimits.StringLengthSize; //SenderCertificateLength
            occupiedSize += TcpMessageLimits.StringLengthSize; //ReceiverCertificateThumbprintLength

            occupiedSize += TcpMessageLimits.CertificateThumbprintSize; //ReceiverCertificateThumbprint

            occupiedSize += TcpMessageLimits.SequenceHeaderSize; //SequenceHeader size
            occupiedSize += TcpMessageLimits.MinBodySize;        //Minimum body size

            occupiedSize += GetAsymmetricSignatureSize(senderCertificate);

            return SendBufferSize - occupiedSize;
        }

        /// <remarks/>
        protected BufferCollection WriteAsymmetricMessage(
            uint               messageType,
            uint               requestId, 
            X509Certificate2   senderCertificate,
            X509Certificate2   receiverCertificate,
            ArraySegment<byte> messageBody)
        {                
            bool success = false;
            BufferCollection chunksToSend = new BufferCollection();

            byte[] buffer = BufferManager.TakeBuffer(SendBufferSize, "WriteAsymmetricMessage");

            try
            {
                int headerSize = GetAsymmetricHeaderSize(SecurityPolicyUri, senderCertificate);
                int signatureSize = GetAsymmetricSignatureSize(senderCertificate);
                                    
                BinaryEncoder encoder = new BinaryEncoder(buffer, 0, SendBufferSize, Quotas.MessageContext);

                WriteAsymmetricMessageHeader(
                    encoder,
                    messageType | TcpMessageType.Intermediate,
                    ChannelId,
                    SecurityPolicyUri,
                    senderCertificate,
                    receiverCertificate);
                
                // save the header.
                ArraySegment<byte> header = new ArraySegment<byte>(buffer, 0, headerSize);
                
                // calculate the space available.
                int plainTextBlockSize = GetPlainTextBlockSize(receiverCertificate);
                int cipherTextBlockSize = GetCipherTextBlockSize(receiverCertificate);
                int maxCipherTextSize = SendBufferSize - headerSize;
                int maxCipherBlocks = maxCipherTextSize/cipherTextBlockSize; 
                int maxPlainTextSize = maxCipherBlocks*plainTextBlockSize;
                int maxPayloadSize = maxPlainTextSize - signatureSize - 1 - TcpMessageLimits.SequenceHeaderSize;

                int bytesToWrite = messageBody.Count;
                int startOfBytes = messageBody.Offset;

                while (bytesToWrite > 0)
                {
                    encoder.WriteUInt32(null, GetNewSequenceNumber());
                    encoder.WriteUInt32(null, requestId);

                    int payloadSize = bytesToWrite;

                    if (payloadSize > maxPayloadSize)
                    {
                        payloadSize = maxPayloadSize;
                    }
                    else
                    {
                        UpdateMessageType(buffer, 0, messageType | TcpMessageType.Final);
                    }

                    // write the message body.
                    encoder.WriteRawBytes(messageBody.Array, messageBody.Offset+startOfBytes, payloadSize);

                    // calculate the amount of plain text to encrypt.
                    int plainTextSize = encoder.Position - headerSize + signatureSize;
                                    
                    // calculate the padding.
                    int padding = 0;         
           
                    if (SecurityMode != MessageSecurityMode.None)
                    {
                        if (receiverCertificate.PublicKey.Key.KeySize <= TcpMessageLimits.KeySizeExtraPadding)
                        {
                            // need to reserve one byte for the padding.
                            plainTextSize++;

                            if (plainTextSize % plainTextBlockSize != 0)
                            {
                                padding = plainTextBlockSize - (plainTextSize % plainTextBlockSize);
                            }

                            encoder.WriteByte(null, (byte)padding);
                            for (int ii = 0; ii < padding; ii++)
                            {
                                encoder.WriteByte(null, (byte)padding);
                            }
                        }
                        else
                        {
                            // need to reserve one byte for the padding.
                            plainTextSize++;
                            // need to reserve one byte for the extrapadding.
                            plainTextSize++;

                            if (plainTextSize % plainTextBlockSize != 0)
                            {
                                padding = plainTextBlockSize - (plainTextSize % plainTextBlockSize);
                            }

                            byte paddingSize = (byte)(padding & 0xff);
                            byte extraPaddingByte = (byte)((padding >> 8) & 0xff);

                            encoder.WriteByte(null, paddingSize);
                            for (int ii = 0; ii < padding; ii++)
                            {
                                encoder.WriteByte(null, (byte)paddingSize);
                            }
                            encoder.WriteByte(null, extraPaddingByte);
                        }

                        // update the plaintext size with the padding size.
                        plainTextSize += padding;
                    }
                      
                    // calculate the number of block to encrypt.
                    int encryptedBlocks = plainTextSize/plainTextBlockSize;

                    // calculate the size of the encrypted data.
                    int cipherTextSize = encryptedBlocks*cipherTextBlockSize;
                    
                    // put the message size after encryption into the header.
                    UpdateMessageSize(buffer, 0, cipherTextSize + headerSize);

                    // write the signature.
                    byte[] signature = Sign(new ArraySegment<byte>(buffer, 0, encoder.Position), senderCertificate);
                                   
                    if (signature != null)
                    {
                        encoder.WriteRawBytes(signature, 0, signature.Length);
                    }
                    
                    int messageSize = encoder.Close();

                    // encrypt the data.
                    ArraySegment<byte> encryptedBuffer = Encrypt(
                        new ArraySegment<byte>(buffer, headerSize, messageSize-headerSize), 
                        header, 
                        receiverCertificate);

                    // check for math errors due to code bugs.
                    if (encryptedBuffer.Count != cipherTextSize + headerSize)
                    {
                        throw new InvalidDataException("Actual message size is not the same as the predicted message size.");
                    }

                    // save chunk.
                    chunksToSend.Add(encryptedBuffer);

                    bytesToWrite -= payloadSize;
                    startOfBytes += payloadSize;

                    // reset the encoder to write the plaintext for the next chunk into the same buffer.
                    if (bytesToWrite > 0)
                    {
                        MemoryStream ostrm = new MemoryStream(buffer, 0, SendBufferSize);
                        ostrm.Seek(header.Count, SeekOrigin.Current);
                        encoder = new BinaryEncoder(ostrm, Quotas.MessageContext);
                    }
                }

                // ensure the buffers don't get clean up on exit.
                success = true;
                return chunksToSend;
            }
            finally
            {
                BufferManager.ReturnBuffer(buffer, "WriteAsymmetricMessage");  

                if (!success)
                {
                    chunksToSend.Release(BufferManager, "WriteAsymmetricMessage");
                }
            }
        }

        /// <remarks/>
        protected void ReadAsymmetricMessageHeader(
            BinaryDecoder        decoder,
            X509Certificate2     receiverCertificate,
            out uint             secureChannelId,            
            out X509Certificate2 senderCertificate,
            out string           securityPolicyUri)
        {        
            senderCertificate = null;

            uint messageType = decoder.ReadUInt32(null);
            uint messageSize = decoder.ReadUInt32(null);

            // decode security header.
            byte[] certificateData = null;
            byte[] thumbprintData = null;

            try
            {
                secureChannelId = decoder.ReadUInt32(null);
                securityPolicyUri = decoder.ReadString(null, TcpMessageLimits.MaxSecurityPolicyUriSize);
                certificateData = decoder.ReadByteString(null, TcpMessageLimits.MaxCertificateSize);
                thumbprintData = decoder.ReadByteString(null, TcpMessageLimits.CertificateThumbprintSize);
            }
            catch (Exception e)
            {
                throw ServiceResultException.Create(
                    StatusCodes.BadSecurityChecksFailed, 
                    e,
                    "The asymmetric security header could not be parsed.");
            }
            
            // verify sender certificate.
            if (certificateData != null && certificateData.Length > 0)
            {
                senderCertificate = CertificateFactory.Create(certificateData, true);

                try
                {
                    string thumbprint = senderCertificate.Thumbprint;

                    if (thumbprint == null)
                    {
                        throw ServiceResultException.Create(StatusCodes.BadCertificateInvalid, "Invalid certificate thumbprint.");
                    }
                }
                catch (Exception e)
                {
                    throw ServiceResultException.Create(StatusCodes.BadCertificateInvalid, e, "The sender's certificate could not be parsed.");
                }
            }
            else
            {
                if (securityPolicyUri != SecurityPolicies.None)
                {
                    throw ServiceResultException.Create(StatusCodes.BadCertificateInvalid, "The sender's certificate was not specified.");
                }
            }

            // verify receiver thumbprint.
            if (thumbprintData != null && thumbprintData.Length > 0)
            {
                if (receiverCertificate.Thumbprint.ToUpperInvariant() != GetThumbprintString(thumbprintData))
                {
                    throw ServiceResultException.Create(StatusCodes.BadCertificateInvalid, "The receiver's certificate thumbprint is not valid.");
                }
            }
            else
            {
                if (securityPolicyUri != SecurityPolicies.None)
                {
                    throw ServiceResultException.Create(StatusCodes.BadCertificateInvalid, "The receiver's certificate thumbprint was not specified.");
                }
            }
        }

        /// <remarks/>
        protected void ReviseSecurityMode(bool firstCall, MessageSecurityMode requestedMode)
        {
             bool supported = false;

            // server may support multiple security modes - check if the one the client used is supported.
            if (firstCall && !m_discoveryOnly)
            {
                foreach (EndpointDescription endpoint in m_endpoints)
                {
                    if (endpoint.SecurityMode == requestedMode)
                    {
                        if (requestedMode == MessageSecurityMode.None || endpoint.SecurityPolicyUri == m_securityPolicyUri)
                        {
                            m_securityMode = endpoint.SecurityMode;
                            m_selectedEndpoint = endpoint;
                            supported = true;
                            break;
                        }
                    }
                }
            }

            if (!supported)
            {
                throw ServiceResultException.Create(StatusCodes.BadSecurityModeRejected, "Security mode is not acceptable to the server.");
            }
        }

        /// <remarks/>
        protected bool SetEndpointUrl(string endpointUrl)
        {
            Uri url = Utils.ParseUri(endpointUrl);

            if (url == null)
            {
                return false;
            }

            if (m_endpoints != null)
            {
                foreach (EndpointDescription endpoint in m_endpoints)
                {
                    Uri expectedUrl = Utils.ParseUri(endpoint.EndpointUrl);

                    if (expectedUrl == null)
                    {
                        continue;
                    }

                    if (expectedUrl.Scheme != url.Scheme)
                    {
                        continue;
                    }

                    m_securityMode = endpoint.SecurityMode;
                    m_securityPolicyUri = endpoint.SecurityPolicyUri;
                    m_selectedEndpoint = endpoint;
                    return true;
                }
            }

            return true;
        }

        /// <summary>
        /// Processes an OpenSecureChannel request message.
        /// </summary>
        protected ArraySegment<byte> ReadAsymmetricMessage(
            ArraySegment<byte>   buffer,
            X509Certificate2     receiverCertificate,
            out uint             channelId,
            out X509Certificate2 senderCertificate,
            out uint             requestId,
            out uint             sequenceNumber)
        {            
            BinaryDecoder decoder = new BinaryDecoder(buffer.Array, buffer.Offset, buffer.Count, Quotas.MessageContext);
            
            string securityPolicyUri = null;

            ReadAsymmetricMessageHeader(
                decoder,
                receiverCertificate,
                out channelId,
                out senderCertificate,
                out securityPolicyUri);

            // validate the sender certificate.
            if (senderCertificate != null && Quotas.CertificateValidator != null && securityPolicyUri != SecurityPolicies.None)
            {
                Quotas.CertificateValidator.Validate(senderCertificate);
            }
                 
            // check if this is the first open secure channel request.
            if (!m_uninitialized)
            {
                if (securityPolicyUri != m_securityPolicyUri)
                {
                    throw ServiceResultException.Create(StatusCodes.BadSecurityPolicyRejected, "Cannot change the security policy after creating the channnel.");
                }
            }
            else
            {
                // find a matching endpoint description.
                if (m_endpoints != null)
                {
                    foreach (EndpointDescription endpoint in m_endpoints)
                    {       
                        // There may be multiple endpoints with the same securityPolicyUri.
                        // Just choose the first one that matches. This choice will be re-examined
                        // When the OpenSecureChannel request body is processed.
                        if (endpoint.SecurityPolicyUri == securityPolicyUri || (securityPolicyUri == SecurityPolicies.None && endpoint.SecurityMode == MessageSecurityMode.None))
                        {
                            m_securityMode      = endpoint.SecurityMode;
                            m_securityPolicyUri = securityPolicyUri;
                            m_discoveryOnly     = false;
                            m_uninitialized     = false;
                            m_selectedEndpoint  = endpoint;
                            
                            // recalculate the key sizes.
                            CalculateSymmetricKeySizes();
                            break;
                        }
                    }
                }
                
                // allow a discovery only channel with no security if policy not suppported
                if (m_uninitialized)
                {
                    if (securityPolicyUri != SecurityPolicies.None)
                    {
                        throw ServiceResultException.Create(StatusCodes.BadSecurityPolicyRejected, "The security policy is not supported.");
                    }

                    m_securityMode      = MessageSecurityMode.None;
                    m_securityPolicyUri = SecurityPolicies.None;
                    m_discoveryOnly     = true;
                    m_uninitialized     = false;      
                    m_selectedEndpoint  = null;
                }
            }

            int headerSize = decoder.Position;

            // decrypt the body.
            ArraySegment<byte> plainText = Decrypt(
                new ArraySegment<byte>(buffer.Array, buffer.Offset + headerSize, buffer.Count - headerSize),
                new ArraySegment<byte>(buffer.Array, buffer.Offset, headerSize),
                receiverCertificate);
            
            // extract signature.
            int signatureSize = GetAsymmetricSignatureSize(senderCertificate);

            byte[] signature = new byte[signatureSize];

            for (int ii = 0; ii < signatureSize; ii++)
            {
                signature[ii] = plainText.Array[plainText.Offset+plainText.Count-signatureSize+ii];
            }
            
            // verify the signature.
            ArraySegment<byte> dataToVerify = new ArraySegment<byte>(plainText.Array, plainText.Offset, plainText.Count-signatureSize);
                                    
            if (!Verify(dataToVerify, signature, senderCertificate))
            {                
                throw ServiceResultException.Create(StatusCodes.BadSecurityChecksFailed, "Could not verify the signature on the message.");
            }

            // verify padding.
            int paddingCount = 0;

            if (SecurityMode != MessageSecurityMode.None)
            {
                int paddingEnd = -1;
                if (receiverCertificate.PublicKey.Key.KeySize > TcpMessageLimits.KeySizeExtraPadding)
                {
                    paddingEnd = plainText.Offset + plainText.Count - signatureSize - 1;
                    paddingCount = plainText.Array[paddingEnd - 1] + plainText.Array[paddingEnd] * 256;

                    //parse until paddingStart-1; the last one is actually the extrapaddingsize
                    for (int ii = paddingEnd - paddingCount; ii < paddingEnd; ii++)
                    {
                        if (plainText.Array[ii] != plainText.Array[paddingEnd - 1])
                        {
                            throw ServiceResultException.Create(StatusCodes.BadSecurityChecksFailed, "Could not verify the padding in the message.");
                        }
                    }
                }
                else
                {
                    paddingEnd = plainText.Offset + plainText.Count - signatureSize - 1;
                    paddingCount = plainText.Array[paddingEnd];

                    for (int ii = paddingEnd - paddingCount; ii < paddingEnd; ii++)
                    {
                        if (plainText.Array[ii] != plainText.Array[paddingEnd])
                        {
                            throw ServiceResultException.Create(StatusCodes.BadSecurityChecksFailed, "Could not verify the padding in the message.");
                        }
                    }
                }

                paddingCount++;
            }

            // decode message.
            decoder = new BinaryDecoder(
                plainText.Array, 
                plainText.Offset + headerSize, 
                plainText.Count - headerSize, 
                Quotas.MessageContext);
            
            sequenceNumber = decoder.ReadUInt32(null);
            requestId = decoder.ReadUInt32(null);

            headerSize += decoder.Position;
            decoder.Close();

            // Utils.Trace("Security Policy: {0}", SecurityPolicyUri);
            // Utils.Trace("Sender Certificate: {0}", (senderCertificate != null)?senderCertificate.Subject:"(none)");

            // return the body.
            return new ArraySegment<byte>(
                plainText.Array, 
                plainText.Offset + headerSize, 
                plainText.Count - headerSize - signatureSize - paddingCount);
        }

        /// <summary>
        /// Adds an asymmetric signature to the end of the buffer.
        /// </summary>
        /// <remarks>
        /// Start and count specify the block of data to be signed. 
        /// The padding and signature must be written to the stream wrapped by the encoder.
        /// </remarks>
        protected byte[] Sign(
            ArraySegment<byte> dataToSign,
            X509Certificate2   senderCertificate)
        {
            switch (SecurityPolicyUri)
            {
                default:
                case SecurityPolicies.None:
                {
                    return null;
                }

                case SecurityPolicies.Basic256:
                case SecurityPolicies.Basic128Rsa15:
                {
                    return RsaPkcs15Sha1_Sign(dataToSign, senderCertificate);
                }
            }
        }

        /// <summary>
        /// Verifies an asymmetric signature at the end of the buffer.
        /// </summary>
        /// <remarks>
        /// Start and count specify the block of data including the signature and padding. 
        /// The current security policy uri and sender certificate specify the size of the signature.
        /// This call also verifies that the padding is correct.
        /// </remarks>
        protected bool Verify(
            ArraySegment<byte> dataToVerify,
            byte[]             signature,
            X509Certificate2   senderCertificate)
        {       
            // verify signature.
            switch (SecurityPolicyUri)
            {
                case SecurityPolicies.None:
                {
                    return true;
                }

                case SecurityPolicies.Basic128Rsa15:
                case SecurityPolicies.Basic256:
                {
                    return RsaPkcs15Sha1_Verify(dataToVerify, signature, senderCertificate);
                }

                default:
                {
                    return false;
                }
            }
        }

        /// <summary>
        /// Encrypts the buffer using asymmetric encryption.
        /// </summary>
        /// <remarks>
        /// Start and count specify the block of data to be encrypted.
        /// The caller must ensure that count is a multiple of the input block size for the current cipher.
        /// The header specifies unencrypted data that must be copied to the output. 
        /// </remarks>
        protected ArraySegment<byte> Encrypt(
            ArraySegment<byte> dataToEncrypt,
            ArraySegment<byte> headerToCopy,
            X509Certificate2   receiverCertificate)
        {      
            switch (SecurityPolicyUri)
            {
                default:
                case SecurityPolicies.None:
                {
                    byte[] encryptedBuffer = BufferManager.TakeBuffer(SendBufferSize, "Encrypt");

                    Array.Copy(headerToCopy.Array, headerToCopy.Offset, encryptedBuffer, 0, headerToCopy.Count);
                    Array.Copy(dataToEncrypt.Array, dataToEncrypt.Offset, encryptedBuffer, headerToCopy.Count, dataToEncrypt.Count);

                    return new ArraySegment<byte>(encryptedBuffer, 0, dataToEncrypt.Count+headerToCopy.Count);
                }

                case SecurityPolicies.Basic256:
                {
                    return Rsa_Encrypt(dataToEncrypt, headerToCopy, receiverCertificate, true);
                }

                case SecurityPolicies.Basic128Rsa15:
                {
                    return Rsa_Encrypt(dataToEncrypt, headerToCopy, receiverCertificate, false);
                }
            }
        }

        /// <summary>
        /// Decrypts the buffer using asymmetric encryption.
        /// </summary>
        /// <remarks>
        /// Start and count specify the block of data to be decrypted.
        /// The header specifies unencrypted data that must be copied to the output. 
        /// </remarks>
        protected ArraySegment<byte> Decrypt(
            ArraySegment<byte> dataToDecrypt,
            ArraySegment<byte> headerToCopy,
            X509Certificate2   receiverCertificate)
        {
            switch (SecurityPolicyUri)
            {
                default:
                case SecurityPolicies.None:
                {
                    byte[] decryptedBuffer = BufferManager.TakeBuffer(SendBufferSize, "Decrypt");

                    Array.Copy(headerToCopy.Array, headerToCopy.Offset, decryptedBuffer, 0, headerToCopy.Count);
                    Array.Copy(dataToDecrypt.Array, dataToDecrypt.Offset, decryptedBuffer, headerToCopy.Count, dataToDecrypt.Count);

                    return new ArraySegment<byte>(decryptedBuffer, 0, dataToDecrypt.Count+headerToCopy.Count);
                }

                case SecurityPolicies.Basic256:
                {
                    return Rsa_Decrypt(dataToDecrypt, headerToCopy, receiverCertificate, true);
                }

                case SecurityPolicies.Basic128Rsa15:
                {
                    return Rsa_Decrypt(dataToDecrypt, headerToCopy, receiverCertificate, false);
                }
            }
        }
        #endregion
    }
}
