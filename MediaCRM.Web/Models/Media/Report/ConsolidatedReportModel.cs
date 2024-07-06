using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Models.Media.Report
{
    public class ConsolidatedReportModel
    {
        public List<CatWiseData> CatWiseSubjects { get; set; }
        public List<CatWiseData> CatWiseDesc { get; set; }
    }
    public class CatWiseData
    {
        public int CatId { get; set; }
        public string CatName { get; set; }
        public List<MediaData> Data { get; set; }
    }
    public class MediaData
    {
        public int MediaId { get; set; }
        public string Data { get; set; }
        public string NewsDate { get; set; }
        public string Source { get; set; }
    }
}