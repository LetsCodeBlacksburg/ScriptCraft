var utils = require('utils');
var teleport = require('teleport');

var locations = persist('fasttravel-locations', { });

var options = {
  'save': function( params, sender ) { 
    if (params.length > 1) {
      var tagname = params[1];
      if (tagname in locations) {
      	echo(sender, '"' + tagname + '" tagname already exists. ' 
      	    + "Delete it first with:\n/jsp ft delete " + tagname);
      } else {
      	locations[tagname] = {
      	  "owner": '' + sender.name,
	  "location": utils.locationToJSON(sender.location) 
	};
	echo(sender, 'Location "' + tagname + '" saved');
      }
    } else {
      echo(sender, "No tagname specified. The correct command is:\n"
      	  + "/jsp ft save {tagname}");
    }
  },

  'list': function( params, sender ) { 
    if (! Object.keys(locations).length) echo(sender, "No saved locations");

    for (var name in locations) {
      var info = locations[name];
      echo(sender, 'Name: ' + name + ' Owner: ' + info.owner);
    }
  },

  'delete': function( params, sender ) { 
    if (params.length > 1) {
      var tagname = params[1];
      if (tagname in locations) {
	var info = locations[tagname];
	if (info.owner != sender.name) {
	  echo(sender, 'You are not the owner of tagname "' + tagname + '"');
	} else {
	  delete locations[tagname];
	  echo(sender, 'Location "' + tagname + '" deleted');
	}
      } else { echo(sender, 'No existing tagname "' + tagname + '"'); }
    } else {
      echo(sender, "No tagname specified. The correct command is:\n"
      	  + "/jsp ft delete {tagname}");
    }
  },

  'help': function( params, sender ) { 
    var helpMessages = [ 
      "/jsp ft save {tagname} : Save player location using tag name",
      "/jsp ft go {tagname} : Go to tag location",
      "/jsp ft list : List all existing tag locations",
      "/jsp ft delete {tagname} : Delete a tag location " 
      	+ "(You can only delete locations you've created)",
      "/jsp ft help : Print this help message"
    ];
    for (var i in helpMessages) {
      echo( sender,  helpMessages[i] );
    }
  },

  'go': function( params, sender ) { 
    if (params.length > 1) {
      var tagname = params[1];

      if (tagname in locations) {
      	var info = locations[tagname];
	teleport( sender, utils.locationFromJSON( info.location ) );
      } else { echo(sender, 'No existing tagname "' + tagname + '"'); }

    } else {
      echo(sender, "No tagname specified. The correct command is:\n"
      	  + "/jsp ft go {tagname}");
    }
  }
};

var optionList = [];
for ( var o in options ) {
  optionList.push(o);
}

command( 'ft', function ( params , sender) {

  var option = options[ params[0] ];

  if ( option ) {
    option( params, sender );
  } else {
    options.help( params, sender );
  }

}, optionList);
