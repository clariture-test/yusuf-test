/*
Copyright (c) 2012-2014, Esmer Technologies, Inc. All Rights Reserved.

This source file is proprietary property of Esmer Technologies, Inc.
No part of this software or any of its contents may be reproduced, copied,
modified or adapted, without the prior written consent of the owner, unless
otherwise indicated for stand-alone materials.
*/

// globals: options, map, reports, sites

var reports = {
    call: null,
    selector: '#reports',

    update: function(str) {
        var _this = this;
        var search = str || '';
        if (this.call) this.call.abort();
        this.call = $.get('/reports/?device_type='+device_type+'&search='+search, function(data) {
            _this.call = null;
            $(_this.selector).html(data)
        })
    }
}
