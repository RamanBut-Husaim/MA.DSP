﻿using System.Web.Optimization;

namespace DSP.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery-{version}.js", "~/Scripts/spin.js"));
            bundles.Add(new ScriptBundle("~/bundles/jquery-ui").Include("~/Scripts/jquery-ui-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include("~/Scripts/jquery.validate*"));
            bundles.Add(new ScriptBundle("~/bundles/dsp").Include(
                "~/Scripts/DSP/Shim/dsp.js",
                "~/Scripts/DSP/dsp-file-uploader.js",
                "~/Scripts/DSP/dsp-service.js",
                "~/Scripts/DSP/dsp-chart-manager.js",
                "~/Scripts/DSP/dsp-chart-builder.js",
                "~/Scripts/DSP/dsp-chart-core.js",
                "~/Scripts/DSP/dsp-window-chart.js",
                "~/Scripts/DSP/dsp-chart.js",
                "~/Scripts/DSP/dsp-chart-spectrum-core.js",
                "~/Scripts/DSP/dsp-chart-spectrum.js",
                "~/Scripts/DSP/dsp-chart-integral.js",
                "~/Scripts/DSP/dsp-chart-integral-spectrum.js",
                "~/Scripts/DSP/dsp-chart-double-integral.js",
                "~/Scripts/DSP/dsp-chart-double-integral-spectrum.js",
                "~/Scripts/DSP/dsp-characteristics.js",
                "~/Scripts/DSP/dsp-data-point.js",
                "~/Scripts/DSP/Shim/fft-builder.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-*"));

            //bundles.Add(new ScriptBundle("~/bundles/highcharts").Include("~/Scripts/highcharts/4.1.5/highcharts.src.js"));
            bundles.Add(new ScriptBundle("~/bundles/highstock").Include("~/Scripts/highstock/2.1.8/highstock.src.js"));
            bundles.Add(new ScriptBundle("~/bundles/jquery.fileupload")
                .Include("~/Scripts/jQuery.FileUpload/jquery.iframe-transport.js",
                        "~/Scripts/jQuery.FileUpload/jquery.fileupload.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js", "~/Scripts/respond.js"));
            bundles.Add(new ScriptBundle("~/bundles/mustache").Include("~/Scripts/mustache.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/bootstrap.css", "~/Content/site.css"));
            bundles.Add(new StyleBundle("~/Content/jquery-fileupload")
                .Include("~/Content/jQuery.FileUpload/css/jquery.fileupload.css",
                        "~/Content/jQuery.FileUpload/css/jquery.fileupload-ui.css"));
        }
    }
}
