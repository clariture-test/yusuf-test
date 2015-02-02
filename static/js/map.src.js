
var map = {
    markers: {},

    init: function() {
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(37.79398, -122.39961),
            //mapTypeId: google.maps.MapTypeId.ROADMAP
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }
        this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    },

    // It is used to show seperate infowindows. Otherwise, each marker uses the same infowindow
    bindInfoW: function(marker, contentString, infowindow, map) {
        google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
        });
    },

    select: function(row) {
        var td = $(row).find("td");
        if (td.eq(2).length && td.eq(3).length) {
            var site = td.eq(0).text();
            var lat = parseFloat(td.eq(2).text());
            var lng = parseFloat(td.eq(3).text());

            var latLng = new google.maps.LatLng(lat, lng);
            //console.log(latLng);

            var marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                title: site
            });

            this.markers[site] = marker;

            //map.panTo(new google.maps.LatLng(0.0, 0.0));
            this.map.panTo(latLng);
        }
    },

    deselect: function(row) {
        td = $(row).find("td");
        this.deselect_site(td.eq(0).text())
    },

    deselect_site: function(site) {
        if (this.markers[site]) {
            this.markers[site].setMap(null);
            delete this.markers[site];
        }
    },

    clear: function() {
        for (var site in this.markers) {
            this.deselect_site(site)
        }
    },
    
    loadScript: function() {
    	var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB97TS1GIYGHbf-lxRsuMR6jLIVIcPKO3A&sensor=false&' +
	    	'callback=map.init';
	    document.body.appendChild(script);
    }

}

window.onload = map.loadScript;
