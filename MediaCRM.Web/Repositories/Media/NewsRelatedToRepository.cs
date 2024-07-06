using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRM.Entities;
using NLog;
using SocialCRM.Web.Models.Media.NewsRelavance;

namespace SocialCRM.Web.Repositories
{
    public class NewsRelatedToRepository : INewsRelatedToRepository
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public NewsRelavanceViewModel AddorUpdateNewsRelavance(NewsRelavanceViewModel model)
        {
            NewsRelavanceViewModel result = null;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    if (model.Id > 0)
                    {
                        var dbModel = db.NewsRelatedToes.Where(t => t.Id == model.Id).FirstOrDefault();
                        if (dbModel != null)
                        {
                            dbModel.Name= model.Name;
                        }
                        else
                        {
                            db.NewsRelatedToes.Add(new NewsRelatedTo
                            {
                                Name=model.Name
                            });
                        }
                    }
                    else
                    {
                        db.NewsRelatedToes.Add(new NewsRelatedTo
                        {
                            Name = model.Name
                        });
                    }
                    db.SaveChanges();
                    result = model;
                }
            }
            catch (Exception exp)
            {
                Logger.Log(LogLevel.Error, "AddorUpdateNewsRelavance_NewsRelatedToRepository : Message : " + exp.Message + " Details:" + exp.ToString());
            }
            return result;
        }

        public bool DeleteNewsRelavance(int Id)
        {
            bool result = false;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    var newsType = db.NewsRelatedToes.Find(Id);
                    if (newsType != null)
                    {
                        db.NewsRelatedToes.Remove(newsType);
                        db.SaveChanges();
                    }
                    result = true;
                }
            }
            catch (Exception exp)
            {
                Logger.Log(LogLevel.Error, "DeleteNewsRelavance_NewsRelatedToRepository : Message : " + exp.Message + " Details:" + exp.ToString() + " id: " + Convert.ToString(Id));
                result = false;
            }
            return result;
        }

        public NewsRelavanceViewModel GetNewsRelavanceById(int Id)
        {
            NewsRelavanceViewModel result = null;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    var model = db.NewsRelatedToes.Where(x => x.Id == Id).FirstOrDefault();
                    if (model != null)
                    {
                        result = new NewsRelavanceViewModel
                        {
                            Id = model.Id,
                            Name=model.Name
                        };
                    }
                }
            }
            catch (Exception exp)
            {
                Logger.Log(LogLevel.Error, "GetNewsRelavanceById_NewsRelatedToRepository : Message : " + exp.Message + " Details:" + exp.ToString() + " id: " + Convert.ToString(Id));
            }
            return result;
        }

        public List<NewsRelavanceViewModel> GetNewsRelavances(int startIndex, int pageSize)
        {
            List<NewsRelavanceViewModel> result = new List<NewsRelavanceViewModel>();
            startIndex = startIndex * pageSize;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    result = db.NewsRelatedToes.OrderBy(x => x.Id).Skip(startIndex).Take(pageSize)
                        .Select(r => new NewsRelavanceViewModel
                        {
                            Id = r.Id,
                            Name=r.Name
                        }).ToList();
                }
            }
            catch (Exception exp)
            {
                Logger.Log(LogLevel.Error, "GetNewsRelavances_NewsRelatedToRepository : Message : " + exp.Message + " Details:" + exp.ToString());
            }
            return result;
        }
    }
}