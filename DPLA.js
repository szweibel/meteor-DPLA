if (Meteor.isClient) {
  var doSearch = function () {
    var searchTerm = document.getElementById("searchInput").value;
    var results = document.getElementById("results");

    Meteor.call('fetchFromService', searchTerm, function(err, respJson) {
        if (err) {
          console.log("fetchFromService error: ", err);
        } 
        else {
          console.log("term: '" + searchTerm + "', results: ", respJson);
        
          var $results = $(results);

          $results.empty();

          for (var i = 0; i < respJson.docs.length; i++) {
            var doc = respJson.docs[i];

            $results.append('<div>' + doc.sourceResource.title + '</div>');
          }
        }
    });
  };

  Template.DPLASearch.greeting = function () {
    return "Welcome to DPLA.";
  };

  Template.DPLASearch.events({
    'click input.search' : function () {
      doSearch();
    },

    'keypress input.searchTerm': function (evt) {
      if (evt.which === 13) {
        doSearch();
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    fetchFromService: function(searchTerm) {
      var url = 'http://api.dp.la/v2/items?api_key=08ff0483fd4916b9dafd6f46dc7d2599&q=' + searchTerm;
      var result = Meteor.http.get(url);

      if (result.statusCode == 200) {
        return JSON.parse(result.content);
      } 
      else {
        console.log("error fetching: ", result.statusCode);
        var errorJson = JSON.parse(result.content);
        throw new Meteor.Error(result.statusCode, errorJson.error);
      }
    }
  });
}
