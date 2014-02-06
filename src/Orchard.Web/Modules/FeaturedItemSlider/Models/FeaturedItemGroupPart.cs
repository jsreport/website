using System.ComponentModel.DataAnnotations;
using Orchard.ContentManagement;

namespace FeaturedItemSlider.Models {
    public class FeaturedItemGroupPart : ContentPart<FeaturedItemGroupPartRecord> {
        private const int MinFeatureDimension = 1;
        private const int MaxFeatureDimension = 99999;

        [Required]
        public string Name {
            get { return Record.Name; }
            set { Record.Name = value; }
        }

        [Range(MinFeatureDimension, MaxFeatureDimension, ErrorMessage = "Group Width must be greater than zero.")]
        public int GroupWidth {
            get { return Record.GroupWidth; }
            set { Record.GroupWidth = value; }
        }

        [Range(MinFeatureDimension, MaxFeatureDimension, ErrorMessage = "Group Height must be greater than zero.")]
        public int GroupHeight {
            get { return Record.GroupHeight; }
            set { Record.GroupHeight = value; }
        }

        public bool IncludeImages {
            get { return Record.IncludeImages; }
            set { Record.IncludeImages = value; }
        }

        public ImageStyle ImageStyle {
            get { return Record.ImageStyle; }
            set { Record.ImageStyle = value; }
        }

        public int ImageWidth {
            get { return Record.ImageWidth; }
            set { Record.ImageWidth = value; }
        }

        public int ImageHeight {
            get { return Record.ImageHeight; }
            set { Record.ImageHeight = value; }
        }

        public int HeadlineOffsetTop {
            get { return Record.HeadlineOffsetTop; }
            set { Record.HeadlineOffsetTop = value; }
        }

        public int HeadlineOffsetLeft {
            get { return Record.HeadlineOffsetLeft; }
            set { Record.HeadlineOffsetLeft = value; }
        }

        public string BackgroundColor {
            get { return Record.BackgroundColor; }
            set { Record.BackgroundColor = value; }
        }

        [Required]
        public string ForegroundColor {
            get { return Record.ForegroundColor; }
            set { Record.ForegroundColor = value; }
        }

        [Required]
        public string TransitionEffect {
            get { return Record.TransitionEffect; }
            set { Record.TransitionEffect = value; }
        }

        [Range(1, int.MaxValue, ErrorMessage = "Slide Speed must at least one millisecond.")]
        public int SlideSpeed {
            get { return Record.SlideSpeed; }
            set { Record.SlideSpeed = value; }
        }

        [Range(15, int.MaxValue, ErrorMessage = "Slide Pause must be at least fifteen milliseconds.")]
        public int SlidePause {
            get { return Record.SlidePause; }
            set { Record.SlidePause = value; }
        }

        public bool ShowPager {
            get { return Record.ShowPager; }
            set { Record.ShowPager = value; }
        }

        public bool ShowSlideNumbers {
            get { return Record.ShowSlideNumbers; }
            set { Record.ShowSlideNumbers = value; }
        }
    }
}