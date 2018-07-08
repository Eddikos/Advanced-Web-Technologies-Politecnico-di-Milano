/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout');

exports.register = function () {
    require('./main-application').register();
    require('./c-homepage').register();
    require('./c-managerwindow').register();
    require('./c-workerwindow').register();
    require('./c-loginform').register();
    require('./c-registrationform').register();
    require('./c-campaignslist').register();
    require('./c-managerprofilechanges').register();
    require('./c-campaigndiv').register();
    require('./c-tasklist').register();
    require('./c-taskdetailsdiv').register();
    require('./c-workerprofilechanges').register();
    require('./c-campaignlist').register();
    require('./c-createcampaignform').register();
    require('./c-campaigndetails').register();
    require('./c-workerinfos').register();
    require('./c-imagelist').register();
    require('./c-campaignstatistics').register();
    require('./c-campaignnumbers').register();
    require('./c-uploadimageform').register();
    require('./c-imagedetails').register();
    require('./c-workerlist').register();
    require('./c-tasks').register();
    require('./c-taskdetails').register();
    require('./c-taskstatistics').register();
    require('./c-nexttask').register();
    require('./line-drawer').register();
};
