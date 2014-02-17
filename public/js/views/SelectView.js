define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'text!templates/select_view.html'
], function($, _, Backbone, Util, SelectViewTemplate){

  var SelectView = Backbone.View.extend({
    el: $("#select"),
    session: null,

    rendered: false,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
      this.$el.html("");
      var template = _.template(SelectViewTemplate, {data: null});
      this.$el.html(template);

      var treeKeys = this.session.treeKeys;
      var treeNames = this.session.treeNames;

      var that = this;
      for (var i = 0; i < treeKeys.length; i++) {
        $("#selecttable")
          .append("<tr id='" + treeKeys[i] + "'><td id='"+i+"' class='treename'>" + treeNames[i] + "</td><td>" +
            '<button id="' + treeKeys[i] + '" type="button" class="analyzebutton btn btn-primary">Analyze</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
            '<button id="' + i + '" type="button" class="renamebutton btn btn-primary">Rename</button></td><td style="float-right">' +
            '<button id="' + i + '" type="button" class="deletebutton btn btn-danger">Delete</button>' +

            "</td><tr/>");

        $("button.analyzebutton").click(function(){
          that.session.currentTree = this.id;
          that.session.tree = JSON.parse(that.session.getTree(this.id));
          window.location.href = "#/tree";
        });


        $("button.renamebutton").click(function(){
          var i = $(this).attr("id");
          $("td#" + i).html("<input id='" + treeKeys[i] + "' class='treenameedit' type='text' value='" + that.session.treeNames[i] + "' />" +
                                "<button id='" + treeKeys[i] + "' type='button' class='donerename btn btn-primary'>done</button>");
          $("button.donerename").click(function(){
            var sourceId = $(this).attr("id");

            // TODO: make jquery more specific
            var newName = $("input.treenameedit")[0].value;
            Util.ajaxPOST("../tree/changename",
              {
                name: newName,
                key: sourceId
              },
              function(data){
                 Util.ajaxPOST("../getalltrees",
                              {
                                email: that.session.email
                              },
                              function(data) {
                                if (!data.success) console.log("all tree aren't successful... proceeding anyways");
                                that.session.treeKeys = data.keys;
                                that.session.treeNames = data.names;
                                that.render();
                              },
                              function() { console.log("could not get all trees"); },
                              function() {});
              },
              function(){ console.log("error: failed to upload empty tree"); },
              function(){});
          });
        });

        $("button.deletebutton").click(function(){
          var i = $(this).attr("id");
          Util.ajaxPOST("../tree/deletetree",
            {
              key: treeKeys[i]
            },
            function(data){
               Util.ajaxPOST("../getalltrees",
                            {
                              email: that.session.email
                            },
                            function(data) {
                              if (!data.success) console.log("all tree aren't successful... proceeding anyways");
                              that.session.treeKeys = data.keys;
                              that.session.treeNames = data.names;
                              that.render();
                            },
                            function() { console.log("could not get all trees"); },
                            function() {});
            },
            function(){ console.log("error: failed to upload empty tree"); },
            function(){});
        });
      }

      $("#createnewtree").click(function(){
        Util.ajaxPOST("../newtree",
          {
            name: Date(),
            tree: JSON.stringify({}),
            key: false,
            email: that.session.email
          },
          function(data){
            that.session.treeKeys.push(data.key);
            that.session.treeNames.push(Date());
            that.render();
          },
          function(){ console.log("error: failed to upload empty tree"); },
          function(){});
      });
    },

    hide: function(){
      this.$el.hide();
    },

    show: function(){
      this.$el.show();

      Util.logAction(this.session.email, "Tree Select Page", "null");

      if(!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }
  });

  return SelectView;
  
});
