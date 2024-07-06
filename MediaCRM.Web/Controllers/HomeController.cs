using Google.Apis.Auth.OAuth2.Mvc;
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using SocialCRM.Web.Repositories.Media;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace SocialCRM.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Mining()
        {
            return View("~/Views/Mining/MiningDataView.cshtml");
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View("~/Views/Account/Login.cshtml");
        }
        [Authorize]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public void DownloadPdf(int id)
        {
            try
            {
                var repository = new ReportRepository();
                var consolidatedReport = repository.GetConsolidatedReport(id);

                ////PDF Start
                var reportFileName = id == 0 ? "AllDay-" + DateTime.Now.Ticks + ".pdf" :
                                    id == 1 ? "Shift-A-" + DateTime.Now.Ticks + ".pdf" :
                                    id == 2 ? "Shift-B-" + DateTime.Now.Ticks + ".pdf" :
                                    "Shift-C-" + DateTime.Now.Ticks + ".pdf";
                var reportTime= id == 0 ? DateTime.Now.ToString("dd-MM-yyyy")+", All Day"  :
                                    id == 1 ? DateTime.Now.ToString("dd-MM-yyyy") + ", Shift-A" :
                                    id == 2 ? DateTime.Now.ToString("dd-MM-yyyy") + ", Shift-B" :
                                     DateTime.Now.ToString("dd-MM-yyyy") + ", Shift-C";
                System.IO.StringWriter tw = new System.IO.StringWriter();
                System.Web.UI.HtmlTextWriter hw = new System.Web.UI.HtmlTextWriter(tw);
                HttpResponse Response = System.Web.HttpContext.Current.Response;
                System.Web.HttpContext.Current.Response.Clear();
                System.Web.HttpContext.Current.Response.ClearContent();
                System.Web.HttpContext.Current.Response.ClearHeaders();
                System.Web.HttpContext.Current.Response.Buffer = true;
                System.Web.HttpContext.Current.Response.ContentType = "application/pdf";
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "inline;filename=" + reportFileName);
                System.Web.HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);
                System.Web.HttpContext.Current.Response.Charset = "utf-8";
                System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.GetEncoding("windows-1250");

                System.IO.StringReader sr = new System.IO.StringReader(tw.ToString());
                var pageSize = new iTextSharp.text.Rectangle(421, 596);
                Document pdfDoc = new Document(pageSize, 7f, 7f, 7f, 0f);
                HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
                var reportLogo = Server.MapPath("~/Content/images/logomainpdf.png");
                var writer = PdfWriter.GetInstance(pdfDoc, Response.OutputStream);

                var tblStart = "<!DOCTYPE html><html><head><title></title><meta charset=\"utf-8\"/><meta content= \"ie=edge\" http-equiv=\"x-ua-compatible\"/><meta content=\"width=device-width, initial-scale=1\" name = \"viewport\"/>" +
                                "</head><body>" +
                                "<div style=\"text-align: center;background: #f6f6f6;border: 1px solid #eee;padding: 15px;\">" +
                                "<img src=\"" + reportLogo + "\" alt=\"logo\" style=\"display:inline-block;width:50px;text-align:center;\">" +
                                "<h4 style=\"font-size:18px;\">PPIC3, LAHORE  DAILY SITUATION REPORT<br/>" + reportTime + "<br/>HIGHLIGHTS</h4></div>";// +
                StringBuilder sb = new StringBuilder();
                foreach(var row in consolidatedReport.CatWiseSubjects)
                {
                    sb.Append("<div><b>" + row.CatName + "</b><ul>");
                    foreach(var highlisht in row.Data)
                    {
                        sb.Append("<li style=\"position:relative;padding-left:10px;\">** <u>"+highlisht.Data + "</u></li>");
                    }
                    sb.Append("</ul></div>");
                }
                StringBuilder sbDescp = new StringBuilder();
                sbDescp.Append("<h3 style=\"text-align:center;\">Brief Description of News</h3>");
                foreach (var row in consolidatedReport.CatWiseDesc)
                {
                    sbDescp.Append("<div><b>" + row.CatName + "</b><ul style=\"padding:0;margin:0;list-style-type:square;\">");
                    foreach (var highlisht in row.Data)
                    {
                        sbDescp.Append("<li style=\"border-bottom: 0;position:relative;padding-left:10px;\"><strong>[" + highlisht.Source+","+highlisht.NewsDate+ "]</strong> "+highlisht.Data + "</li>");
                    }
                    sbDescp.Append("</ul></div>");
                }
                var tblEnd = "</body></html>";
                pdfDoc.Open();
                htmlparser.Parse(new System.IO.StringReader(tblStart+ sb.ToString()+ sbDescp.ToString() + tblEnd));
                pdfDoc.Close();
            }
            catch (Exception exp)
            {
            }
        }
    }
}