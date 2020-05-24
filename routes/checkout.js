var express = require('express');
const prompt = require('prompt-sync')();
var router = express.Router();

var braintree = require('braintree');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

router.post('/', function(req, res, next) {
  var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    // use of braintree sandbox merchant details for braintree
    merchantId:   'dfj5vhjkw4dhmpfh',
    publicKey:    'xx3v27gdn8z46wh7',
    privateKey:   'ff86b72feef9abf126884c6f41655a17'
  });

  // Use the payment method nonce here
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  },function(error, result) {

    if (result) {

      var transID = result.transaction.id
      console.log(' Transaction ID: ' + transID ); // this line of code will return the transaction ID to the console, could display it to the client on the website but not necessary
      res.send(result);


      let refund1 = "" ;

      let refund = "";


        do{ // check user for wrong entry

          console.log(' Please key in Y or N');

          refund1 = prompt(' process refund? \(enter \"Y\" or \"N\" \)');// prompt for user entry refund or not

          refund = refund1.toUpperCase();// change user entry to upper case

          if(refund === 'Y'|| refund === 'YES') {

            let done = 0;
            //end of while

              let transID = prompt(' Key in Transaction ID to be refunded: ');

              gateway.transaction.refund(transID, function (err, result) {

              if (result) {

                let resulT = result.success;

                if (resulT) {

                  console.log('Transaction Successfully refunded ');//  message displayed when transaction is approved

                  done = 1;

                } else {

                  console.log('Refund Declined ');

                  for (var i in deepErrors) {

                    if (deepErrors.hasOwnProperty(i)) {

                      console.log(deepErrors[i].message);
                    }
                  }
                }

              }//end of if

              else if(!result){

                console.log("Wrong Transaction ID");

              }



            });// end of refund




          }

          else if(refund === 'N'|| refund === 'NO')
          {
            console.log("Not refunded");
          }

      }while(refund !== 'Y'&& refund !== 'YES'&& refund !== 'N'&& refund !== 'NO')// end of while loop
    }
    else {
      res.status(500).send(error);// return error
    }
  });
});

module.exports = router;
