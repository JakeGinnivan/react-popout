var context = require.context('./lib', true, /_tests\.jsx?$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);
