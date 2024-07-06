using SocialCRM.Web.Models.Media.Form;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Models.Media.EPaper
{
    public class NewspaperSetupModel
    {
        public int Id { get; set; }
        public string NewPaperName { get; set; }
        public string DateFormat { get; set; }
        public List<NewspaperUrlConfigurationModel> NewspaperUrls { get; set; }
    }

    public class NewspaperUrlConfigurationModel
    {
        public int Id { get; set; }
        public int SetupId { get; set; }
        public int CityId { get; set; }
        public string CityName { get; set; }
        public int PageNumber { get; set; }
        public string UrlTemplate { get; set; }
        public string DateFormat { get; set; }
        public NewspaperSetupModel NewsPaper { get; set; }
    }
    public class NewspaperWithCitiesModel
    {
        public NewspaperSetupModel Newspaper { get; set; }
        public List<SelectItemList> CitiesList { get; set; }
    }

    public class FetchNewspaperRequestModel
    {
        public int NewsPaperId { get; set; }
        public int CityId { get; set; }
        public int PageNumber { get; set; }
        public string NewsDate { get; set; }
    }

    public class CropedNewspaperRequestModel
    {
        public int NewsPaperId { get; set; }
        public int CityId { get; set; }
        public string PageNumber { get; set; }
        public string NewsDate { get; set; }
        public string ClipBase64PNG { get; set; }
        //
        public int NewsType { get; set; }
        public int NewsRelevance { get; set; }
        public int Sentiment { get; set; }
        public int ColumnNumber { get; set; }
        public int ColumnHeight { get; set; }
        public string AdvertizeRate { get; set; }
        public double PrValue { get; set; }
        public string CategoryIds { get; set; }
        public string PrintHeading { get; set; }
        public string PrintScript { get; set; }
    }
}