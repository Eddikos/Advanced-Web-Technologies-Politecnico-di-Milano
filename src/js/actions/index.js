/*jslint node: true, nomen: true */
"use strict";

exports.createActions = function (options) {
    return {
        'logout': require('./logout').createAction(options)
        ,'registration': require('./registration').createAction(options)
        ,'editmanagerprofile': require('./editmanagerprofile').createAction(options)
        ,'workerprofilechange': require('./workerprofilechange').createAction(options)
        ,'createcampaign': require('./createcampaign').createAction(options)
        ,'startstopcampaign': require('./startstopcampaign').createAction(options)
        ,'enabledisable': require('./enabledisable').createAction(options)
        ,'upload': require('./upload').createAction(options)
        ,'sessionstart': require('./sessionstart').createAction(options)
        ,'login': require('./login').createAction(options)
        ,'editcampaigndetails': require('./editcampaigndetails').createAction(options)
        ,'deleteimageaction': require('./deleteimageaction').createAction(options)
        ,'sendresults': require('./sendresults').createAction(options)
        ,'getNextTask': require('./sessionstart').me()
    };
};
