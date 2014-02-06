using FeaturedItemSlider.Models;
using Orchard.ContentManagement.MetaData;
using Orchard.Data.Migration;

namespace FeaturedItemSlider {
    public class Migrations : DataMigrationImpl {

        public int Create() {
            SchemaBuilder.CreateTable("FeaturedItemGroupPartRecord", builder => builder
                .ContentPartRecord()
                .Column<string>("Name", col => col.WithLength(100))
                .Column<int>("GroupWidth")
                .Column<int>("GroupHeight")
                .Column<bool>("IncludeImages", col => col.WithDefault(true))
                .Column<string>("ImageStyle", col => col.WithDefault(ImageStyle.Inline.ToString()))
                .Column<int>("ImageWidth")
                .Column<int>("ImageHeight")
                .Column<int>("HeadlineOffsetTop")
                .Column<int>("HeadlineOffsetLeft")
                .Column<string>("BackgroundColor")
                .Column<string>("ForegroundColor")
                .Column<int>("SlideSpeed", cfg => cfg.WithDefault(300))
                .Column<int>("SlidePause", cfg => cfg.WithDefault(6000))
                .Column<bool>("ShowSlideNumbers", col => col.WithDefault(false))
                .Column<bool>("ShowPager", col => col.WithDefault(true))
                .Column<string>("TransitionEffect", col => col.WithDefault("scrollLeft"))
                );

            ContentDefinitionManager.AlterTypeDefinition("FeaturedItemGroup", builder => builder
                .DisplayedAs("Featured Item Group")
                .WithPart("FeaturedItemGroupPart")
                .WithPart("CommonPart")
                .WithPart("IdentityPart")
                );

            SchemaBuilder.CreateTable("FeaturedItemPartRecord", builder => builder
                    .ContentPartRecord()
                    .Column<string>("Headline", col => col.Unlimited())
                    .Column<string>("SubHeadline", col => col.Unlimited())
                    .Column<string>("LinkUrl", col => col.Unlimited())
                    .Column<bool>("SeparateLink", col => col.WithDefault(false))
                    .Column<string>("LinkText", col => col.Unlimited())
                    .Column<string>("GroupName", col => col.WithLength(100))
                    .Column<int>("SlideOrder", col => col.WithDefault(0))
                );

            ContentDefinitionManager.AlterTypeDefinition("FeaturedItem", builder => builder
                    .DisplayedAs("Featured Item")
                    .WithPart("FeaturedItemPart")
                    .WithPart("CommonPart")
                    .WithPart("IdentityPart")
                );

            ContentDefinitionManager.AlterPartDefinition("FeaturedItemPart", builder => builder
                    .WithField("Picture", cfg => cfg.OfType("MediaPickerField"))
                );

            SchemaBuilder.CreateTable("FeaturedItemSliderWidgetPartRecord", builder => builder
                .ContentPartRecord()
                .Column<string>("GroupName", col => col.WithLength(100)));

            ContentDefinitionManager.AlterTypeDefinition("FeaturedItemSliderWidget", builder => builder
                    .WithPart("FeaturedItemSliderWidgetPart")
                    .WithPart("CommonPart")
                    .WithPart("WidgetPart")
                    .WithPart("IdentityPart")
                    .WithSetting("Stereotype", "Widget")
                );

            //Updates 1-5 have been integrated into Create (as of v 1.4.2) to solve installation problems.
            //Leaving those updates in only for legacy versions (prior to 1.4.2).

            //Going forward, the Create migration will always include all updates and will return the version number of the last update
            //This allows new installations of the module to be created correctly and not require going through the updates
            return 102;
        }

        public int UpdateFrom1() {
            SchemaBuilder.AlterTable("FeaturedItemGroupPartRecord", builder => builder.AddColumn<int>("SlideSpeed", cfg => cfg.WithDefault(300)));
            SchemaBuilder.AlterTable("FeaturedItemGroupPartRecord", builder => builder.AddColumn<int>("SlidePause", cfg => cfg.WithDefault(6000)));

            return 2;
        }

        public int UpdateFrom2() {
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.AddColumn<string>("HeadlineTemp", cfg => cfg.WithLength(100)));
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.AddColumn<string>("SubHeadlineTemp", cfg => cfg.WithLength(100)));
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.AddColumn<string>("LinkUrlTemp", cfg => cfg.WithLength(500)));

            SchemaBuilder.ExecuteSql("UPDATE FeaturedItemSlider_FeaturedItemPartRecord SET HeadlineTemp = Headline");
            SchemaBuilder.ExecuteSql("UPDATE FeaturedItemSlider_FeaturedItemPartRecord SET SubHeadlineTemp = SubHeadline");
            SchemaBuilder.ExecuteSql("UPDATE FeaturedItemSlider_FeaturedItemPartRecord SET LinkUrlTemp = LinkUrl");

            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.DropColumn("Headline"));
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.DropColumn("SubHeadline"));
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.DropColumn("LinkUrl"));

            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.AddColumn<string>("Headline", cfg => cfg.Unlimited()));
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.AddColumn<string>("SubHeadline", cfg => cfg.Unlimited()));
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.AddColumn<string>("LinkUrl", cfg => cfg.Unlimited()));

            SchemaBuilder.ExecuteSql("UPDATE FeaturedItemSlider_FeaturedItemPartRecord SET Headline = HeadlineTemp");
            SchemaBuilder.ExecuteSql("UPDATE FeaturedItemSlider_FeaturedItemPartRecord SET SubHeadline = SubHeadlineTemp");
            SchemaBuilder.ExecuteSql("UPDATE FeaturedItemSlider_FeaturedItemPartRecord SET LinkUrl = LinkUrlTemp");

            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.DropColumn("HeadlineTemp"));
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.DropColumn("SubHeadlineTemp"));
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder => builder.DropColumn("LinkUrlTemp"));

            return 3;
        }

        public int UpdateFrom3() {
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder =>
                builder.AddColumn<int>("SlideOrder", col => {
                    col.WithDefault(0);
                    col.NotNull();
                }));

            return 4;
        }

        public int UpdateFrom4() {
            SchemaBuilder.AlterTable("FeaturedItemGroupPartRecord", builder =>
                builder.AddColumn<bool>("ShowSlideNumbers", col => {
                    col.WithDefault(false);
                    col.NotNull();
                }));

            return 5;
        }

        public int UpdateFrom5() {
            SchemaBuilder.AlterTable("FeaturedItemGroupPartRecord", builder =>
                builder.AddColumn<string>("TransitionEffect", col => col.WithDefault("scrollLeft")));
            SchemaBuilder.AlterTable("FeaturedItemGroupPartRecord", builder =>
                builder.AddColumn<bool>("ShowPager", col => {
                    col.WithDefault(true);
                    col.NotNull();
                }));
            return 6;
        }

        public int UpdateFrom6() {
            //Dropped code that was in here which tried to alter the TransitionEffect column to allow nulls.
            //Leaving this method in place to preserve the continuity of migrations for people who were able to get the update to run.
            return 7;
        }

        public int UpdateFrom100() {
            SchemaBuilder.AlterTable("FeaturedItemGroupPartRecord", builder =>
                builder.AddColumn<bool>("IncludeImages", col => col.WithDefault(true)));

            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder =>
                builder.AddColumn<bool>("SeparateLink", col => col.WithDefault(false)));
            SchemaBuilder.AlterTable("FeaturedItemPartRecord", builder =>
                builder.AddColumn<string>("LinkText", col => col.Unlimited()));

            return 101;
        }

        public int UpdateFrom101() {
            SchemaBuilder.AlterTable("FeaturedItemGroupPartRecord", builder =>
                builder.AddColumn<string>("ImageStyle", col => col.WithDefault(ImageStyle.Inline.ToString())));

            SchemaBuilder.AlterTable("FeaturedItemGroupPartRecord", builder =>
                builder.AddColumn<int>("HeadlineOffsetTop"));

            SchemaBuilder.AlterTable("FeaturedItemGroupPartRecord", builder =>
                builder.AddColumn<int>("HeadlineOffsetLeft"));
            

            return 102;
        }
    }
}