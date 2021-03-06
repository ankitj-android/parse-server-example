
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('pushChannelTest', function(request, response) {

  // request has 2 parameters: params passed by the client and the authorized user
  var params = request.params;
  var user = request.user;

  // extract out the channel to send
  var action = params.action;
  var message = params.message;
  var targetUserId = params.targetUserId

// data
  var title = params.title
  var text = params.text
  var orderId = params.orderId
  var fromChef = params.fromChef

  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", targetUserId);

  // use to custom tweak whatever payload you wish to send
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");
  pushQuery.matchesQuery("user", userQuery);

  var payload =  {
      "alert": message,
      "action": action,
      "title": title,
      "text": text,
      "fromChef": fromChef,
      "orderId": orderId
  };

  // Note that useMasterKey is necessary for Push notifications to succeed.

  Parse.Push.send({
  where: pushQuery,
  data : payload,     // for sending to a specific channel                                                                                                                                 data: payload,
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});


Parse.Cloud.define('pingReply', function(request, response) {
  var params = request.params;
  var customData = params.customData;

  if (!customData) {
    response.error("Missing customData!")
  }

  var sender = JSON.parse(customData).sender;
  var query = new Parse.Query(Parse.Installation);
  query.equalTo("installationId", sender);

  Parse.Push.send({
  where: query,
  // Parse.Push requires a dictionary, not a string.
  data: {"alert": "The Giants scored!"},
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});
