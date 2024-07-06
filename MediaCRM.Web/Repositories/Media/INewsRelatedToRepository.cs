using SocialCRM.Web.Models.Media.NewsRelavance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialCRM.Web.Repositories
{
    public interface INewsRelatedToRepository
    {
        List<NewsRelavanceViewModel> GetNewsRelavances(int startIndex, int pageSize);
        NewsRelavanceViewModel GetNewsRelavanceById(int Id);
        NewsRelavanceViewModel AddorUpdateNewsRelavance(NewsRelavanceViewModel model);
        bool DeleteNewsRelavance(int Id);
    }
}
