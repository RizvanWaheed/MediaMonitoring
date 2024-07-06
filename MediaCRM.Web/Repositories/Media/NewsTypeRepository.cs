using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRM.Entities;
using NLog;
using SocialCRM.Web.Models.Media.NewsType;
using SocialCRM.Web.Models.Media.Form;

namespace SocialCRM.Web.Repositories
{
    public class NewsTypeRepository : INewsTypeRepository
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public NewsTypeViewModel AddorUpdateNewsType(NewsTypeViewModel model)
        {
            NewsTypeViewModel result = null;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    if (model.Id > 0)
                    {
                        var dbModel = db.NewsTypes.Where(t => t.Id == model.Id).FirstOrDefault();
                        if (dbModel != null)
                        {
                            dbModel.NewsTypeName = model.NewsTypeName;
                            dbModel.MediaTypeId = model.MediaTypeId;
                        }
                        else
                        {
                            db.NewsTypes.Add(new NewsType
                            {
                                NewsTypeName=model.NewsTypeName,
                                MediaTypeId=model.MediaTypeId
                            });
                        }
                    }
                    else
                    {
                        db.NewsTypes.Add(new NewsType
                        {
                            NewsTypeName = model.NewsTypeName,
                            MediaTypeId = model.MediaTypeId
                        });
                    }
                    db.SaveChanges();
                    result = model;
                }
            }
            catch (Exception exp)
            {
                Logger.Log(LogLevel.Error, "AddorUpdateNewsType_NewsTypeRepository : Message : " + exp.Message + " Details:" + exp.ToString());
            }
            return result;
        }

        public bool DeleteNewsType(int Id)
        {
            bool result = false;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    var newsType = db.NewsTypes.Find(Id);
                    if (newsType != null)
                    {
                        db.NewsTypes.Remove(newsType);
                        db.SaveChanges();
                    }
                    result = true;
                }
            }
            catch (Exception exp)
            {
                Logger.Log(LogLevel.Error, "DeleteNewsType_NewsTypeRepository : Message : " + exp.Message + " Details:" + exp.ToString() + " id: " + Convert.ToString(Id));
                result = false;
            }
            return result;
        }

        public List<SelectItemList> GetCities()
        {
            List<SelectItemList> CitiesList = new List<SelectItemList>();           
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    db.Cities.OrderBy(x => x.CityName).ToList().ForEach(delegate (City obj)
                    {
                        CitiesList.Add(new SelectItemList()
                        {
                            Value = obj.CityId,
                            Text = obj.CityName
                        });
                    });
                }
            }
            catch (Exception exp)
            {
                Logger.Log(LogLevel.Error, "GetCities_NewsTypeRepository : Message : " + exp.Message + " Details:" + exp.ToString());
            }
            return CitiesList;
        }

        public NewsTypeViewModelList GetNewsType(int startIndex, int pageSize)
        {
            NewsTypeViewModelList result = new NewsTypeViewModelList();
            startIndex = startIndex * pageSize;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    result.Data = db.NewsTypes.OrderBy(x => x.Id).Skip(startIndex).Take(pageSize)
                        .Select(r=>new NewsTypeViewModel
                        {
                            Id=r.Id,
                            MediaTypeId=r.MediaTypeId,
                            NewsTypeName=r.NewsTypeName,
                            MediaTypeName=r.MediaType.TypeName
                        }).ToList();

                    result.MediaTypeList = new List<SelectItemList>();
                    db.MediaTypes.ToList().ForEach(delegate (MediaType obj)
                    {
                        result.MediaTypeList.Add(new SelectItemList()
                        {
                            Value = obj.Id,
                            Text = obj.TypeName
                        });
                    });
                }
            }
            catch (Exception exp)
            {
                Logger.Log(LogLevel.Error, "GetNewsType_NewsTypeRepository : Message : " + exp.Message + " Details:" + exp.ToString());
            }
            return result;
        }

        public NewsTypeViewModel GetNewsTypeById(int Id)
        {
            NewsTypeViewModel result = null;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    var model = db.NewsTypes.Where(x => x.Id == Id).FirstOrDefault();
                    if (model != null)
                    {
                        result = new NewsTypeViewModel
                        {
                            Id=model.Id,
                            MediaTypeId=model.MediaTypeId,
                            NewsTypeName=model.NewsTypeName
                        };
                    }
                }
            }
            catch (Exception exp)
            {
                Logger.Log(LogLevel.Error, "GetNewsTypeById_NewsTypeRepository : Message : " + exp.Message + " Details:" + exp.ToString() + " id: " + Convert.ToString(Id));
            }
            return result;
        }
    }
}