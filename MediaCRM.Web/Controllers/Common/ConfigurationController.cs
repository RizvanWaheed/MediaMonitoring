using SocialCRM.Web.Models.Media.NewsRelavance;
using SocialCRM.Web.Models.Media.NewsType;
using SocialCRM.Web.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SocialCRM.Web.Controllers.Common
{
    [RoutePrefix("api/Configuraiton")]
    public class ConfigurationController : ApiController
    {
        INewsTypeRepository repository;
        INewsRelatedToRepository newsRelatedToRepository;
        public ConfigurationController(INewsTypeRepository mediaRepo, INewsRelatedToRepository newsRelatedToRepo)
        {
            repository = mediaRepo;
            newsRelatedToRepository = newsRelatedToRepo;
        }
        
        [HttpGet]
        [Route("GetNewsTypeById/{Id}")]
        public IHttpActionResult GetNewsTypeById(int Id)
        {
            if (Id == 0)
            {
                return BadRequest();
            }
            var result = repository.GetNewsTypeById(Id);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetNewsTypeByPage/{pageIndex}/{pageSize}")]
        public IHttpActionResult GetNewsTypeByPage(int pageIndex,int pageSize)
        {
            if (pageIndex < 0|| pageSize==0)
            {
                return BadRequest();
            }
            var result = repository.GetNewsType(pageIndex,pageSize);
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveNewsType")]
        public IHttpActionResult SaveNewsType(NewsTypeViewModel model)
        {
            if (string.IsNullOrWhiteSpace(model.NewsTypeName))
            {
                return BadRequest(ModelState);
            }
            var taskResult =  repository.AddorUpdateNewsType(model);
            return Ok(taskResult);
        }

        [HttpPost]
        [Route("DeleteNewsType")]
        public IHttpActionResult DeleteNewsType(NewsTypeViewModel model)
        {
            if (model.Id<1)
            {
                return BadRequest(ModelState);
            }
            var taskResult = repository.DeleteNewsType(model.Id);
            return Ok(taskResult);
        }

        //Relavance Configurations  api/Configuraiton/GetRelavanceById
        [HttpGet]
        [Route("GetRelavanceById/{Id}")]
        public IHttpActionResult GetRelavanceById(int Id)
        {
            if (Id == 0)
            {
                return BadRequest();
            }
            var result = newsRelatedToRepository.GetNewsRelavanceById(Id);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetRelavanceByPage/{pageIndex}/{pageSize}")]
        public IHttpActionResult GetRelavanceByPage(int pageIndex, int pageSize)
        {
            if (pageIndex < 0 || pageSize == 0)
            {
                return BadRequest();
            }
            var result = newsRelatedToRepository.GetNewsRelavances(pageIndex, pageSize);
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveRelavance")]
        public IHttpActionResult SaveRelavance(NewsRelavanceViewModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Name))
            {
                return BadRequest(ModelState);
            }
            var taskResult = newsRelatedToRepository.AddorUpdateNewsRelavance(model);
            return Ok(taskResult);
        }

        [HttpPost]
        [Route("DeleteRelavance")]
        public IHttpActionResult DeleteRelavance(NewsRelavanceViewModel model)
        {
            if (model.Id < 1)
            {
                return BadRequest(ModelState);
            }
            var taskResult = newsRelatedToRepository.DeleteNewsRelavance(model.Id);
            return Ok(taskResult);
        }

        //api/Configuraiton/GetCities
        [HttpGet]
        [Route("GetCities")]
        public IHttpActionResult GetCities()
        {
            var result = repository.GetCities();
            return Ok(result);
        }
    }
}
