using SocialCRM.Web.Models.Media.EPaper;
using SocialCRM.Web.Models.Media.Form;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialCRM.Web.Repositories.Media
{
    public interface INewsPaperSetupRepository
    {
        List<NewspaperSetupModel> GetConfiguredEpaperSetting();
        Task<bool> SavePaperSetting(NewspaperSetupModel model);
        Task<bool> DeleteNewpaperSetting(NewspaperSetupModel model);
        NewspaperWithCitiesModel GetNewspaperById(int setupId);

        //adding urls
        Task<bool> AddorUpdateNewpaperUrl(NewspaperUrlConfigurationModel model);
        Task<bool> DeleteNewpaperUrl(NewspaperUrlConfigurationModel model);
        List<NewspaperUrlConfigurationModel> GetNewspaperUrlByPaperIdThenCityId(int paperId, int cityId);
        List<SelectItemList> GetConfiguredNewspaperDDL();
        List<SelectItemList> GetNewspaperCitiesDDL(int newpaperId);
        List<SelectItemList> GetNewspaperPagesByIdThenCityIdDDL(int newpaperId, int cityId);
        NewspaperUrlConfigurationModel GetNewspaperUrlByCityThenPageNumer(FetchNewspaperRequestModel model);
    }
}
