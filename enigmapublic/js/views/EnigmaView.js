define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/enigma_view.html', 
  'bootstrap'
], function($, _, Backbone, EnigmaViewTemplate, Bootstrap){
	var EnigmaView = Backbone.View.extend({
		el: $("#enigma"),
    session: null,

    rendered: false,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(EnigmaViewTemplate, {data: null});
      this.$el.html(template);

      $.getJSON("workflow.json", function(json) {
        console.log(json);

        var workflow = json.workflow;

        for (var i = 1; i < workflow.length; i++){
          $("#enigma").append(drawTask(workflow[i], i));
        }

        $(".newnote").click(function(){
          $(this).hide();
          $(this).parent().find(".notearea").show();
        });

        $(".savenote").click(function(){
          $(".newnote").show();
          $(".notearea").hide();
        });

        activateTask("1");

      });
    },

    hide: function(){
      this.$el.hide();
    },

    show: function(){      
      this.$el.show();
       if(!this.rendered) {
         this.render();
         this.rendered = true;
       }

      
    }
	});

  return EnigmaView;
});

var activeId = 1;

function drawTask(task, id){
  console.log("drawdrawdraw")
  if (task.type == 'Review') {
    var ret = '<div id="task-' + id + '" class="review-box card-box "><h2 class="text-left"><strong>[' + id + ']</strong> ';
  } else {
    var ret = '<div id="task-' + id + '" class="card-box"><h2 class="text-left"><strong>[' + id + ']</strong> ';
  }
  ret += task.name;
  ret += '</h2><hr>';

  ret += '<div id="task-bd-' + id + '"></div>'
  ret += '<div id="task-ft-' + id + '">'

  ret += '<span>Attached files: ';
  ret += '<button type="button" class="btn btn-info">Attach new file</button>&nbsp;&nbsp;<button class="btn btn-large btn-primary add-note" data-toggle="modal" data-target="#myModal">Add Note</button>';
  ret += '</span>';

  if (task.type == "Review"){
    ret += '<br><br><span class="pull-left">Reviewers: ';
    for (var i = 0; i < task.reviewee.length; i++){
      ret += task.reviewee[i];
      if (i+1 < task.reviewee.length) ret+= ", ";
    }
    ret += '</span></div>';
  }
  ret += '<br/><br/><div class="notearea" style="display:none">';
  ret += '<textarea rows="4" cols="50">Notes will be automatically saved...</textarea>';
  ret += '&nbsp&nbsp<button type="button" class="savenote btn btn-primary">Save note</button>';
  ret += '</div>';
  ret += '</div>';

  return ret
}

function activateTask(id){
  console.log("activate");
  $("#task-"+id).addClass('active-box');
  
  if (id == 1) {
    $("#task-ft-"+id).append('<span id="buttons-'+id+'" class="pull-right text-right">  <button class="btn btn-large btn-success complete-task">Finish Task</button></span>');
  } else {
    $("#task-ft-"+id).append('<span id="buttons-'+id+'" class="pull-right text-right"><button class="btn btn-large btn-primary add-note" data-toggle="modal" data-target="#myModal">Add Note</button> <button class="btn btn-large btn-danger undo-task">Undo Task</button> <button class="btn btn-large btn-success complete-task">Finish Task</button></span>');
  }

  $(".complete-task").click(function(e){
    e.preventDefault();
    deactivateTask(activeId);
    activateTask(activeId+1);
    activeId += 1;
  });

  $(".undo-task").click(function(e){
    e.preventDefault();
    deactivateTask(activeId); 
    activateTask(activeId-1); 
    activeId -= 1;
  });

  $("#enter-note").click(function(e){
    e.preventDefault();
    if ($("#note-content").val().length > 0){
      $("#task-bd-"+activeId).append("<p>&#183; " + $("#note-content").val() + "</p>");
    }
    $("#note-content").val('');
  });

  $("#close-note").click(function(e){
    e.preventDefault();
    $("#note-content").val('');
  });
}

function deactivateTask(id){

  $("#task-"+id).removeClass('active-box');
  $("#buttons-"+id).remove();

}
