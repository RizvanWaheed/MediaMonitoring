using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using CRM.Entities;
using SocialCRM.Web.Models.Media.EPaper;
using System.Data.Entity;
using SocialCRM.Web.Models.Media.Form;

namespace SocialCRM.Web.Repositories.Media
{
    public class NewsPaperSetupRepository : INewsPaperSetupRepository
    {
        
        public Task<bool> DeleteNewpaperSetting(NewspaperSetupModel model)
        {
            var status = false;
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                var deletedSetting = db.NewsPaperSetups.Where(z=>z.Id==model.Id).FirstOrDefault();
                if(deletedSetting!=null)
                {
                    //deleting associated configuration url
                    var urls = db.NewspaperUrlConfigurations.Where(x => x.SetupId == model.Id).ToList();
                    db.NewspaperUrlConfigurations.RemoveRange(urls);
                    db.NewsPaperSetups.Remove(deletedSetting);
                    db.SaveChanges();
                }
            }
            return Task.FromResult(status);
        }
        
        public List<NewspaperSetupModel> GetConfiguredEpaperSetting()
        {
            List<NewspaperSetupModel> ePaperSettings=null;
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                ePaperSettings = db.NewsPaperSetups.Include(i=>i.NewspaperUrlConfigurations)
                    .Select(x=>new NewspaperSetupModel
                {
                        DateFormat=x.DateFormat,
                        Id=x.Id,
                        NewPaperName=x.NewPaperName,
                        NewspaperUrls=x.NewspaperUrlConfigurations.Select(n=>new NewspaperUrlConfigurationModel
                        {
                            CityId=n.CityId,
                            Id=n.Id,
                            PageNumber=n.PageNumber,
                            SetupId=n.SetupId,
                            UrlTemplate=n.UrlTemplate,
                            CityName=n.City.CityName
                        }).ToList()
                }).ToList();
            }
            return ePaperSettings;
        }

        public Task<bool> SavePaperSetting(NewspaperSetupModel model)
        {
            var status = false;
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                if (model.Id > 0)
                {
                    var updatedSetting = db.NewsPaperSetups.Where(z => z.Id == model.Id).FirstOrDefault();
                    if (updatedSetting != null)
                    {
                        updatedSetting.DateFormat = model.DateFormat;
                        updatedSetting.NewPaperName = model.NewPaperName;
                    }

                }
                else
                {
                    var obj = db.NewsPaperSetups.Add(new NewsPaperSetup
                    {
                        DateFormat=model.DateFormat,
                        NewPaperName=model.NewPaperName
                    });
                }
                db.SaveChanges();
            }
            return Task.FromResult(status);
        }

        //Newpaper Urls
        public Task<bool> AddorUpdateNewpaperUrl(NewspaperUrlConfigurationModel model)
        {
            var status = false;
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                if (model.Id > 0)
                {
                    var updatedSetting = db.NewspaperUrlConfigurations.Where(z => z.Id == model.Id).FirstOrDefault();
                    if (updatedSetting != null)
                    {
                        updatedSetting.CityId= model.CityId;
                        updatedSetting.PageNumber= model.PageNumber;
                        updatedSetting.UrlTemplate = model.UrlTemplate;
                        updatedSetting.DateFormat = model.DateFormat;
                    }
                }
                else
                {
                    var obj = db.NewspaperUrlConfigurations.Add(new NewspaperUrlConfiguration
                    {
                        CityId=model.CityId,
                        PageNumber=model.PageNumber,
                        SetupId=model.SetupId,
                        UrlTemplate=model.UrlTemplate,
                        DateFormat=model.DateFormat
                    });
                }
                db.SaveChanges();
            }
            return Task.FromResult(status);
        }

        public Task<bool> DeleteNewpaperUrl(NewspaperUrlConfigurationModel model)
        {
            var status = false;
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                var deletedSetting = db.NewspaperUrlConfigurations.Where(z => z.Id == model.Id).FirstOrDefault();
                if (deletedSetting != null)
                {
                    db.NewspaperUrlConfigurations.Remove(deletedSetting);
                    db.SaveChanges();
                }
            }
            return Task.FromResult(status);
        }

        public List<NewspaperUrlConfigurationModel> GetNewspaperUrlByPaperIdThenCityId(int paperId, int cityId)
        {
            List<NewspaperUrlConfigurationModel> Urls = null;
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                Urls = db.NewspaperUrlConfigurations.Where(x => x.SetupId == paperId && (x.CityId == cityId|| cityId==0)).
                    Select(r => new NewspaperUrlConfigurationModel
                    {
                        CityId=r.CityId,
                        CityName=r.City.CityName,
                        Id=r.Id,
                        PageNumber=r.PageNumber,
                        SetupId=r.SetupId,
                        UrlTemplate=r.UrlTemplate,
                        DateFormat=r.DateFormat
                    }).ToList();
            }
            return Urls;
        }

        public NewspaperWithCitiesModel GetNewspaperById(int setupId)
        {
            NewspaperWithCitiesModel ePaper = new NewspaperWithCitiesModel();
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                var newspaper = db.NewsPaperSetups.Include(i => i.NewspaperUrlConfigurations)
                    .Select(x => new NewspaperSetupModel
                    {
                        DateFormat = x.DateFormat,
                        Id = x.Id,
                        NewPaperName = x.NewPaperName,
                    }).Where(e => e.Id == setupId).FirstOrDefault();
                if(newspaper!=null)
                {
                    ePaper.Newspaper = newspaper;
                    ePaper.CitiesList = new List<SelectItemList>();
                    db.Cities.OrderBy(x => x.CityName).ToList().ForEach(delegate (City obj)
                    {
                        ePaper.CitiesList.Add(new SelectItemList()
                        {
                            Value = obj.CityId,
                            Text = obj.CityName
                        });
                    });
                }
            }
            return ePaper;
        }

        public List<SelectItemList> GetConfiguredNewspaperDDL()
        {
            List<SelectItemList> newspapers = new List<SelectItemList>();
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                db.NewsPaperSetups.OrderBy(x => x.NewPaperName).ToList().ForEach(delegate (NewsPaperSetup obj)
                {
                    newspapers.Add(new SelectItemList()
                    {
                        Value = obj.Id,
                        Text = obj.NewPaperName
                    });
                });
            }
            return newspapers;
        }

        public List<SelectItemList> GetNewspaperCitiesDDL(int newpaperId)
        {
            List<SelectItemList> cities = new List<SelectItemList>();
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                db.NewspaperUrlConfigurations.Where(s => s.SetupId == newpaperId)
                    .Select(s => s.City).Distinct().ToList().ForEach(delegate (City obj)
              {
                  cities.Add(new SelectItemList()
                  {
                      Value = obj.CityId,
                      Text = obj.CityName
                  });
              });
            }
            return cities;
        }

        public List<SelectItemList> GetNewspaperPagesByIdThenCityIdDDL(int newpaperId, int cityId)
        {
            List<SelectItemList> newspaperPages = new List<SelectItemList>();
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                db.NewspaperUrlConfigurations.Where(s => s.SetupId == newpaperId&&s.CityId==cityId)
                    .Select(s => s.PageNumber).Distinct().ToList().ForEach(delegate (int obj)
                    {
                        newspaperPages.Add(new SelectItemList()
                        {
                            Value = obj,
                            Text = Convert.ToString(obj)
                        });
                    });
            }
            return newspaperPages;
        }

        public NewspaperUrlConfigurationModel GetNewspaperUrlByCityThenPageNumer(FetchNewspaperRequestModel model)
        {
            NewspaperUrlConfigurationModel ePaper = null;
            using (SocialCRMEntities db = new SocialCRMEntities())
            {
                ePaper = db.NewspaperUrlConfigurations.Where(s => s.SetupId == model.NewsPaperId && s.CityId == model.CityId && s.PageNumber == model.PageNumber)
                    .Select(x => new NewspaperUrlConfigurationModel
                    {
                        UrlTemplate = x.UrlTemplate,
                        CityId = x.CityId,
                        DateFormat = x.DateFormat,
                        Id = x.Id,
                        PageNumber = x.PageNumber,
                        SetupId = x.SetupId
                    }).FirstOrDefault();
            }
            return ePaper;
        }
    }
}