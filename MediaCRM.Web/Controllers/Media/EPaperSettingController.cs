using SocialCRM.Web.Models.Media.EPaper;
using SocialCRM.Web.Repositories.Media;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using CRM.Common.Extensions;
using Microsoft.AspNet.Identity;
using SocialCRM.Web.Models.Media.Form;
using System.Web;

namespace SocialCRM.Web.Controllers.Media
{
    [RoutePrefix("api/epapersetting")]
    public class EPaperSettingController : ApiController
    {
        INewsPaperSetupRepository newsPaperSetupRepository;
        IMediaRepository mediaRepository;
        public EPaperSettingController(INewsPaperSetupRepository newsPaperSetupRepo, IMediaRepository mediaRepo)
        {
            newsPaperSetupRepository = newsPaperSetupRepo;
            mediaRepository = mediaRepo;
        }

        [Route("getconfiguredepapersetting")]
        public IHttpActionResult GetConfiguredEpaperSetting()
        {
            var result = newsPaperSetupRepository.GetConfiguredEpaperSetting();
            return Ok(result);
        }

        [HttpPost]
        [Route("SavePaperSetting")]
        public async Task<IHttpActionResult> SavePaperSetting(NewspaperSetupModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await newsPaperSetupRepository.SavePaperSetting(model);
            return Ok(taskResult);
        }

        [HttpPost]
        [Route("DeleteNewpaperSetting")]
        public async Task<IHttpActionResult> DeleteNewpaperSetting(NewspaperSetupModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await newsPaperSetupRepository.DeleteNewpaperSetting(model);
            return Ok(taskResult);
        }

        [Route("GetNewspaperById/{setupId}")]
        public IHttpActionResult GetNewspaperById(int setupId)
        {
            var result = newsPaperSetupRepository.GetNewspaperById(setupId);
            return Ok(result);
        }

        //Url
        [HttpPost]
        [Route("SavePaperUrl")]
        public async Task<IHttpActionResult> SavePaperUrl(NewspaperUrlConfigurationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await newsPaperSetupRepository.AddorUpdateNewpaperUrl(model);
            return Ok(taskResult);
        }

        [HttpPost]
        [Route("DeleteNewpaperUrl")]
        public async Task<IHttpActionResult> DeleteNewpaperUrl(NewspaperUrlConfigurationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await newsPaperSetupRepository.DeleteNewpaperUrl(model);
            return Ok(taskResult);
        }

        [Route("GetNewspaperUrlByPaperIdThenCityId/{paperId}/{cityId}")]
        public IHttpActionResult GetNewspaperUrlByPaperIdThenCityId(int paperId, int cityId)
        {
            var result = newsPaperSetupRepository.GetNewspaperUrlByPaperIdThenCityId(paperId,cityId);
            return Ok(result);
        }

        //Print Clipping Dropdown
        [Route("GetConfiguredNewspaper")]
        public IHttpActionResult GetConfiguredNewspaper()
        {
            var result = newsPaperSetupRepository.GetConfiguredNewspaperDDL();
            return Ok(result);
        }

        [Route("GetNewspaperCities/{newspaperId}")]
        public IHttpActionResult GetNewspaperCities(int newspaperId)
        {
            var result = newsPaperSetupRepository.GetNewspaperCitiesDDL(newspaperId);
            return Ok(result);
        }

        [Route("GetNewspaperPages/{newspaperId}/{cityId}")]
        public IHttpActionResult GetNewspaperPages(int newspaperId,int cityId)
        {
            var result = newsPaperSetupRepository.GetNewspaperPagesByIdThenCityIdDDL(newspaperId, cityId);
            return Ok(result);
        }

        //Newspaper Crawling
        [HttpPost]
        [Route("FetchNewspaperImage")]
        public async Task<IHttpActionResult> FetchNewspaperImage(FetchNewspaperRequestModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var paperScreenShot = string.Empty;
            var newpaperUrl = newsPaperSetupRepository.GetNewspaperUrlByCityThenPageNumer(model);
            if (newpaperUrl != null)
            {
                //featch from 3rd Party
                DateTime newsPaperdate;
                if (!DateTime.TryParseExact(model.NewsDate, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out newsPaperdate))
                {
                    newsPaperdate = DateTime.Now.AddDays(-1);
                }
                var actualDate = newpaperUrl.DateFormat.Replace("DD", newsPaperdate.Day < 10 ? ("0" + newsPaperdate.Day) : newsPaperdate.Day.ToString())
                       .Replace("MM", newsPaperdate.Month < 10 ? ("0" + newsPaperdate.Month) : newsPaperdate.Month.ToString())
                        .Replace("YYYY", newsPaperdate.Year.ToString());
                var actualUrl = newpaperUrl.UrlTemplate.Replace("{dateParam}", actualDate);
                var apiUrl= ConfigurationManager.AppSettings["ScreenshotlayerAPI"];
                var clipdownloadPath = ConfigurationManager.AppSettings["EpaperDownloadPath"];
                if (string.IsNullOrEmpty(clipdownloadPath))
                    clipdownloadPath = "~/Content/EpaperDownload/";
                var paperDate = model.NewsDate.Replace("/", "");
                var paperfileName = model.NewsDate.Replace("/", "") + ".png";
                var clipfullPath = string.Concat(clipdownloadPath, "/", model.NewsPaperId,"/",model.CityId, "/", model.PageNumber, "/", paperDate);
                var virtualFullPath = clipfullPath + "/" + paperfileName;
                var diskPath= System.Web.Hosting.HostingEnvironment.MapPath(clipfullPath);
                var paperDiskPath= diskPath + "/" + paperfileName;
                if (!Directory.Exists(diskPath)||!File.Exists(paperDiskPath))
                {
                    if(!Directory.Exists(diskPath))
                        Directory.CreateDirectory(diskPath);
                    if (!string.IsNullOrEmpty(apiUrl))
                    {
                        var apisnif = apiUrl.Replace("@", "&").Replace("|", "@").Replace("{requestUrl}", actualUrl);
                        HttpWebRequest lxRequest = (HttpWebRequest)WebRequest.Create(apisnif);
                        // returned values are returned as a stream, then read into a string
                        string lsResponse = string.Empty;
                        using (HttpWebResponse lxResponse = (HttpWebResponse)lxRequest.GetResponse())
                        {
                            using (BinaryReader reader = new BinaryReader(lxResponse.GetResponseStream()))
                            {
                                Byte[] lnByte = reader.ReadBytes(1 * 1024 * 1024 *20);
                                using (FileStream lxFS = new FileStream(diskPath+"/"+paperfileName, FileMode.Create))
                                {
                                    lxFS.Write(lnByte, 0, lnByte.Length);
                                }
                            }
                        }
                    }
                }
                paperScreenShot = System.Web.HttpContext.Current.Request.GetFullUrl(virtualFullPath);
            }
            return Ok(paperScreenShot);
        }

        [HttpPost]
        [Route("UploadCroppedNewspaperImage")]
        public async Task<IHttpActionResult> UploadCroppedNewspaperImage(CropedNewspaperRequestModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = User.Identity.GetUserId<int>();
            var clipdownloadPath = ConfigurationManager.AppSettings["EpaperDownloadPath"];
            if (string.IsNullOrEmpty(clipdownloadPath))
                clipdownloadPath = "~/Content/EpaperDownload/";
            var paperDate = model.NewsDate.Replace("/", "");
            var paperfileName = string.Concat(DateTime.Now.Ticks, model.NewsDate.Replace("/", ""), ".png");
            var clipfullPath = string.Concat(clipdownloadPath, "/", model.NewsPaperId, "/", model.CityId, "/", model.PageNumber, "/", paperDate, "/cliping/");
            var virtualFullPath = clipfullPath + paperfileName;
            var diskPath = System.Web.Hosting.HostingEnvironment.MapPath(clipfullPath);
            if (!Directory.Exists(diskPath))
            {
                Directory.CreateDirectory(diskPath);
            }
            File.WriteAllBytes(diskPath + paperfileName, Convert.FromBase64String(model.ClipBase64PNG.Split(',')[1]));
            //save user request to database.
            var printForm = new MediaFormSaveModel
            {
                AdvertisingRate = model.AdvertizeRate,
                CategoryIds = model.CategoryIds,
                CityId = model.CityId,
                ColumnHeight = model.ColumnHeight,
                ColumnNumber = model.ColumnNumber,
                SentimentId = model.Sentiment,
                MediaTypeId = 3,
                FullEdit = true,
                Multiplier = 3.2,
                NewsRelation = model.NewsRelevance,
                NewsTypeId = model.NewsType,
                PageNumber = model.PageNumber,
                PrValue = model.PrValue,
                TransmissionDate = model.NewsDate,
                TransmissionTime = DateTime.Now.TimeOfDay.ToString(),
                ChannelId = model.NewsPaperId,
                ChannelIds = model.NewsPaperId.ToString(),
                Subject=model.PrintHeading??"",
                Script=string.IsNullOrWhiteSpace(model.PrintScript) ? model.PrintHeading: model.PrintScript,
                ClippingAttachment = new MediaAttachmentModel
                {
                    Base64String = model.ClipBase64PNG,
                    ContentType = "image/png",
                    FileName = DateTime.Now.Ticks + ".png"
                }
            };
            var isSaved = await mediaRepository.SavePrintMedia(printForm, userId, HttpContext.Current.Request.PhysicalApplicationPath);

            return Ok(System.Web.HttpContext.Current.Request.GetFullUrl(virtualFullPath));
        }
    }
}