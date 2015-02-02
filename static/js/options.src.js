/*
Copyright (c) 2012-2014, Esmer Technologies, Inc. All Rights Reserved.

This source file is proprietary property of Esmer Technologies, Inc.
No part of this software or any of its contents may be reproduced, copied,
modified or adapted, without the prior written consent of the owner, unless
otherwise indicated for stand-alone materials.
*/

var options = {
    call: null,
    last_row: null,

    selected: {
        hash: {},
        length: 0,
        is_selected: function(id) {
            return id in this.hash
        },
        add: function(row) {
            if (!this.is_selected(row.id)) {
                this.hash[row.id] = row;
                this.length++
            }
        },
        remove: function(row) {
            if (this.is_selected(row.id)) {
                delete this.hash[row.id];
                this.length--
            }
        },
        sort: function() {
            var a = [];
            for (var key in this.hash) { 
                a.push(this.hash[key]);
            }
            a.sort(function(a, b) { return a.id > b.id? 1: -1; });
            return a;
        },
        list: function() {
            return $.map(this.hash, function(row) { return row.id })
        },
        clear: function() {
            this.hash = {};
            this.length = 0;
        }
    },

    _update_select_count: function() {
        $("#select_count").text(this.selected.length.toString());
    },

    _select: function(row) {
        $(row).addClass("highlight");
        this.selected.add(row);
        this._update_select_count();
    },

    _deselect: function(row) {
        $(row).removeClass("highlight");
        this.selected.remove(row)
        this._update_select_count();
    },

    select: function(row) {
        if (!this.selected.is_selected(row.id)) {
            this._select(row)
        }
    },

    deselect: function(row) {
        if (this.selected.is_selected(row.id)) {
            this._deselect(row)
        }
    },

    get_range: function(row) {
        return (row.rowIndex > this.last_row.rowIndex)?
            { first: this.last_row, last: row }:
            { first: row, last: this.last_row }
    },

    select_range: function(row) {
        if (this.last_row) {
            var _this = this;
            var range = this.get_range(row);
            $("table.multiselect tr")
            .slice(range.first.rowIndex, range.last.rowIndex)
            .each(function () {
                _this.select(this);
            });
            this.select(range.last)
        }
        else {
            this.select(row)
        }
    },

    deselect_range: function(row) {
        if (this.last_row) {
            var _this = this;
            var range = this.get_range(row);
            $("table.multiselect tr")
            .slice(range.first.rowIndex, range.last.rowIndex)
            .each(function () {
                _this.deselect(this);
            });
            this.deselect(range.last)
        }
        else {
            this.deselect(row)
        }
    },

    click: function(row) {
        if (row.className) {
            this.deselect(row)
        }
        else {
            this.select(row)
        }
        this.last_row = row
        
    },

    shift_click: function(row) {
        if (row.className) {
            this.deselect_range(row)
        }
        else {
            this.select_range(row)
        }
        this.last_row = row
    },

    update: function(str) {
        var _this = this;
        var search = str || ''
        if (this.call) this.call.abort();
        this.call = $.get("/devices/"+device_type+"/?search="+search, function(data) {
            _this.call = null;
            $("#options").html(data);
            for (name in _this.selected.hash) {
                $(document.getElementById(name)).addClass("highlight")
            }
        })
    },

    submit: function(action) {
        var select_form = $("#select_form");
        if (this.selected.length) {
            for (name in this.selected.hash) {
                select_form.append('<input type="hidden" name="option_list" value="'+name+'" />')
            }
            $("#action").val(action);
            select_form.submit()
        }
        else {
            $("#select_one").dialog({modal: true})
        }
    },

    show_selected: function() {
        var arr = this.selected.sort();
        table = $('<table class="multiselect"></table>');
        for(i=0; i<arr.length; i++) {
            table.append($(arr[i]))
        }
        $("#options").html(table)
        $("#search").val("");
        $("#search").focus();
    },

    clear_all: function() {
        this.selected.clear();
        $("table.multiselect tr.highlight").removeClass("highlight")
        $("#select_count").text("0");
        $("#search").focus();
    },

    bulk_select: function(s) {
        var _this = this;
        var not_found = [];
        $.each(s.split(/\W+/), function(i, v) {
            if (v) {
                var id = v.toUpperCase();
                row = document.getElementById(id);
                if (row) {
                    _this.select(row)
                }
                else {
                    not_found.push(id);
                }
            }
        });
        return not_found;
    },

    initialize: function() {
        var _this = this;
        $("#search").keyup(function(e) {
            if (e.keyCode != 16) {
                _this.update($(this).val());
            }
        });

        //$("table.multiselect tr").click(function() {
        //$("table.multiselect").on("click", "tr", function() {
        $(document).on("click", "table.multiselect tr", function(e) {
            if (e.shiftKey) {
                _this.shift_click(this)
            }
            else {
                _this.click(this)
            }
            $("#search").focus();
            //$("#select_count").text(options.selected.length.toString());
        });

    /*
        if(initials)
        {
            for(i=0; i<initials.length; i++)
                select_row(document.getElementById(initials[i]))
            $("#search").focus();
            $("#select_count").text(options.selected.length.toString());
        }
    */
        //_this.update();
        $("#search").focus();
    }

}
