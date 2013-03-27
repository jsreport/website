using System;

namespace FlashTools
{
    public class Rect
    {
        private int xMin;
        private int xMax;
        private int yMin;
        private int yMax;

        #region Properties

        public int XMin
        {
            get { return xMin; }
        }

        public int XMax
        {
            get { return xMax; }
        }

        public int YMin
        {
            get { return yMin; }
        }

        public int YMax
        {
            get { return yMax; }
        }

        #endregion

        #region Constructors

        public Rect(SWFReader swf)
        {
            int nBits = (int)swf.ReadUB(5);
            xMin = swf.ReadSB(nBits);
            xMax = swf.ReadSB(nBits);
            yMin = swf.ReadSB(nBits);
            yMax = swf.ReadSB(nBits);
        }

        #endregion
    }
}
