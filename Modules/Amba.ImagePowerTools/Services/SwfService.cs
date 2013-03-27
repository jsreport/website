using FlashTools;
using Orchard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Amba.ImagePowerTools.Services
{
    public interface ISwfService : IDependency
    {
        void GetSwfFileDimensions(string fileServerPath, out int width, out int height);
    }

    public class SwfService : ISwfService
    {
        public SwfService(){}

        public void GetSwfFileDimensions(string fileServerPath,  out int width, out int height)
        {
            var file = new SWFFile(fileServerPath);
            width = file.FrameWidth / 20;
            height = file.FrameHeight / 20;
            /*
            var parser = new FlashHeaderReader(fileServerPath);
            width = parser.Width;
            height = parser.Height;*/
        }
    }
}