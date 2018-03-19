const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


// Twilio Credentials
const accountSid = 'AC9e691e356b536b01f07e0ae9359a4806';
const authToken = 'd24240231570b30711cc252976d92917';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);



// Routers

router.get('/', (req, res) => {
 
    res.status(200).send("Use POST request with tel,imover and terms fields");
    
});


router.post('/', [

	check('tel','Phone number must be at least 9 chars long')
		.trim()
		.isLength({ min: 9 }),
 		
	check('tel','Phone number must be at maximum 16 chars long')
		.trim()
		.isLength({ max: 16 }),
	
	check('tel','Invalid phone number format')
		.trim()
		.matches(/^\+[0-9]{6,16}$/),
		 
	check('imover','You must be 18 years of age or older to participate')
		.exists()
		.custom((value, { req }) => value === 'true'),
		
	check('terms','Please accept the terms and conditions')
		.exists()
		.custom((value, { req }) => value === 'true'),
	],

	(req, res) => {
 
					
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(500).json({ errors: errors.mapped() });
	}
	
	
	// Check Date and create message
	let date = new Date();
	let hour = date.getHours();
	let message = "";

	if( hour < 12 ) message = "Good morning! Your promocode is AM123";
	else message = "Hello! Your promocode is PM456";
	
 
    // Send SMS
	let toPhone = req.body.tel;
	let fromPhone = '+18339883698';
	
	
	client.messages.create(
	{
		to: toPhone,
		from: fromPhone,
		body: message,
	},
	(err, message) => {
 
		if(err) res.status(500).json(err);
		else {
			
				let result = {	success:  {
								action: {	
									type: 'sms',
									msg: 'SMS has been sent',
									to: toPhone,
									sid: message.sid
								},					
							}
						};
							

				res.status(200).json(result);	
		
		}
	}
	);
	
	
	
	
	
	
 
});


module.exports = router;