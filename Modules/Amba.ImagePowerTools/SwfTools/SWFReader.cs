using System;
using System.IO;
using System.Text;

namespace FlashTools
{
    /// <summary>
    /// Class that makes it easier to read SWF (Flash) files
    /// Written by Michael Swanson (http://blogs.msdn.com/mswanson)
    /// </summary>
    public class SWFReader
    {
        static private UInt32[] bitValues;              // For pre-computed bit values
        static private Single[] powers;                 // For pre-computed fixed-point powers
        private Stream stream = null;                   // Input stream from SWF data source
        private byte bitPosition = 0;                   // Current bit position within byte (only used for reading bit fields)
        private byte currentByte = 0;                   // Value of the current byte (only used for reading bit fields)

        #region Properties

        public Stream Stream
        {
            get { return stream; }
            set { stream = value; }
        }

        #endregion

        #region Constructors

        static SWFReader()
        {
            // Setup bit values for later lookup
            SWFReader.bitValues = new UInt32[32];
            for (byte power = 0; power < 32; power++)
            {
                SWFReader.bitValues[power] = (UInt32)(1 << power);
            }

            // Setup power values for later lookup
            SWFReader.powers = new Single[32];
            for (byte power = 0; power < 32; power++)
            {
                SWFReader.powers[power] = (Single)Math.Pow(2, power - 16);
            }
        }

        public SWFReader(Stream stream)
        {
            this.Stream = stream;
        }

        #endregion
        
        #region Stream manipulation

        public byte ReadByte()
        {
            int byteRead = this.stream.ReadByte();

            this.bitPosition = 8;           // So that ReadBit() knows that we've "used" this byte already

            if (byteRead == -1)
            {
                throw new ApplicationException("Attempted to read past end of stream");
            }

            return (byte)byteRead;
        }

        public bool ReadBit()
        {
            bool result;

            // Do we need another byte?
            if (this.bitPosition > 7)
            {
                this.currentByte = ReadByte();
                this.bitPosition = 0;       // Reset, since we haven't "used" this byte yet
            }

            // Read the current bit
            result = ((this.currentByte & SWFReader.bitValues[(7 - bitPosition)]) != 0);

            // Move to the next bit
            this.bitPosition++;

            return result;
        }

        #endregion

        #region Byte-aligned types (SI8, SI16, SI32, UI8, UI16, UI32, FIXED, STRING)

        // Read an unsigned 8-bit integer
        public byte ReadUI8()
        {
            return ReadByte();
        }

        // Read an array of unsigned 8-bit integers
        public byte[] ReadUI8(int n)
        {
            byte[] result = new byte[n];

            for (int index = 0; index < n; index++)
            {
                result[index] = ReadUI8();
            }

            return result;
        }

        // Read a signed byte
        public sbyte ReadSI8()
        {
            return (sbyte)ReadByte();
        }

        // Read an unsigned 16-bit integer
        public UInt16 ReadUI16()
        {
            UInt16 result = 0;

            result |= (UInt16)ReadByte();
            result |= (UInt16)(ReadByte() << 8);

            return result;
        }

        // Read a signed 16-bit integer
        public Int16 ReadSI16()
        {
            return (Int16)ReadUI16();
        }

        // Read an unsigned 32-bit integer
        public UInt32 ReadUI32()
        {
            UInt32 result = 0;

            result |= (UInt32)ReadByte();
            result |= (UInt32)(ReadByte() << 8);
            result |= (UInt32)(ReadByte() << 16);
            result |= (UInt32)(ReadByte() << 24);

            return result;
        }

        // Read a signed 32-bit integer
        public Int32 ReadSI32()
        {
            return (Int32)ReadUI32();
        }

        // Read a 32-bit 16.16 fixed-point number
        public Single ReadFIXED()
        {
            Single result = 0;

            result += (Single)(ReadByte() * SWFReader.powers[0]);
            result += (Single)(ReadByte() * SWFReader.powers[7]);
            result += (Single)(ReadByte() * SWFReader.powers[15]);
            result += (Single)(ReadByte() * SWFReader.powers[31]);

            return result;
        }

        // Read a string
        // TODO: Is StringBuilder worth it for these small strings?
        public string ReadSTRING()
        {
            string result = string.Empty;
            byte[] character = { 0x00 };

            // Grab characters until we hit 0x00
            do
            {
                character[0] = ReadByte();
                if (character[0] != 0x00)
                {
                    result += Encoding.ASCII.GetString(character);
                }
            } while (character[0] != 0x00);

            return result;
        }

        #endregion

        #region Non-byte-aligned bit types (SB[nBits], UB[nBits], FB[nBits])

        // Read an unsigned bit value
        public UInt32 ReadUB(int nBits)
        {
            UInt32 result = 0;

            // Is there anything to read?
            if (nBits > 0)
            {
                // Calculate value
                for (int index = nBits - 1; index > -1; index--)
                {
                    if (ReadBit())
                    {
                        result |= SWFReader.bitValues[index];
                    }
                }
            }

            return result;
        }

        // Read a signed bit value
        public Int32 ReadSB(int nBits)
        {
            Int32 result = 0;

            // Is there anything to read?
            if (nBits > 0)
            {
                // Is this a negative number (MSB will be set)?
                if (ReadBit())
                {
                    result -= (Int32)SWFReader.bitValues[nBits - 1];
                }

                // Calculate rest of value
                for (int index = nBits - 2; index > -1; index--)
                {
                    if (ReadBit())
                    {
                        result |= (Int32)SWFReader.bitValues[index];
                    }
                }
            }

            return result;
        }

        // Read a signed fixed-point bit value
        // TODO: Math.Pow probably isn't the fastest method of accomplishing this
        public Single ReadFB(int nBits)
        {
            Single result = 0;

            // Is there anything to read?
            if (nBits > 0)
            {
                // Is this a negative number (MSB will be set)?
                if (ReadBit())
                {
                    result -= SWFReader.powers[nBits - 1];

                }

                // Calculate rest of value
                for (int index = nBits - 1; index > 0; index--)
                {
                    if (ReadBit())
                    {
                        result += SWFReader.powers[index - 1];
                    }
                }
            }

            return result;
        }

        #endregion
    }
}
