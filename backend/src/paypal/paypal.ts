import { payPalConfig } from './paypal.config';

const {  clientId, currency, env} = payPalConfig;

export const PayPalPage = (amount: number, userId: string) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Add meta tags for mobile and IE -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title> PayPal Smart Payment </title>
</head>

<body>
    <!-- Set up a container element for the button -->
    <div id="paypal-button-container"></div>

    <!-- Include the PayPal JavaScript SDK -->
    <script src="https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency || 'USD'}"></script>

    <script>
    
        // Render the PayPal button into #paypal-button-container
        paypal.Buttons({

            style: {
                color: 'blue',
                shape: 'pill',
                label: 'pay',
                height: 40
            },

            env: '${env}',
            // Set up the transaction
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '${amount}'
                        }
                    }]
                });
            },

            // Finalize the transaction
            onApprove: function (data, actions) {

                return actions.order.capture()
                    .then(function (details) {
                        return fetch('/payment/verify/${amount}/${userId}/'+data.orderID, {
                            method: 'post'
                        })
                    })
                    .then(function (res) {
                        return res.json();
                    })
                    .then(function (orderData) {
                        // Show a success message to the buyer
                        window.postMessage(JSON.stringify({
                            reference: data.orderID,
                            message: "Added $${amount} successfully",
                            status: "success"
                        }))
                    }).catch(error => {
                        window.postMessage(JSON.stringify({
                            reference: data.orderID,
                            message: "Error: " + error && error.message,
                            status: "error"
                        }))
                    });
                ;
            }
        }).render('#paypal-button-container');

        // window.addEventListener("load", initApp);
    </script>
</body>

</html>
`;