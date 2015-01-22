$(document).ready(function() {
  $("#generateLink").on("click",generateLink);
  $("#link").on("click",selectAll);
  $("#copyButton").on("click",executeCopy);
});

function selectAll() {
  $("#link").focus();
  $("#link").select();
}
function executeCopy() {
    var input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = $("#link").html();
    input.focus();
    input.select();
    document.execCommand('Copy');
    input.remove();
    $(".linkHolder").addClass("copied");
    setTimeout(function() {
      $(".linkHolder").removeClass("copied");
    },2000);
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
          $(".linkHolder").addClass("loaded");
      }
    });
  });
}
