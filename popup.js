$(document).ready(function() {
  $("#generateLink").on("click",generateLink);
  $("#link").on("click",selectAll);
});

function selectAll() {
  $("#link").focus();
  $("#link").select();
}
function generateLink() {
  chrome.tabs.query({'active': true,'currentWindow':true}, function(tabs) {
    var activeTab = tabs[0],
        url = activeTab.url;
    $.ajax({
      url:"http://wut.link/links",
      type:"POST",
      dataType: "json",
      data:{
        url:url
      },
      success: function(response,data) {
          $("#link").html(response.proxyUrl);
          $("#link").addClass("loaded");
      }
    });
  });
}
