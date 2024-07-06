using SocialCRM.Web.Models.Media.Form;
using SocialCRM.Web.Models.Media.NewsType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Repositories
{
    public interface INewsTypeRepository
    {
        NewsTypeViewModelList GetNewsType(int startIndex, int pageSize);
        NewsTypeViewModel GetNewsTypeById(int Id);
        NewsTypeViewModel AddorUpdateNewsType(NewsTypeViewModel model);
        bool DeleteNewsType(int Id);
        List<SelectItemList> GetCities();
    }
}