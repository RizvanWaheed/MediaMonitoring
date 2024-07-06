using SocialCRM.Web.Models.Media.Form;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Models.Media.NewsType
{
    public class NewsTypeViewModel
    {
        public int Id { get; set; }
        public string NewsTypeName { get; set; }
        public int MediaTypeId { get; set; }
        public string MediaTypeName { get; set; }
    }

    public class NewsTypeViewModelList
    {
        public List<NewsTypeViewModel> Data { get; set; }
        public List<SelectItemList> MediaTypeList { get; set; }
    }
}